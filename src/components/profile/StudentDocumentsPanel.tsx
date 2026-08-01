"use client";
import { useRef, useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Delete02Icon,
  File01Icon,
  RefreshIcon,
  Upload02Icon,
} from "@hugeicons/core-free-icons";
import { AuthButton } from "@/components/shared/AuthButton";
import { HugeIcon } from "@/components/shared/HugeIcon";
import type { StudentDocument } from "@/types/student-self-service";
import styles from "./StudentDocumentsPanel.module.css";

export function StudentDocumentsPanel({
  documents,
}: {
  documents: StudentDocument[];
}) {
  const router = useRouter();
  const uploadRef = useRef<HTMLInputElement>(null);
  const replaceRef = useRef<HTMLInputElement>(null);
  const [feedback, setFeedback] = useState("");
  const [pending, setPending] = useState<"upload" | "replace" | string | null>(
    null,
  );
  const ordered = [...documents].sort(
    (left, right) =>
      new Date(right.created_at).getTime() -
      new Date(left.created_at).getTime(),
  );
  const latest = ordered[0] ?? null;
  async function send(file: File | undefined, mode: "upload" | "replace") {
    if (!file || !validFile(file)) {
      setFeedback("Choose a PDF, DOC, or DOCX file no larger than 10 MB.");
      return;
    }
    setPending(mode);
    setFeedback("");
    const body = new FormData();
    body.set("document", file, file.name);
    try {
      const response = await fetch(
        mode === "replace" && latest
          ? `/api/student/documents/${latest.id}`
          : "/api/student/documents",
        { body, method: mode === "replace" ? "PATCH" : "POST" },
      );
      const payload = (await response.json()) as { message?: string };
      setFeedback(
        response.ok
          ? mode === "replace"
            ? "Your primary CV was replaced."
            : "Your new CV was uploaded and is now the primary document."
          : (payload.message ?? "The document could not be saved."),
      );
      if (response.ok) router.refresh();
    } catch {
      setFeedback(
        "The document could not be saved. Check your connection and try again.",
      );
    } finally {
      setPending(null);
      if (uploadRef.current) uploadRef.current.value = "";
      if (replaceRef.current) replaceRef.current.value = "";
    }
  }
  async function remove(documentId: string) {
    if (!window.confirm("Delete this document?")) return;
    setPending(documentId);
    const response = await fetch(`/api/student/documents/${documentId}`, {
      method: "DELETE",
    });
    setFeedback(
      response.ok ? "Document deleted." : "Document could not be deleted.",
    );
    setPending(null);
    if (response.ok) router.refresh();
  }
  function choose(
    event: ChangeEvent<HTMLInputElement>,
    mode: "upload" | "replace",
  ) {
    void send(event.target.files?.[0], mode);
  }
  return (
    <div className={styles.workspace}>
      {latest ? (
        <section className={styles.primary}>
          <span className={styles.primaryIcon} aria-hidden="true">
            <HugeIcon icon={File01Icon} size={20} />
          </span>
          <div className={styles.primaryCopy}>
            <span>Primary application CV</span>
            <strong>{latest.file_name}</strong>
            <small>
              Uploaded {formatDate(latest.created_at)} · shown first when you
              apply
            </small>
          </div>
          <div className={styles.primaryActions}>
            <input
              accept={ACCEPT}
              className={styles.fileInput}
              onChange={(event) => choose(event, "replace")}
              ref={replaceRef}
              type="file"
            />
            <AuthButton
              icon={RefreshIcon}
              isLoading={pending === "replace"}
              loadingLabel="Replacing"
              onClick={() => replaceRef.current?.click()}
              type="button"
              variant="secondary"
            >
              Replace CV
            </AuthButton>
          </div>
        </section>
      ) : null}
      <section className={styles.upload}>
        <span className={styles.uploadIcon} aria-hidden="true">
          <HugeIcon icon={Upload02Icon} size={19} />
        </span>
        <div className={styles.uploadCopy}>
          <strong>{latest ? "Upload a newer CV" : "Add your first CV"}</strong>
          <span>
            PDF, DOC, or DOCX · maximum 10 MB. A new upload becomes your primary
            application document.
          </span>
        </div>
        <input
          accept={ACCEPT}
          className={styles.fileInput}
          onChange={(event) => choose(event, "upload")}
          ref={uploadRef}
          type="file"
        />
        <AuthButton
          icon={Upload02Icon}
          isLoading={pending === "upload"}
          loadingLabel="Uploading"
          onClick={() => uploadRef.current?.click()}
          type="button"
        >
          Choose file
        </AuthButton>
      </section>
      <section className={styles.section}>
        <header className={styles.sectionHeader}>
          <span>Document history</span>
          <strong>{ordered.length} saved</strong>
        </header>
        <div className={styles.list}>
          {ordered.length ? (
            ordered.map((document, index) => (
              <div className={styles.row} key={document.id}>
                <span className={styles.rowIcon} aria-hidden="true">
                  <HugeIcon icon={File01Icon} size={16} />
                </span>
                <div className={styles.rowCopy}>
                  <strong>{document.file_name}</strong>
                  <span>
                    {index === 0 ? "Primary CV · " : "Uploaded "}
                    {formatDate(document.created_at)}
                  </span>
                </div>
                <button
                  aria-label={`Delete ${document.file_name}`}
                  className={styles.delete}
                  disabled={pending === document.id}
                  onClick={() => void remove(document.id)}
                  type="button"
                >
                  <HugeIcon icon={Delete02Icon} size={13} />{" "}
                  {pending === document.id ? "Deleting…" : "Delete"}
                </button>
              </div>
            ))
          ) : (
            <p className={styles.empty}>No documents uploaded yet.</p>
          )}
        </div>
      </section>
      {feedback ? (
        <p aria-live="polite" className={styles.feedback}>
          {feedback}
        </p>
      ) : null}
    </div>
  );
}
const ACCEPT =
  ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";
function validFile(file: File) {
  return (
    file.size > 0 &&
    file.size <= 10 * 1024 * 1024 &&
    new Set([
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]).has(file.type)
  );
}
function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-RW", { dateStyle: "medium" }).format(
    new Date(value),
  );
}
