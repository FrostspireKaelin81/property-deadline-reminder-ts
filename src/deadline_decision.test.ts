import assert from "node:assert/strict";
import test from "node:test";
import { shouldRemind } from "./deadline_decision.ts";

test("selects a deadline inside the lead window and excludes a later one", () => {
  const today = "2026-08-10";
  assert.equal(shouldRemind({ kind: "inspection", reference: "unit-3b", dueOn: "2026-08-12" }, today, 7), true);
  assert.equal(shouldRemind({ kind: "tenant-document", reference: "lease-204", dueOn: "2026-08-21" }, today, 7), false);
});
