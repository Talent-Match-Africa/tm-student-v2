"use client";

import { useState } from "react";
import styles from "@/components/shared/SelfService.module.css";
import { isSafeDocumentUrl } from "@/lib/safe-document-url";

export function ResourceAccessButton({ resourceId }: { resourceId: string }) {
  const [pending, setPending] = useState(false);

  async function openDocument() {
    setPending(true);
    const response = await fetch(`/api/student/resources/${resourceId}/access`);
    const payload = (await response.json()) as { url?: string };
    setPending(false);
    if (response.ok && payload.url && isSafeDocumentUrl(payload.url)) {
      window.open(payload.url, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <button
      className={styles.action}
      disabled={pending}
      onClick={openDocument}
      type="button"
    >
      {pending ? "Preparing…" : "Open document"}
    </button>
  );
}
