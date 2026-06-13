import test from "node:test";
import assert from "node:assert/strict";
import { extractInspectableUrl, safeUrlHostname } from "./url.js";

test("extractInspectableUrl normalizes http and www URLs", () => {
  assert.equal(extractInspectableUrl("https://example.com"), "https://example.com");
  assert.equal(extractInspectableUrl("www.example.com/login"), "https://www.example.com/login");
  assert.equal(extractInspectableUrl("example.com"), "https://example.com");
});

test("extractInspectableUrl rejects non-URL text", () => {
  assert.equal(extractInspectableUrl("hello world"), null);
  assert.equal(extractInspectableUrl("UPI payment request"), null);
});

test("safeUrlHostname returns the hostname for valid URLs", () => {
  assert.equal(safeUrlHostname("https://sub.example.com/path"), "sub.example.com");
  assert.equal(safeUrlHostname("not a url"), "");
});
