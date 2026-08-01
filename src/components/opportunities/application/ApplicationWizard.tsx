"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { CheckmarkCircle02Icon, SentIcon } from "@hugeicons/core-free-icons";
import { HugeIcon } from "@/components/shared/HugeIcon";
import { toApiType } from "@/endpoints/student/opportunity-query";
import type { OpportunityRecord, OpportunityRouteType } from "@/types/opportunities";
import type { StudentDocument } from "@/types/student-self-service";
import styles from "./ApplicationWizard.module.css";

interface ApplicationWizardProps {
  autoOpen: boolean;
  latestDocument: StudentDocument | null;
  opportunity: OpportunityRecord;
  type: OpportunityRouteType;
}

export function ApplicationWizard({ autoOpen, latestDocument, opportunity, type }: ApplicationWizardProps) {
  const router = useRouter();
  const [open, setOpen] = useState(autoOpen);
  const [step, setStep] = useState(1);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [experience, setExperience] = useState("");
  const [document, setDocument] = useState<File | null>(null);
  const [coverDocument, setCoverDocument] = useState<File | null>(null);
  const [useSavedDocument, setUseSavedDocument] = useState(Boolean(latestDocument));

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setError(null);
    const invalidFile = [document, coverDocument].find(
      (file) => file && (!isSupportedFile(file) || file.size > 10 * 1024 * 1024),
    );
    if (invalidFile) {
      setError("Choose PDF, DOC, or DOCX files no larger than 10 MB each.");
      setPending(false);
      return;
    }
    const body = new FormData();
    if (coverLetter.trim()) body.set("cover_letter", coverLetter.trim());
    if (type === "job-listings" && experience.trim()) body.set("experience_summary", experience.trim());
    if (document) body.set("document", document);
    else if (useSavedDocument && latestDocument) body.set("document_id", latestDocument.id);
    if (type === "job-listings" && coverDocument) body.set("cover_letter_document", coverDocument);
    try {
      const response = await fetch(`/api/student/applications/${toApiType(type)}/${opportunity.id}`, { method: "POST", body });
      const payload = (await response.json()) as { message?: string; data?: { id?: string } };
      if (!response.ok) {
        setError(payload.message ?? "Your application could not be submitted.");
        setPending(false);
        return;
      }
      setStep(4);
      router.refresh();
    } catch {
      setError("Check your connection and try submitting again.");
      setPending(false);
    }
  }

  function close() {
    if (pending) return;
    if (
      step < 4 &&
      (coverLetter || experience || document || coverDocument) &&
      !window.confirm("Discard this unfinished application?")
    ) {
      return;
    }
    setOpen(false);
    router.replace(`/opportunities/${type}/${opportunity.id}`, { scroll: false });
  }

  return (
    <aside className={styles.readiness}>
      <span>Application readiness</span>
      <h3>{opportunity.is_open ? "Ready to take the next step?" : "Applications are closed"}</h3>
      <p>{opportunity.is_open ? "Review the role, prepare your documents, and submit with confidence." : "You can still review the complete opportunity details."}</p>
      <button disabled={!opportunity.is_open} onClick={() => setOpen(true)} type="button">
        <HugeIcon icon={SentIcon} size={17} /> Apply for this opportunity
      </button>

      {open ? (
        <div className={styles.backdrop} role="presentation">
          <section aria-labelledby="application-title" aria-modal="true" className={styles.dialog} role="dialog">
            <header>
              <div><span>Step {Math.min(step, 3)} of 3</span><h2 id="application-title">{step === 4 ? "Application submitted" : opportunity.title}</h2></div>
              <button aria-label="Close application" onClick={close} type="button">×</button>
            </header>
            <div className={styles.progress}><span style={{ width: `${step === 4 ? 100 : (step / 3) * 100}%` }} /></div>

            {step === 1 ? (
              <div className={styles.step}>
                <span>Opportunity review</span><h3>Confirm the fit</h3>
                <dl><div><dt>Owner</dt><dd>{opportunity.posted_by.name}</dd></div><div><dt>Work mode</dt><dd>{opportunity.work_flexibility ?? "Not specified"}</dd></div><div><dt>Location</dt><dd>{opportunity.location ?? "Not specified"}</dd></div><div><dt>Deadline</dt><dd>{opportunity.deadline ? new Date(opportunity.deadline).toLocaleDateString("en-RW") : "Not specified"}</dd></div></dl>
              </div>
            ) : null}
            {step === 2 ? (
              <div className={styles.step}>
                <span>Your story</span><h3>Make your interest clear</h3>
                <label><span>Cover letter <small>Optional · 5,000 characters</small></span><textarea maxLength={5000} onChange={(event) => setCoverLetter(event.target.value)} placeholder="Explain why this opportunity fits your goals…" value={coverLetter} /></label>
                {type === "job-listings" ? <label><span>Experience summary <small>Optional · 3,000 characters</small></span><textarea maxLength={3000} onChange={(event) => setExperience(event.target.value)} placeholder="Highlight relevant skills and experience…" value={experience} /></label> : null}
              </div>
            ) : null}
            {step === 3 ? (
              <form className={styles.step} onSubmit={submit}>
                <span>Documents and confirmation</span><h3>Review your submission</h3>
                {latestDocument ? <div className={styles.review}><strong>Primary CV</strong><p>{latestDocument.file_name} · uploaded {new Date(latestDocument.created_at).toLocaleDateString("en-RW")}</p><button onClick={() => { setUseSavedDocument(true); setDocument(null); }} type="button">{useSavedDocument && !document ? "Selected" : "Use this CV"}</button></div> : null}
                <label className={styles.file}><span>{latestDocument ? "Or choose another file" : "Résumé or supporting document"} <small>PDF, DOC, or DOCX · maximum 10 MB</small></span><input accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={(event) => { const file = event.target.files?.[0] ?? null; setDocument(file); if (file) setUseSavedDocument(false); }} type="file" /></label>
                {type === "job-listings" ? <label className={styles.file}><span>Cover letter document <small>Optional · maximum 10 MB</small></span><input accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={(event) => setCoverDocument(event.target.files?.[0] ?? null)} type="file" /></label> : null}
                <div className={styles.review}><strong>Ready to submit</strong><p>Your application will be sent to {opportunity.posted_by.name}. You cannot submit the same opportunity twice.</p></div>
                {error ? <p className={styles.error} role="alert">{error}</p> : null}
                <button className={styles.submit} disabled={pending} type="submit"><HugeIcon icon={SentIcon} size={17} />{pending ? "Submitting securely…" : "Submit application"}</button>
              </form>
            ) : null}
            {step === 4 ? (
              <div className={styles.success}><HugeIcon icon={CheckmarkCircle02Icon} size={46} /><h3>Your application is on its way.</h3><p>Your submission is secure and ready for review.</p><button onClick={() => router.push(`/opportunities/${type}`)} type="button">Return to opportunities</button></div>
            ) : null}
            {step < 3 ? <footer><button disabled={step === 1} onClick={() => setStep((value) => Math.max(1, value - 1))} type="button">Back</button><button onClick={() => setStep((value) => Math.min(3, value + 1))} type="button">Continue</button></footer> : null}
          </section>
        </div>
      ) : null}
    </aside>
  );
}

function isSupportedFile(file: File) {
  return new Set([
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ]).has(file.type);
}
