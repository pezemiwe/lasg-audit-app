import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join } from "path";

function walk(dir) {
  const files = [];
  for (const f of readdirSync(dir)) {
    const full = join(dir, f);
    if (statSync(full).isDirectory()) files.push(...walk(full));
    else if (/\.(ts|tsx)$/.test(f)) files.push(full);
  }
  return files;
}

// Box-drawing characters corrupted from UTF-8 to Latin-1 and back
// U+2500 ─ = E2 94 80 => â (E2) + " (94 as win1252) + € (80 as win1252)
// The key corrupted sequences:
const replacements = [
  ["\u00e2\u0094\u0080", "─"], // BOX DRAWINGS LIGHT HORIZONTAL
  ["\u00e2\u0094\u0082", "│"], // BOX DRAWINGS LIGHT VERTICAL
  ["\u00e2\u0094\u009c", "├"], // BOX DRAWINGS LIGHT VERTICAL AND RIGHT
  ["\u00e2\u0094\u0094", "└"], // BOX DRAWINGS LIGHT UP AND RIGHT
  ["\u00e2\u0094\u0090", "┌"], // BOX DRAWINGS LIGHT DOWN AND RIGHT
  ["\u00e2\u0094\u0098", "┘"], // BOX DRAWINGS LIGHT UP AND LEFT
  ["\u00e2\u0094\u00ac", "┬"], // BOX DRAWINGS LIGHT DOWN AND HORIZONTAL
  ["\u00e2\u0094\u00b4", "┴"], // BOX DRAWINGS LIGHT UP AND HORIZONTAL
  ["\u00e2\u0094\u00bc", "┼"], // BOX DRAWINGS LIGHT VERTICAL AND HORIZONTAL
  // Em/en dashes (already fixed but just in case)
  ["\u00e2\u0080\u0094", "—"],
  ["\u00e2\u0080\u0093", "–"],
  // Smart quotes
  ["\u00e2\u0080\u0099", "\u2019"],
  ["\u00e2\u0080\u009c", "\u201c"],
  ["\u00e2\u0080\u009d", "\u201d"],
  ["\u00e2\u0080\u0098", "\u2018"],
  // Naira sign
  ["\u00e2\u0082\u00a6", "₦"],
  // Bullet, arrow
  ["\u00e2\u0080\u00a2", "•"],
  ["\u00e2\u0086\u0092", "→"],
];

let total = 0;
for (const f of walk(join(process.cwd(), "src"))) {
  let content = readFileSync(f, "utf8");
  let changed = false;
  for (const [bad, good] of replacements) {
    if (content.includes(bad)) {
      content = content.split(bad).join(good);
      changed = true;
    }
  }
  if (changed) {
    writeFileSync(f, content, "utf8");
    total++;
    console.log("Fixed:", f.replace(process.cwd(), ""));
  }
}
console.log(`\nDone — ${total} file(s) fixed`);
