"use client";

import { useState } from "react";
import styles from "@/components/shared/SelfService.module.css";
import { isSafeDocumentUrl } from "@/lib/safe-document-url";

export function ApplicationDocumentButton({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  const [pending, setPending] = useState(false);

  async function open() {
    setPending(true);
    const response = await fetch(href);
    const payload = (await response.json()) as { url?: string };
    setPending(false);
    if (response.ok && payload.url && isSafeDocumentUrl(payload.url)) {
      window.open(payload.url, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <button
      className={styles.secondary}
      disabled={pending}
      onClick={open}
      type="button"
    >
      {pending ? "Preparing…" : label}
    </button>
  );
}
