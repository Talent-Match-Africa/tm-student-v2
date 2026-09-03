"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
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
  APPLICATION_WIZARD_STEPS,
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
  const [open, setOpen] = useState(autoOpen);
  const [step, setStep] = useState(1);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [experience, setExperience] = useState("");
  const [selectedDocument, setSelectedDocument] = useState<File | null>(null);
  const [coverDocument, setCoverDocument] = useState<File | null>(null);
  // Uploading a CV for this specific application is the default. The saved
  // profile CV stays available but must be chosen deliberately.
  const [useSavedDocument, setUseSavedDocument] = useState(false);

  const complete = step === 4;
  const attachedCv = selectedDocument
    ? selectedDocument
    : useSavedDocument && latestDocument
      ? latestDocument
      : null;
  const hasCv = Boolean(attachedCv);
  const displayStep = Math.min(step, 3);

  const requestClose = useCallback(() => {
    if (pending) return;
    if (
      !complete &&
      (coverLetter || experience || selectedDocument || coverDocument) &&
      !window.confirm("Discard this unfinished application?")
    ) {
      return;
    }
    setOpen(false);
    router.replace(`/opportunities/${type}/${opportunity.id}`, {
      scroll: false,
    });
  }, [
    complete,
    coverDocument,
    coverLetter,
    selectedDocument,
    experience,
    opportunity.id,
    pending,
    router,
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
    const submitter = (event.nativeEvent as SubmitEvent).submitter;
    const isExplicitSubmission =
      submitter instanceof HTMLButtonElement &&
      submitter.dataset.applicationSubmit === "true";
    if (pending || step !== 3 || !isExplicitSubmission) return;
    setError(null);
    if (!hasCv) {
      setError(
        latestDocument
          ? "Attach your CV to submit. Upload a file or choose your profile CV."
          : "Attach your CV to submit this application.",
      );
      return;
    }
    const invalidFile = [selectedDocument, coverDocument].find(
      (file) => file && !applicationFileIsValid(file),
    );
    if (invalidFile) {
      setError("Choose PDF, DOC, or DOCX files no larger than 10 MB each.");
      return;
    }
    setPending(true);
    const body = new FormData();
    if (coverLetter.trim()) body.set("cover_letter", coverLetter.trim());
    if (type === "job-listings" && experience.trim()) {
      body.set("experience_summary", experience.trim());
    }
    if (selectedDocument) body.set("document", selectedDocument);
    else if (useSavedDocument && latestDocument) {
      body.set("document_id", latestDocument.id);
    }
    if (type === "job-listings" && coverDocument) {
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
      setStep(4);
      router.refresh();
    } catch {
      setError("Check your connection and try submitting again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <aside className={styles.readiness}>
      <div className={styles.readinessIcon} aria-hidden="true">
        <HugeIcon icon={SentIcon} size={18} />
      </div>
      <div className={styles.readinessCopy}>
        <span>Application readiness</span>
        <h3>
          {opportunity.is_open
            ? "Your next move starts here"
            : "Applications are closed"}
        </h3>
        <p>
          {opportunity.is_open
            ? "Build a focused application in three guided steps."
            : "You can still review the complete opportunity details."}
        </p>
      </div>
      <AuthButton
        className={styles.launchButton}
        disabled={!opportunity.is_open}
        icon={SentIcon}
        onClick={() => setOpen(true)}
      >
        Start application
      </AuthButton>

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
                  <HugeIcon icon={Briefcase01Icon} size={19} />
                </span>
                <div>
                  <span>{complete ? "Submission complete" : "Apply securely"}</span>
                  <h2 id="application-title">
                    {complete
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

            {!complete ? (
              <div className={styles.wizardLayout}>
                <aside className={styles.stepRail} aria-label="Application steps">
                  <div className={styles.progressCopy}>
                    <span>Step {displayStep} of 3</span>
                    <strong>{Math.round((displayStep / 3) * 100)}% complete</strong>
                  </div>
                  <div
                    aria-valuemax={3}
                    aria-valuemin={1}
                    aria-valuenow={displayStep}
                    className={styles.progress}
                    role="progressbar"
                  >
                    <span style={{ transform: `scaleX(${displayStep / 3})` }} />
                  </div>
                  <ol>
                    {APPLICATION_WIZARD_STEPS.map((item, index) => {
                      const number = index + 1;
                      return (
                        <li
                          data-active={number === displayStep}
                          data-complete={number < displayStep}
                          key={item.label}
                        >
                          <span aria-hidden="true">
                            {number < displayStep ? (
                              <HugeIcon icon={CheckmarkCircle02Icon} size={16} />
                            ) : (
                              number
                            )}
                          </span>
                          <div>
                            <strong>{item.label}</strong>
                            <small>{item.description}</small>
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                  <p>
                    Your application is sent through the secure student portal.
                  </p>
                </aside>

                <form className={styles.form} onSubmit={submit}>
                  <div className={styles.stepContent}>
                    {step === 1 ? (
                      <>
                        <div className={styles.stepHeading}>
                          <span>Opportunity review</span>
                          <h3>Confirm this opportunity fits your goals</h3>
                          <p>Review the essentials before preparing your response.</p>
                        </div>
                        <dl className={styles.factGrid}>
                          <div><dt>Opportunity owner</dt><dd>{opportunity.posted_by.name}</dd></div>
                          <div><dt>Work mode</dt><dd>{opportunity.work_flexibility ?? "Not specified"}</dd></div>
                          <div><dt>Location</dt><dd>{opportunity.location ?? "Not specified"}</dd></div>
                          <div><dt>Application deadline</dt><dd>{formatApplicationDate(opportunity.deadline)}</dd></div>
                        </dl>
                        <div className={styles.guidanceNote}>
                          <HugeIcon icon={CheckmarkCircle02Icon} size={18} />
                          <p><strong>Before you continue</strong><span>Make sure your profile and primary CV reflect your most recent experience.</span></p>
                        </div>
                      </>
                    ) : null}

                    {step === 2 ? (
                      <>
                        <div className={styles.stepHeading}>
                          <span>Your story</span>
                          <h3>Show why this opportunity matters to you</h3>
                          <p>Keep your response specific, relevant, and easy to review.</p>
                        </div>
                        <div className={styles.fieldBlock}>
                          <TextareaField
                            icon={SentIcon}
                            label="Cover letter"
                            maxLength={5000}
                            onChange={(event) => setCoverLetter(event.target.value)}
                            placeholder="Connect your goals and strengths to this opportunity…"
                            requirement="optional"
                            rows={6}
                            value={coverLetter}
                          />
                          <span className={styles.characterCount}>{coverLetter.length.toLocaleString()} / 5,000</span>
                        </div>
                        {type === "job-listings" ? (
                          <div className={styles.fieldBlock}>
                            <TextareaField
                              icon={Briefcase01Icon}
                              label="Experience summary"
                              maxLength={3000}
                              onChange={(event) => setExperience(event.target.value)}
                              placeholder="Highlight the skills and experience most relevant to this role…"
                              requirement="optional"
                              rows={5}
                              value={experience}
                            />
                            <span className={styles.characterCount}>{experience.length.toLocaleString()} / 3,000</span>
                          </div>
                        ) : null}
                      </>
                    ) : null}

                    {step === 3 ? (
                      <>
                        <div className={styles.stepHeading}>
                          <span>Documents and confirmation</span>
                          <h3>Attach your CV</h3>
                          <p>
                            A CV is required. Upload the version tailored to this
                            role{latestDocument ? ", or reuse your profile CV." : "."}
                          </p>
                        </div>
                        <label
                          className={styles.fileDrop}
                          data-required={!hasCv}
                          data-selected={Boolean(selectedDocument)}
                        >
                          <span aria-hidden="true"><HugeIcon icon={File01Icon} size={19} /></span>
                          <div>
                            <strong>{selectedDocument ? selectedDocument.name : "Upload your CV"}</strong>
                            <small>{selectedDocument ? formatApplicationFileSize(selectedDocument.size) : "Required · PDF, DOC, or DOCX · maximum 10 MB"}</small>
                          </div>
                          <b>{selectedDocument ? "Replace" : "Choose file"}</b>
                          <input
                            accept={APPLICATION_FILE_ACCEPT}
                            onChange={(event) => {
                              const file = event.target.files?.[0] ?? null;
                              setSelectedDocument(file);
                              if (file) setUseSavedDocument(false);
                            }}
                            required={!useSavedDocument}
                            type="file"
                          />
                        </label>
                        {latestDocument ? (
                          <button
                            aria-pressed={useSavedDocument && !selectedDocument}
                            className={styles.savedDocument}
                            data-selected={useSavedDocument && !selectedDocument}
                            onClick={() => {
                              setUseSavedDocument((selected) => !selected);
                              setSelectedDocument(null);
                            }}
                            type="button"
                          >
                            <span aria-hidden="true"><HugeIcon icon={File01Icon} size={18} /></span>
                            <div><strong>{latestDocument.file_name}</strong><small>Profile CV · uploaded {formatApplicationDate(latestDocument.created_at)}</small></div>
                            <b>{useSavedDocument && !selectedDocument ? "Selected" : "Use instead"}</b>
                          </button>
                        ) : null}
                        {type === "job-listings" ? (
                          <label className={styles.fileDrop} data-selected={Boolean(coverDocument)}>
                            <span aria-hidden="true"><HugeIcon icon={SentIcon} size={19} /></span>
                            <div><strong>{coverDocument ? coverDocument.name : "Cover letter document"}</strong><small>{coverDocument ? formatApplicationFileSize(coverDocument.size) : "Optional · PDF, DOC, or DOCX · maximum 10 MB"}</small></div>
                            <b>{coverDocument ? "Replace" : "Choose file"}</b>
                            <input accept={APPLICATION_FILE_ACCEPT} onChange={(event) => setCoverDocument(event.target.files?.[0] ?? null)} type="file" />
                          </label>
                        ) : null}
                        <div className={styles.confirmation}>
                          <HugeIcon icon={CheckmarkCircle02Icon} size={18} />
                          <p><strong>Ready for secure submission</strong><span>Your application will be sent to {opportunity.posted_by.name}. Duplicate applications are prevented.</span></p>
                        </div>
                        {error ? <p className={styles.error} role="alert">{error}</p> : null}
                      </>
                    ) : null}
                  </div>

                  <footer className={styles.footer}>
                    <span>Step {displayStep} of 3</span>
                    <div>
                      <AuthButton
                        className={styles.footerButton}
                        disabled={step === 1 || pending}
                        icon={ArrowLeft01Icon}
                        onClick={() => setStep((value) => Math.max(1, value - 1))}
                        variant="secondary"
                      >
                        Back
                      </AuthButton>
                      {step < 3 ? (
                        <AuthButton
                          className={styles.footerButton}
                          icon={ArrowRight01Icon}
                          key="application-continue"
                          onClick={() => setStep((value) => Math.min(3, value + 1))}
                          type="button"
                        >
                          Continue
                        </AuthButton>
                      ) : (
                        <AuthButton
                          className={styles.footerButton}
                          data-application-submit="true"
                          disabled={!hasCv}
                          icon={SentIcon}
                          isLoading={pending}
                          key="application-submit"
                          loadingLabel="Submitting securely"
                          type="submit"
                        >
                          Submit application
                        </AuthButton>
                      )}
                    </div>
                  </footer>
                </form>
              </div>
            ) : (
              <div className={styles.success}>
                <span className={styles.successIcon} aria-hidden="true"><HugeIcon icon={CheckmarkCircle02Icon} size={38} /></span>
                <span>Application sent</span>
                <h3>Your application is on its way.</h3>
                <p>Your submission is secure and ready for review by {opportunity.posted_by.name}.</p>
                <div className={styles.successActions}>
                  <AuthButton icon={File01Icon} onClick={() => router.push(`/applications/${type}`)} variant="secondary">View my applications</AuthButton>
                  <AuthButton icon={ArrowRight01Icon} onClick={() => router.push(`/opportunities/${type}`)}>Explore more opportunities</AuthButton>
                </div>
              </div>
            )}
          </section>
        </div>
      ) : null}
    </aside>
  );
}
