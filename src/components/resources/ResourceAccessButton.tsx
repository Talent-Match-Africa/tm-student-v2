"use client";
import { useState } from "react";
import { Download04Icon } from "@hugeicons/core-free-icons";
import { HugeIcon } from "@/components/shared/HugeIcon";
import { isSafeDocumentUrl } from "@/lib/safe-document-url";

export function ResourceAccessButton({ resourceId }: { resourceId: string }) {
  const [pending, setPending] = useState(false);
  async function openDocument() { setPending(true); try { const response = await fetch(`/api/student/resources/${resourceId}/access`); const payload = await response.json() as { url?: string }; if (response.ok && payload.url && isSafeDocumentUrl(payload.url)) window.open(payload.url, "_blank", "noopener,noreferrer"); } finally { setPending(false); } }
  return <button disabled={pending} onClick={() => void openDocument()} type="button"><HugeIcon icon={Download04Icon} size={14} />{pending ? "Preparing…" : "Open"}</button>;
}
