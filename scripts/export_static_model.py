#!/usr/bin/env python3
"""One-time export of the small open-source embedding model used by search Layer 3.

Layer 3 only MEASURES similarity between a query and catalog records; it never writes text.
The model is a "static" embedding model (a lookup table of word-piece vectors that are averaged),
so the page needs no neural-network runtime and downloads about 1 MB once.

Model: minishlab/potion-base-4M (MIT licence, distilled from BAAI/bge-base-en-v1.5, also MIT).
This script downloads it from Hugging Face and writes self-hosted, pruned, 4-bit-quantised copies into
site/data/l3/, so visitors never contact a third party. Re-run only to change the model.

Needs: pip install huggingface_hub safetensors numpy
"""
import hashlib, json, os, sys
import numpy as np
from huggingface_hub import snapshot_download
from safetensors.numpy import load_file

REPO = "minishlab/potion-base-4M"
LOW_IDS = 6000
NOISE_WEIGHT = 0.25  # tuned on the off-topic and paraphrase queries in data/search-eval.yaml
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "site", "data", "l3")


def main():
    os.makedirs(OUT, exist_ok=True)
    src = snapshot_download(REPO)
    emb = load_file(os.path.join(src, "model.safetensors"))["embeddings"].astype(np.float32)
    tok = json.load(open(os.path.join(src, "tokenizer.json"), encoding="utf-8"))
    vocab = tok["model"]["vocab"]
    assert len(vocab) == emb.shape[0], (len(vocab), emb.shape)
    by_id = [None] * len(vocab)
    for t, i in vocab.items():
        by_id[i] = t
    assert all(t is not None and "\n" not in t for t in by_id)
    # Pruning: ship vectors only for (a) every word piece that occurs in the catalog's record texts (listed by
    # `node scripts/build_vectors.mjs` in scripts/fixtures/l3_used_pieces.json) and (b) the LOW_IDS lowest
    # word-piece ids (BERT-style vocabularies are roughly frequency-ordered, so these are the common
    # pieces visitors' queries are made of). vocab.txt stays complete, so segmentation is unchanged; a
    # piece without a vector simply contributes nothing.
    used_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "fixtures", "l3_used_pieces.json")
    if not os.path.exists(used_path):
        sys.exit("Missing %s. Run: python3 scripts/build_index.py && node scripts/build_vectors.mjs first." % used_path)
    used = set(json.load(open(used_path)))
    keep = np.zeros(emb.shape[0], dtype=bool)
    keep[list(used)] = True
    keep[:LOW_IDS] = True
    rows = np.flatnonzero(keep)
    kept = emb[rows]
    # 4-bit signed values (-7..7), per-row scale stored as float16; two values per byte (low nibble first)
    scale = (np.abs(kept).max(axis=1) / 7.0).astype(np.float16)
    scale[scale == 0] = 1.0
    sc32 = scale.astype(np.float32)
    q = np.clip(np.round(kept / sc32[:, None]), -7, 7).astype(np.int8)
    u = (q + 8).astype(np.uint8)
    packed = (u[:, 0::2] | (u[:, 1::2] << 4)).astype(np.uint8)
    packed.tofile(os.path.join(OUT, "tokens.q4"))
    scale.astype("<f2").tofile(os.path.join(OUT, "tokens.scale"))
    np.packbits(keep, bitorder="little").tofile(os.path.join(OUT, "tokens.keep"))
    for old in ("tokens.i8",):
        if os.path.exists(os.path.join(OUT, old)):
            os.remove(os.path.join(OUT, old))
    with open(os.path.join(OUT, "vocab.txt"), "w", encoding="utf-8") as f:
        f.write("\n".join(by_id) + "\n")
    err = np.abs(q * sc32[:, None] - kept).max()
    # A pruned piece used to add its own (mostly random) direction to a query's average, which lowered the
    # similarity of nonsense and rare-word queries. semantic.js mimics that by adding this much squared length
    # to the denominator for every dropped piece: NOISE_WEIGHT x the mean squared length of the pruned rows.
    pruned_sq = float((emb[~keep] ** 2).sum(axis=1).mean())
    meta = {
        "model": REPO, "licence": "MIT", "source": "https://huggingface.co/" + REPO,
        "dim": int(emb.shape[1]), "vocab_size": int(emb.shape[0]), "unk_token": tok["model"]["unk_token"],
        "quantisation": "4-bit signed per row, float16 scale", "token_bits": 4, "kept_rows": int(len(rows)), "low_ids_kept": LOW_IDS,
        "pruned_noise": round(NOISE_WEIGHT * pruned_sq, 3), "max_quantisation_error": float(err),
        "how_it_works": "text -> lower-case word pieces -> average of their vectors -> unit length",
    }
    json.dump(meta, open(os.path.join(OUT, "model.json"), "w"), indent=2)
    open(os.path.join(OUT, "NOTICE.txt"), "w").write(
        "Layer 3 similarity model: minishlab/potion-base-4M (MIT licence), by Minish Lab,\n"
        "distilled from BAAI/bge-base-en-v1.5 (MIT licence). https://huggingface.co/minishlab/potion-base-4M\n"
        "The files here are a pruned, 4-bit-quantised copy of its token vectors, plus its vocabulary.\n"
        "The model only measures similarity between a query and catalog records. It writes no text.\n")
    # parity fixture: the Node tokenizer must give these exact ids (checked by scripts/test_semantic.mjs)
    from tokenizers import Tokenizer
    t = Tokenizer.from_file(os.path.join(src, "tokenizer.json"))
    cases = ["How do Shias pray?", "Ḥusayn, Hussain & Hussein", "Nahj al-Balāgha: the Peak of Eloquence", "khums (religious payment)",
             "Why do people beat their chests and cry for Hussain?", "صلاة نماز", "naïve café résumé", "state-of-the-art 3.14 U.S.A.",
             "  multiple   spaces\tand\ttabs ", "A" * 150, "Imam al-Mahdi (a.s.) — the hidden Imam", "what is the ruling on x/y+z?",
             "日本語 text", "ﬁne ligature and ② symbols", "", "i'm can't it's"]
    fx = []
    for c in cases:
        ids = [i for i in t.encode(c, add_special_tokens=False).ids if i != vocab[tok["model"]["unk_token"]]]
        fx.append({"text": c, "ids": ids})
    fx_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "fixtures", "tokenizer_cases.json")
    with open(fx_path, "w", encoding="utf-8") as f:
        json.dump(fx, f, ensure_ascii=False, indent=1)
    for n in sorted(os.listdir(OUT)):
        print(n, os.path.getsize(os.path.join(OUT, n)))


if __name__ == "__main__":
    main()
