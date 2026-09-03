"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Briefcase01Icon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  File01Icon,
  SentIcon,
} from "@hugeicons/core-free-icons";
import { AuthButton } from "@/components/shared/AuthButton";
import { HugeIcon } from "@/components/shared/HugeIcon";
import { TextareaField } from "@/components/shared/TextareaField";
import { toApiType } from "@/endpoints/student/opportunity-query";
import type {
  OpportunityRecord,
  OpportunityRouteType,
} from "@/types/opportunities";
import type { StudentDocument } from "@/types/student-self-service";
import {
  APPLICATION_FILE_ACCEPT,
  applicationFileIsValid,
  formatApplicationDate,
  formatApplicationFileSize,
} from "./application-wizard-utils";
import styles from "./ApplicationWizard.module.css";

interface ApplicationWizardProps {
  autoOpen: boolean;
  latestDocument: StudentDocument | null;
  opportunity: OpportunityRecord;
  type: OpportunityRouteType;
}

export function ApplicationWizard({
  autoOpen,
  latestDocument,
  opportunity,
  type,
}: ApplicationWizardProps) {
  const router = useRouter();
  const [open, setOpen] = useState(autoOpen && !opportunity.has_applied);
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [experience, setExperience] = useState("");
  const [selectedDocument, setSelectedDocument] = useState<File | null>(null);
  const [coverDocument, setCoverDocument] = useState<File | null>(null);
  // Uploading a CV for this application is the default; the saved profile CV
  // stays available but has to be chosen deliberately.
  const [useSavedDocument, setUseSavedDocument] = useState(false);

  const isJob = type === "job-listings";
  const usingSavedCv = useSavedDocument && !selectedDocument && latestDocument;
  const hasCv = Boolean(selectedDocument || usingSavedCv);
  // The cover letter is written or uploaded, never both, so a reviewer always
  // has a single canonical version.
  const coverLetterWritten = Boolean(coverLetter.trim());
  const coverLetterUploaded = Boolean(coverDocument);
  const hasUnsavedInput = Boolean(
    coverLetter || experience || selectedDocument || coverDocument,
  );

  const requestClose = useCallback(() => {
    if (pending) return;
    if (
      !submitted &&
      hasUnsavedInput &&
      !window.confirm("Discard this unfinished application?")
    ) {
      return;
    }
    setOpen(false);
    router.replace(`/opportunities/${type}/${opportunity.id}`, {
      scroll: false,
    });
  }, [
    hasUnsavedInput,
    opportunity.id,
    pending,
    router,
    submitted,
    type,
  ]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") requestClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, requestClose]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setError(null);

    if (!hasCv) {
      setError(
        latestDocument
          ? "Attach your CV to submit. Upload a PDF or use your profile CV."
          : "Attach your CV to submit this application.",
      );
      return;
    }
    if (coverLetterWritten && coverLetterUploaded) {
      setError("Provide the cover letter as text or as a file, not both.");
      return;
    }
    const invalidFile = [selectedDocument, coverDocument].find(
      (file) => file && !applicationFileIsValid(file),
    );
    if (invalidFile) {
      setError("Choose a PDF no larger than 10 MB.");
      return;
    }

    setPending(true);
    const body = new FormData();
    if (coverLetterWritten) body.set("cover_letter", coverLetter.trim());
    if (isJob && experience.trim()) {
      body.set("experience_summary", experience.trim());
    }
    if (selectedDocument) body.set("document", selectedDocument);
    else if (usingSavedCv) body.set("document_id", latestDocument.id);
    if (isJob && coverDocument) {
      body.set("cover_letter_document", coverDocument);
    }

    try {
      const response = await fetch(
        `/api/student/applications/${toApiType(type)}/${opportunity.id}`,
        { body, method: "POST" },
      );
      const payload = (await response.json()) as { message?: string };
      if (!response.ok) {
        setError(payload.message ?? "Your application could not be submitted.");
        return;
      }
      setSubmitted(true);
      router.refresh();
    } catch {
      setError("Check your connection and try submitting again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <aside className={styles.launcher}>
      <div className={styles.readinessIcon} aria-hidden="true">
        <HugeIcon icon={SentIcon} size={18} />
      </div>
      <div className={styles.readinessCopy}>
        <span>Application readiness</span>
        <h3>
          {opportunity.has_applied
            ? "Application submitted"
            : opportunity.is_open
              ? "Your next move starts here"
              : "Applications are closed"}
        </h3>
        <p>
          {opportunity.has_applied
            ? "You have already applied. Track progress from your applications."
            : opportunity.is_open
              ? "Attach your CV and send your application in one step."
              : "You can still review the complete opportunity details."}
        </p>
      </div>
      {opportunity.has_applied ? (
        <AuthButton
          className={styles.launchButton}
          disabled
          icon={CheckmarkCircle02Icon}
        >
          Already applied
        </AuthButton>
      ) : (
        <AuthButton
          className={styles.launchButton}
          disabled={!opportunity.is_open}
          icon={SentIcon}
          onClick={() => setOpen(true)}
        >
          Start application
        </AuthButton>
      )}

      {open ? (
        <div
          className={styles.backdrop}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) requestClose();
          }}
          role="presentation"
        >
          <section
            aria-labelledby="application-title"
            aria-modal="true"
            className={styles.dialog}
            role="dialog"
          >
            <header className={styles.dialogHeader}>
              <div className={styles.dialogIdentity}>
                <span className={styles.dialogIcon} aria-hidden="true">
                  <HugeIcon icon={Briefcase01Icon} size={18} />
                </span>
                <div>
                  <span>
                    {submitted ? "Submission complete" : "Apply securely"}
                  </span>
                  <h2 id="application-title">
                    {submitted
                      ? "Application submitted"
                      : (opportunity.title ?? "Opportunity application")}
                  </h2>
                </div>
              </div>
              <button
                aria-label="Close application"
                className={styles.closeButton}
                onClick={requestClose}
                type="button"
              >
                <HugeIcon icon={Cancel01Icon} size={16} />
              </button>
            </header>

            {submitted ? (
              <div className={styles.success}>
                <span className={styles.successIcon} aria-hidden="true">
                  <HugeIcon icon={CheckmarkCircle02Icon} size={34} />
                </span>
                <h3>Your application is on its way.</h3>
                <p>
                  {opportunity.posted_by.name} will review your submission.
                </p>
                <div className={styles.successActions}>
                  <AuthButton
                    icon={File01Icon}
                    onClick={() => router.push(`/applications/${type}`)}
                    variant="secondary"
                  >
                    View my applications
                  </AuthButton>
                  <AuthButton
                    icon={SentIcon}
                    onClick={() => router.push(`/opportunities/${type}`)}
                  >
                    Explore more
                  </AuthButton>
                </div>
              </div>
            ) : (
              <form className={styles.form} onSubmit={submit}>
                <div className={styles.formBody}>
                  <section className={styles.section}>
                    <div className={styles.sectionHead}>
                      <h3>Your CV</h3>
                      <span className={styles.requiredTag}>Required</span>
                    </div>

                    <label
                      className={styles.fileDrop}
                      data-required={!hasCv || undefined}
                      data-selected={Boolean(selectedDocument)}
                    >
                      <span aria-hidden="true">
                        <HugeIcon icon={File01Icon} size={18} />
                      </span>
                      <div>
                        <strong>
                          {selectedDocument
                            ? selectedDocument.name
                            : "Upload your CV"}
                        </strong>
                        <small>
                          {selectedDocument
                            ? formatApplicationFileSize(selectedDocument.size)
                            : "PDF only · maximum 10 MB"}
                        </small>
                      </div>
                      <b>{selectedDocument ? "Replace" : "Choose file"}</b>
                      <input
                        accept={APPLICATION_FILE_ACCEPT}
                        onChange={(event) => {
                          const file = event.target.files?.[0] ?? null;
                          setSelectedDocument(file);
                          if (file) setUseSavedDocument(false);
                        }}
                        type="file"
                      />
                    </label>

                    {latestDocument ? (
                      <button
                        aria-pressed={Boolean(usingSavedCv)}
                        className={styles.savedDocument}
                        data-selected={Boolean(usingSavedCv)}
                        onClick={() => {
                          setUseSavedDocument((selected) => !selected);
                          setSelectedDocument(null);
                        }}
                        type="button"
                      >
                        <span aria-hidden="true">
                          <HugeIcon icon={File01Icon} size={16} />
                        </span>
                        <div>
                          <strong>{latestDocument.file_name}</strong>
                          <small>
                            Profile CV ·{" "}
                            {formatApplicationDate(latestDocument.created_at)}
                          </small>
                        </div>
                        <b>{usingSavedCv ? "Selected" : "Use instead"}</b>
                      </button>
                    ) : null}
                  </section>

                  <section className={styles.section}>
                    <div className={styles.sectionHead}>
                      <h3>Cover letter</h3>
                      <span className={styles.optionalTag}>Optional</span>
                    </div>
                    <p className={styles.sectionHint}>
                      Write one or attach a file — whichever you prefer, not
                      both.
                    </p>

                    <TextareaField
                      disabled={coverLetterUploaded}
                      icon={SentIcon}
                      label="Write a cover letter"
                      maxLength={5000}
                      onChange={(event) => setCoverLetter(event.target.value)}
                      placeholder={
                        coverLetterUploaded
                          ? "Remove the uploaded file to write one here."
                          : "Connect your goals and strengths to this opportunity…"
                      }
                      rows={5}
                      value={coverLetter}
                    />

                    {isJob ? (
                      <>
                        <label
                          className={styles.fileDrop}
                          data-disabled={coverLetterWritten || undefined}
                          data-selected={coverLetterUploaded}
                        >
                          <span aria-hidden="true">
                            <HugeIcon icon={SentIcon} size={18} />
                          </span>
                          <div>
                            <strong>
                              {coverDocument
                                ? coverDocument.name
                                : "Or upload a cover letter"}
                            </strong>
                            <small>
                              {coverDocument
                                ? formatApplicationFileSize(coverDocument.size)
                                : coverLetterWritten
                                  ? "Clear the written text to upload a file"
                                  : "PDF only · maximum 10 MB"}
                            </small>
                          </div>
                          <b>{coverDocument ? "Replace" : "Choose file"}</b>
                          <input
                            accept={APPLICATION_FILE_ACCEPT}
                            disabled={coverLetterWritten}
                            onChange={(event) =>
                              setCoverDocument(event.target.files?.[0] ?? null)
                            }
                            type="file"
                          />
                        </label>
                        {coverDocument ? (
                          <button
                            className={styles.clearFileButton}
                            onClick={() => setCoverDocument(null)}
                            type="button"
                          >
                            Remove file and write instead
                          </button>
                        ) : null}
                      </>
                    ) : null}
                  </section>

                  {isJob ? (
                    <section className={styles.section}>
                      <div className={styles.sectionHead}>
                        <h3>Experience</h3>
                        <span className={styles.optionalTag}>Optional</span>
                      </div>
                      <TextareaField
                        icon={Briefcase01Icon}
                        label="Experience summary"
                        maxLength={3000}
                        onChange={(event) => setExperience(event.target.value)}
                        placeholder="Highlight the skills most relevant to this role…"
                        rows={4}
                        value={experience}
                      />
                    </section>
                  ) : null}

                  {error ? (
                    <p className={styles.error} role="alert">
                      {error}
                    </p>
                  ) : null}
                </div>

                <footer className={styles.footer}>
                  <span className={styles.footerNote}>
                    Sent securely to {opportunity.posted_by.name}
                  </span>
                  <div className={styles.footerActions}>
                    <AuthButton
                      className={styles.footerButton}
                      disabled={pending}
                      icon={Cancel01Icon}
                      onClick={requestClose}
                      type="button"
                      variant="secondary"
                    >
                      Cancel
                    </AuthButton>
                    <AuthButton
                      className={styles.footerButton}
                      disabled={!hasCv}
                      icon={SentIcon}
                      isLoading={pending}
                      loadingLabel="Submitting"
                      type="submit"
                    >
                      Submit application
                    </AuthButton>
                  </div>
                </footer>
              </form>
            )}
          </section>
        </div>
      ) : null}
    </aside>
  );
}
