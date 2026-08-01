"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import type { StudentDocument } from "@/types/student-self-service";
import styles from "@/components/shared/SelfService.module.css";

export function StudentDocumentsPanel({
  documents,
}: {
  documents: StudentDocument[];
}) {
  const router = useRouter();
  const [feedback, setFeedback] = useState("");

  async function upload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const response = await fetch("/api/student/documents", {
      method: "POST",
      body: new FormData(form),
    });
    const payload = (await response.json()) as { message?: string };
    setFeedback(
      response.ok
        ? "Document uploaded."
        : (payload.message ?? "Upload failed."),
    );
    if (response.ok) {
      form.reset();
      router.refresh();
    }
  }

  async function remove(documentId: string) {
    if (!window.confirm("Delete this document?")) return;
    const response = await fetch(`/api/student/documents/${documentId}`, {
      method: "DELETE",
    });
    setFeedback(
      response.ok ? "Document deleted." : "Document could not be deleted.",
    );
    if (response.ok) router.refresh();
  }

  return (
    <div className={styles.form}>
      <div className={styles.list}>
        {documents.map((document) => (
          <div key={document.id}>
            <strong>{document.file_name}</strong>
            <span>
              {new Date(document.created_at).toLocaleDateString("en-RW")}
            </span>
            <button
              className={styles.danger}
              onClick={() => remove(document.id)}
              type="button"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
      <form className={styles.form} onSubmit={upload}>
        <label className={styles.field}>
          <span>PDF, DOC, or DOCX · maximum 10 MB</span>
          <input
            accept=".pdf,.doc,.docx"
            name="document"
            required
            type="file"
          />
        </label>
        <button className={styles.secondary} type="submit">
          Upload document
        </button>
      </form>
      {feedback ? <p aria-live="polite">{feedback}</p> : null}
    </div>
  );
}
