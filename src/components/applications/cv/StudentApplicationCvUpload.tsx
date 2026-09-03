"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Briefcase01Icon,
  CheckmarkCircle02Icon,
  File01Icon,
  SentIcon,
} from "@hugeicons/core-free-icons";
import { AuthButton } from "@/components/shared/AuthButton";
import { HugeIcon } from "@/components/shared/HugeIcon";
import {
  APPLICATION_FILE_ACCEPT,
  applicationFileIsValid,
  formatApplicationFileSize,
} from "@/components/opportunities/application/application-wizard-utils";
import type { OpportunityRouteType } from "@/types/opportunities";
import type { StudentApplication } from "@/types/student-self-service";
import styles from "./StudentApplicationCvUpload.module.css";

interface StudentApplicationCvUploadProps {
  apiType: "jobs" | "internships";
  application: StudentApplication;
  routeType: OpportunityRouteType;
}

export function StudentApplicationCvUpload({
  apiType,
  application,
  routeType,
}: StudentApplicationCvUploadProps) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const alreadyComplete = Boolean(application.documents.primary);
  const opportunityTitle = application.opportunity.title ?? "this opportunity";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending || !file) return;
    setError(null);
    if (!applicationFileIsValid(file)) {
      setError("Choose a PDF no larger than 10 MB.");
      return;
    }

    setPending(true);
    const body = new FormData();
    body.set("document", file);
    try {
      const response = await fetch(
        `/api/student/applications/${apiType}/${application.id}/document`,
        { body, method: "PATCH" },
      );
      const payload = (await response.json()) as { message?: string };
      if (!response.ok) {
        setError(payload.message ?? "Your CV could not be uploaded.");
        return;
      }
      setDone(true);
      router.refresh();
    } catch {
      setError("Check your connection and try uploading again.");
    } finally {
      setPending(false);
    }
  }

  if (done || alreadyComplete) {
    return (
      <section className={styles.panel} aria-live="polite">
        <span className={styles.successIcon} aria-hidden="true">
          <HugeIcon icon={CheckmarkCircle02Icon} size={32} />
        </span>
        <h1>Your application is complete</h1>
        <p>
          {done
            ? `Thank you. Your CV has been attached to your ${opportunityTitle} application and a confirmation is on its way to your inbox.`
            : `Your ${opportunityTitle} application already has a CV attached. There is nothing further to do.`}
        </p>
        <div className={styles.actions}>
          <AuthButton
            icon={File01Icon}
            onClick={() => router.push(`/applications/${routeType}`)}
            variant="secondary"
          >
            View my applications
          </AuthButton>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.panel}>
      <span className={styles.icon} aria-hidden="true">
        <HugeIcon icon={Briefcase01Icon} size={22} />
      </span>
      <h1>One step to complete your application</h1>
      <p className={styles.lead}>
        You applied for <strong>{opportunityTitle}</strong> at{" "}
        {application.opportunity.owner.name} before a CV was required. Attach it
        now and your application is complete.
      </p>
      <p className={styles.reassurance}>
        Only your CV is added — nothing else about your application changes.
      </p>

      <form className={styles.form} onSubmit={submit}>
        <label
          className={styles.fileDrop}
          data-required={!file || undefined}
          data-selected={Boolean(file)}
        >
          <span aria-hidden="true">
            <HugeIcon icon={File01Icon} size={18} />
          </span>
          <div>
            <strong>{file ? file.name : "Upload your CV"}</strong>
            <small>
              {file
                ? formatApplicationFileSize(file.size)
                : "PDF only · maximum 10 MB"}
            </small>
          </div>
          <b>{file ? "Replace" : "Choose file"}</b>
          <input
            accept={APPLICATION_FILE_ACCEPT}
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            type="file"
          />
        </label>

        {error ? (
          <p className={styles.error} role="alert">
            {error}
          </p>
        ) : null}

        <AuthButton
          className={styles.submit}
          disabled={!file}
          icon={SentIcon}
          isLoading={pending}
          loadingLabel="Uploading"
          type="submit"
        >
          Upload my CV
        </AuthButton>
      </form>
    </section>
  );
}
