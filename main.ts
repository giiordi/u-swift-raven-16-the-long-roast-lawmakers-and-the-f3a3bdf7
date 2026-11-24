// The Long Roast: Lawmakers and the File They Cannot Convert
// Entry: one satirical sentence, 1-320 chars, written to entry.txt.
// Node stdlib only. No trailing newline: the file is exactly one line.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "After six hearings, three consultants, and a $4 million modernization contract, Congress still can't convert the file — but it did convert the failure into a subcommittee, a press release, and a re-election ad.";

const MIN_CHARS = 1;
const MAX_CHARS = 320;

function fail(message: string): never {
  console.error(`gate failed: ${message}`);
  process.exit(1);
}

// Gate: one satirical sentence, 1-320 characters.
const text = ENTRY.trim();
if (text.length < MIN_CHARS || text.length > MAX_CHARS) {
  fail(`entry is ${text.length} chars, gate wants ${MIN_CHARS}-${MAX_CHARS}`);
}
if (text !== ENTRY) {
  fail("entry has leading or trailing whitespace");
}
// Exactly one sentence: a single terminal mark, at the very end.
const terminators = text.match(/[.!?]/g) ?? [];
if (terminators.length !== 1 || !/[.!?]$/.test(text)) {
  fail("entry must be exactly one sentence");
}
// No line breaks anywhere: the output must be a single line.
if (/[\r\n]/.test(text)) {
  fail("entry must not contain a line break");
}
// No sloppy spacing or invisible characters: one clean sentence.
if (/  /.test(text) || /[\u0000-\u001f\u007f]/.test(text)) {
  fail("entry must not contain double spaces or control characters");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output/entry.txt";
const dir = outDir.endsWith("entry.txt")
  ? outDir.slice(0, -"entry.txt".length) || "."
  : outDir;
mkdirSync(dir, { recursive: true });
const outPath = join(dir, "entry.txt");
writeFileSync(outPath, text, "utf8");
console.log(`wrote ${text.length} chars to ${outPath}`);
