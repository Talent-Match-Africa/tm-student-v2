import Link from "next/link";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Briefcase01Icon,
  Calendar03Icon,
  CheckmarkCircle02Icon,
  File01Icon,
  SentIcon,
} from "@hugeicons/core-free-icons";
import { ApplicationDocumentButton } from "@/components/applications/ApplicationDocumentButton";
import { HugeIcon } from "@/components/shared/HugeIcon";
import type { StudentApplication } from "@/types/student-self-service";
import {
  formatApplicationDetailDate,
  formatApplicationStatus,
  formatWorkHistory,
} from "./application-details-utils";
import styles from "./StudentApplicationDetails.module.css";

interface StudentApplicationDetailsProps {
  application: StudentApplication;
  apiType: "jobs" | "internships";
  routeType: "job-listings" | "internships";
}

export function StudentApplicationDetails({
  application,
  apiType,
  routeType,
}: StudentApplicationDetailsProps) {
  const status = formatApplicationStatus(application.status);
  const workHistory = formatWorkHistory(application.work_history);
  const opportunityLabel = application.type === "JOB" ? "Job" : "Internship";
  const hasDocuments = Boolean(
    application.documents.primary || application.documents.cover_letter,
  );

  return (
    <div className={styles.workspace}>
      <header className={styles.pageHeader}>
        <div className={styles.headerCopy}>
          <span>My application</span>
          <h1>{application.opportunity.title ?? `${opportunityLabel} application`}</h1>
          <p>
            Submitted to <strong>{application.opportunity.owner.name}</strong>
          </p>
        </div>
        <div className={styles.headerActions}>
          <Link className={styles.secondaryAction} href={`/applications/${routeType}`}>
            <HugeIcon icon={ArrowLeft01Icon} size={16} />
            Back to applications
          </Link>
          <Link
            className={styles.secondaryAction}
            href={`/opportunities/${routeType}/${application.opportunity.id}`}
          >
            <HugeIcon icon={Briefcase01Icon} size={16} />
            View opportunity
          </Link>
        </div>
      </header>

      <section className={styles.statusCard} aria-labelledby="application-status-title">
        <span className={styles.statusIcon} aria-hidden="true">
          <HugeIcon icon={SentIcon} size={22} />
        </span>
        <div className={styles.statusCopy}>
          <span>Current progress</span>
          <h2 id="application-status-title">Your application is {status.toLowerCase()}</h2>
          <p>
            Track this page for updates while {application.opportunity.owner.name} reviews your submission.
          </p>
        </div>
        <span className={styles.statusBadge} data-status={application.status}>
          <span aria-hidden="true" />
          {status}
        </span>
        <dl className={styles.statusFacts}>
          <div>
            <dt><HugeIcon icon={Calendar03Icon} size={14} /> Submitted</dt>
            <dd>{formatApplicationDetailDate(application.created_at)}</dd>
          </div>
          <div>
            <dt><HugeIcon icon={Briefcase01Icon} size={14} /> Application type</dt>
            <dd>{opportunityLabel}</dd>
          </div>
          <div>
            <dt><HugeIcon icon={CheckmarkCircle02Icon} size={14} /> Reference</dt>
            <dd>{application.id.slice(0, 8).toUpperCase()}</dd>
          </div>
        </dl>
      </section>

      <div className={styles.detailsLayout}>
        <main className={styles.mainColumn}>
          <section className={styles.contentCard} aria-labelledby="submission-title">
            <header className={styles.cardHeader}>
              <span className={styles.cardIcon} aria-hidden="true">
                <HugeIcon icon={SentIcon} size={19} />
              </span>
              <div>
                <span>Submitted content</span>
                <h2 id="submission-title">Your application narrative</h2>
                <p>A complete record of the information included with this submission.</p>
              </div>
            </header>

            <div className={styles.narrativeGrid}>
              <article>
                <span>Personal statement</span>
                <h3>Cover letter</h3>
                <p>{application.cover_letter ?? "No cover letter was included with this application."}</p>
              </article>
              {application.type === "JOB" ? (
                <article>
                  <span>Professional context</span>
                  <h3>Experience summary</h3>
                  <p>{application.experience_summary ?? "No experience summary was included."}</p>
                </article>
              ) : null}
            </div>

            {workHistory.length ? (
              <section className={styles.workHistory} aria-labelledby="work-history-title">
                <header>
                  <div>
                    <span>Supporting experience</span>
                    <h3 id="work-history-title">Work history</h3>
                  </div>
                  <strong>{workHistory.length}</strong>
                </header>
                <ol>
                  {workHistory.map((entry, index) => (
                    <li key={`${entry}-${index}`}>{entry}</li>
                  ))}
                </ol>
              </section>
            ) : null}
          </section>
        </main>

        <aside className={styles.sideColumn}>
          <section className={styles.contextCard} aria-labelledby="opportunity-context-title">
            <span className={styles.contextIcon} aria-hidden="true">
              <HugeIcon icon={Briefcase01Icon} size={21} />
            </span>
            <div className={styles.contextCopy}>
              <span>{opportunityLabel} opportunity</span>
              <h2 id="opportunity-context-title">
                {application.opportunity.title ?? "Opportunity"}
              </h2>
              <p>{application.opportunity.owner.name}</p>
            </div>
            <Link
              className={styles.contextLink}
              href={`/opportunities/${routeType}/${application.opportunity.id}`}
            >
              Review listing <HugeIcon icon={ArrowRight01Icon} size={15} />
            </Link>
          </section>

          <section className={styles.documentCard} aria-labelledby="documents-title">
            <header>
              <span className={styles.documentIcon} aria-hidden="true">
                <HugeIcon icon={File01Icon} size={18} />
              </span>
              <div>
                <span>Secure attachments</span>
                <h2 id="documents-title">Submitted documents</h2>
              </div>
            </header>
            <p>Open the exact files securely attached to this application.</p>
            {hasDocuments ? (
              <div className={styles.documentActions}>
                {application.documents.primary ? (
                  <ApplicationDocumentButton
                    href={`/api/student/application-documents/${apiType}/${application.id}/document`}
                    label="Open primary CV"
                  />
                ) : null}
                {application.documents.cover_letter ? (
                  <ApplicationDocumentButton
                    href={`/api/student/application-documents/${apiType}/${application.id}/cover-letter`}
                    label="Open cover letter"
                  />
                ) : null}
              </div>
            ) : (
              <div className={styles.noDocuments}>
                <HugeIcon icon={File01Icon} size={17} />
                No documents were included.
              </div>
            )}
          </section>

          <div className={styles.guidance}>
            <HugeIcon icon={CheckmarkCircle02Icon} size={18} />
            <p><strong>Your submission is recorded</strong><span>You do not need to apply again. Any status change will appear here.</span></p>
          </div>
        </aside>
      </div>
    </div>
  );
}
