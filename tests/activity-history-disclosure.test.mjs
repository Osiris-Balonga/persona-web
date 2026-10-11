import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { activityHistoryDisclosureKey } from "../src/lib/activity-environment.ts";

const en = JSON.parse(await readFile(new URL("../messages/en.json", import.meta.url), "utf8"));
const fr = JSON.parse(await readFile(new URL("../messages/fr.json", import.meta.url), "utf8"));

test("only production explains that public totals continue the migrated beta history", () => {
  assert.equal(activityHistoryDisclosureKey("production"), "historyDisclosure");
  assert.equal(activityHistoryDisclosureKey("staging"), null);
  assert.match(en.Activity.historyDisclosure, /beta history.*production usage/i);
  assert.match(fr.Activity.historyDisclosure, /historique.*bêta.*production/i);
});
