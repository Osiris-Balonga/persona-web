import assert from "node:assert/strict";
import test from "node:test";
import { getSkinToneSwatch, skinToneSwatches } from "../src/lib/skin-tone-swatches.ts";

test("skin tone swatches match the review palette and expose no unsupported values", () => {
  assert.deepEqual(skinToneSwatches.map(({ value }) => value), [1,2,3,4,5,6,7,8,9,10]);
  assert.equal(skinToneSwatches[0].color, "#f7ede4");
  assert.equal(skinToneSwatches[9].color, "#2a2420");
  assert.equal(getSkinToneSwatch(5)?.color, "#d7bd96");
  assert.equal(getSkinToneSwatch(0), undefined);
});
