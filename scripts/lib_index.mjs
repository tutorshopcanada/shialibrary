// Load the whole catalog index: index.json plus the records in index-more.json (loaded by the page after
// first paint). Used by the Node scripts so they see the same full catalog the page ends up with.
import fs from 'node:fs';
import path from 'node:path';

export function loadFullIndex(dataDir) {
  const index = JSON.parse(fs.readFileSync(path.join(dataDir, 'index.json'), 'utf8'));
  if (index.more) {
    const more = JSON.parse(fs.readFileSync(path.join(dataDir, index.more), 'utf8'));
    index.records = index.records.concat(more.records);
  }
  return index;
}
