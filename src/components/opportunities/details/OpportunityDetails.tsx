import {
  Calendar03Icon,
  File01Icon,
  Location01Icon,
  Money03Icon,
  UserGroupIcon,
  WorkIcon,
} from "@hugeicons/core-free-icons";
import { HugeIcon } from "@/components/shared/HugeIcon";
import type {
  OpportunityRecord,
  OpportunityRouteType,
} from "@/types/opportunities";
import type { StudentDocument } from "@/types/student-self-service";
import { ApplicationWizard } from "../application/ApplicationWizard";
import { OpportunityDetailsHeader } from "./OpportunityDetailsHeader";
import {
  formatOpportunityDate,
  formatOpportunityLabel,
  opportunityLocation,
} from "./opportunity-details-utils";
import styles from "./OpportunityDetails.module.css";

interface OpportunityDetailsProps {
  autoOpenApplication: boolean;
  opportunity: OpportunityRecord;
  latestDocument: StudentDocument | null;
  type: OpportunityRouteType;
}

export function OpportunityDetails({
  autoOpenApplication,
  latestDocument,
  opportunity,
  type,
}: OpportunityDetailsProps) {
  const location = opportunityLocation(opportunity);

  return (
    <div className={styles.page}>
      <OpportunityDetailsHeader opportunity={opportunity} type={type} />

      <section className={styles.facts} aria-label="Opportunity summary">
        <article>
          <HugeIcon icon={WorkIcon} size={18} />
          <span>Work mode</span>
          <strong>
            {formatOpportunityLabel(opportunity.work_flexibility, "Not set")}
          </strong>
        </article>
        <article>
          <HugeIcon icon={Location01Icon} size={18} />
          <span>Location</span>
          <strong>{location || "Not set"}</strong>
        </article>
        <article>
          <HugeIcon icon={Money03Icon} size={18} />
          <span>{type === "internships" ? "Stipend" : "Salary"}</span>
          <strong>{opportunity.salary ?? "Not set"}</strong>
        </article>
        <article>
          <HugeIcon icon={Calendar03Icon} size={18} />
          <span>Applications</span>
          <strong>
            {formatOpportunityDate(opportunity.apply_start)} to{" "}
            {formatOpportunityDate(opportunity.deadline)}
          </strong>
        </article>
      </section>

      <div className={styles.contentGrid}>
        <main className={styles.mainContent}>
          <section className={styles.section}>
            <p className={styles.eyebrow}>Opportunity brief</p>
            <h2>Description</h2>
            <p className={styles.prose}>
              {opportunity.description ?? "No description has been provided."}
            </p>
          </section>

          <section className={styles.section}>
            <p className={styles.eyebrow}>Candidate profile</p>
            <h2>{type === "internships" ? "Requirements" : "Experience"}</h2>
            <p className={styles.prose}>
              {type === "internships"
                ? (opportunity.requirements ??
                  "No requirements have been provided.")
                : (opportunity.experience ??
                  "No experience requirement has been provided.")}
            </p>
          </section>

          <section className={styles.listSection}>
            <div>
              <p className={styles.eyebrow}>Role scope</p>
              <h2>Responsibilities</h2>
              {opportunity.responsibilities.length ? (
                <ul>
                  {opportunity.responsibilities.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p>No responsibilities listed.</p>
              )}
            </div>
            <div>
              <p className={styles.eyebrow}>Selection criteria</p>
              <h2>Qualifications</h2>
              {opportunity.qualifications.length ? (
                <ul>
                  {opportunity.qualifications.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p>No qualifications listed.</p>
              )}
            </div>
          </section>
        </main>

        <aside className={styles.sidebar}>
          <ApplicationWizard
            autoOpen={autoOpenApplication}
            key={
              autoOpenApplication ? "application-open" : "application-closed"
            }
            latestDocument={latestDocument}
            opportunity={opportunity}
            type={type}
          />

          <section className={styles.sideSection}>
            <p className={styles.eyebrow}>Opportunity details</p>
            <dl>
              <div>
                <dt>Industry</dt>
                <dd>{opportunity.industry_sector ?? "Not set"}</dd>
              </div>
              <div>
                <dt>Published by</dt>
                <dd>{opportunity.posted_by.name}</dd>
              </div>
              {type === "internships" ? (
                <div>
                  <dt>Facilitation</dt>
                  <dd>
                    {opportunity.facilitation ? "Provided" : "Not provided"}
                  </dd>
                </div>
              ) : null}
              <div>
                <dt>Published</dt>
                <dd>{formatOpportunityDate(opportunity.created_at)}</dd>
              </div>
            </dl>
          </section>

          <section className={styles.sideSection}>
            <p className={styles.eyebrow}>Student eligibility</p>
            <div className={styles.audiences}>
              <span>
                <HugeIcon icon={UserGroupIcon} size={14} />
                Available to eligible students
              </span>
            </div>
          </section>

          <section className={styles.sideSection}>
            <p className={styles.eyebrow}>Document</p>
            {opportunity.document_url ? (
              <a
                className={styles.documentLink}
                href={opportunity.document_url}
                rel="noreferrer"
                target="_blank"
              >
                <HugeIcon icon={File01Icon} size={17} />
                View attached document
              </a>
            ) : (
              <p className={styles.sideEmpty}>No document attached.</p>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}
