#!/usr/bin/env python3
"""One-time export of the small open-source embedding model used by search Layer 3.

Layer 3 only MEASURES similarity between a query and catalog records; it never writes text.
The model is a "static" embedding model (a lookup table of word-piece vectors that are averaged),
so the page needs no neural-network runtime and downloads about 4 MB once.

Model: minishlab/potion-base-4M (MIT licence, distilled from BAAI/bge-base-en-v1.5, also MIT).
This script downloads it from Hugging Face and writes self-hosted, 8-bit-quantised copies into
site/data/l3/, so visitors never contact a third party. Re-run only to change the model.

Needs: pip install huggingface_hub safetensors numpy
"""
import hashlib, json, os, sys
import numpy as np
from huggingface_hub import snapshot_download
from safetensors.numpy import load_file

REPO = "minishlab/potion-base-4M"
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
    scale = np.abs(emb).max(axis=1) / 127.0
    scale[scale == 0] = 1.0
    q = np.clip(np.round(emb / scale[:, None]), -127, 127).astype(np.int8)
    q.tofile(os.path.join(OUT, "tokens.i8"))
    scale.astype("<f4").tofile(os.path.join(OUT, "tokens.scale"))
    with open(os.path.join(OUT, "vocab.txt"), "w", encoding="utf-8") as f:
        f.write("\n".join(by_id) + "\n")
    err = np.abs(q * scale[:, None] - emb).max()
    meta = {
        "model": REPO, "licence": "MIT", "source": "https://huggingface.co/" + REPO,
        "dim": int(emb.shape[1]), "vocab_size": int(emb.shape[0]), "unk_token": tok["model"]["unk_token"],
        "quantisation": "int8 per row, float32 scale", "max_quantisation_error": float(err),
        "how_it_works": "text -> lower-case word pieces -> average of their vectors -> unit length",
    }
    json.dump(meta, open(os.path.join(OUT, "model.json"), "w"), indent=2)
    open(os.path.join(OUT, "NOTICE.txt"), "w").write(
        "Layer 3 similarity model: minishlab/potion-base-4M (MIT licence), by Minish Lab,\n"
        "distilled from BAAI/bge-base-en-v1.5 (MIT licence). https://huggingface.co/minishlab/potion-base-4M\n"
        "The files here are an 8-bit-quantised copy of its token vectors and vocabulary.\n"
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
