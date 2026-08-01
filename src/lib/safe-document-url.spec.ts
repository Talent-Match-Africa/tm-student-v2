import { describe, expect, it } from "vitest";
import { isSafeDocumentUrl } from "./safe-document-url";

describe("isSafeDocumentUrl", () => {
  it("accepts secure signed URLs", () => {
    expect(isSafeDocumentUrl("https://storage.example/file?signature=one")).toBe(true);
  });

  it("rejects scripts, insecure URLs, and malformed input", () => {
    expect(isSafeDocumentUrl("javascript:alert(1)")).toBe(false);
    expect(isSafeDocumentUrl("http://storage.example/file")).toBe(false);
    expect(isSafeDocumentUrl("not a URL")).toBe(false);
  });
});
