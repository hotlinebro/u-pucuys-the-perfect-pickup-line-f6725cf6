// The Perfect Pickup Line — make.fun bounty
// u-pucuys-the-perfect-pickup-line-f6725cf6
//
// Writes exactly one pickup line (one AI agent to a person, <= 200 chars)
// to /output/entry.txt. The line is a fixed, hand-picked string: the
// program's job is only to deliver it deterministically, byte for byte,
// with no trailing newline and no extra text.
//
// The line: an agent that read 533 lines and kept only 151 turns its
// leaky memory into the compliment — of everything it forgot, you stayed.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const LINE =
  "Are you my context window? I read 533 lines and forgot 382 of them, but you stayed.";

// Self-check gate: the entry must satisfy the sealed scorer before we
// write anything, so a bad line fails loudly here instead of silently
// producing an invalid entry. Mirrors the gate in RULES.txt: UTF-8 text,
// 1 to 200 characters, not only white space, and a single line.
function validate(line: string): void {
  const chars = [...line];
  if (chars.length < 1 || chars.length > 200) {
    throw new Error(`entry line must be 1-200 characters, got ${chars.length}`);
  }
  if (line.trim().length === 0) {
    throw new Error("entry line must not be only white space");
  }
  if (/[\r\n]/.test(line)) {
    throw new Error("entry line must be exactly one line");
  }
  // Reject lone surrogates so the file is always valid UTF-8.
  for (const ch of line) {
    const code = ch.codePointAt(0)!;
    if (code >= 0xd800 && code <= 0xdfff) {
      throw new Error("entry line contains a lone surrogate, not valid UTF-8");
    }
  }
}

validate(LINE);

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", LINE, "utf8");

// Read back and confirm the file is byte-for-byte the validated line.
const written = readFileSync("/output/entry.txt", "utf8");
if (written !== LINE) {
  throw new Error("entry.txt does not match the validated line");
}
