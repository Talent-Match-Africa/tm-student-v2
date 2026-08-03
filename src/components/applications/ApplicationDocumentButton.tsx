"use client";

import { useState } from "react";
import { Download04Icon, File01Icon } from "@hugeicons/core-free-icons";
import { HugeIcon } from "@/components/shared/HugeIcon";
import { isSafeDocumentUrl } from "@/lib/safe-document-url";
import styles from "./ApplicationDocumentButton.module.css";

export function ApplicationDocumentButton({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function open() {
    setPending(true);
    setError(null);
    try {
      const response = await fetch(href);
      const payload = (await response.json()) as { url?: string };
      if (response.ok && payload.url && isSafeDocumentUrl(payload.url)) {
        window.open(payload.url, "_blank", "noopener,noreferrer");
        return;
      }
      setError("This document could not be opened. Try again.");
    } catch {
      setError("Check your connection and try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className={styles.control}>
      <button
        aria-describedby={error ? `${href}-error` : undefined}
        className={styles.button}
        disabled={pending}
        onClick={open}
        type="button"
      >
        <span className={styles.fileIcon} aria-hidden="true">
          <HugeIcon icon={File01Icon} size={17} />
        </span>
        <span>
          <strong>{pending ? "Preparing secure access…" : label}</strong>
          <small>{pending ? "Generating your private link" : "Opens in a new tab"}</small>
        </span>
        <HugeIcon icon={Download04Icon} size={17} />
      </button>
      {error ? <p className={styles.error} id={`${href}-error`} role="alert">{error}</p> : null}
    </div>
  );
}
