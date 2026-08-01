import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft01Icon,
  Building03Icon,
  Calendar03Icon,
  File01Icon,
  Location01Icon,
  Money03Icon,
} from "@hugeicons/core-free-icons";
import { HugeIcon } from "@/components/shared/HugeIcon";
import type {
  OpportunityRecord,
  OpportunityRouteType,
} from "@/types/opportunities";
import type { StudentDocument } from "@/types/student-self-service";
import { ApplicationWizard } from "../application/ApplicationWizard";
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
  return (
    <section className={styles.workspace}>
      <Link className={styles.back} href={`/opportunities/${type}`}>
        <HugeIcon icon={ArrowLeft01Icon} size={17} />
        Back to {type === "job-listings" ? "job listings" : "internships"}
      </Link>

      <header className={styles.hero}>
        <div className={styles.owner}>
          <span className={styles.logo}>
            {opportunity.posted_by.image_url ? (
              <Image
                alt=""
                height={58}
                src={opportunity.posted_by.image_url}
                unoptimized
                width={58}
              />
            ) : (
              opportunity.posted_by.name.slice(0, 2).toUpperCase()
            )}
          </span>
          <div>
            <span>{opportunity.posted_by.name}</span>
            <small>{opportunity.posted_by.role ?? "Opportunity owner"}</small>
          </div>
        </div>
        <div className={styles.title}>
          <p>{opportunity.industry_sector ?? "Career opportunity"}</p>
          <h2>{opportunity.title ?? "Untitled opportunity"}</h2>
          <span className={styles.status} data-status={opportunity.status}>
            {opportunity.status}
          </span>
        </div>
        <div className={styles.facts}>
          <span>
            <HugeIcon icon={Building03Icon} size={16} />
            {opportunity.work_flexibility ?? "Work mode not set"}
          </span>
          <span>
            <HugeIcon icon={Location01Icon} size={16} />
            {opportunity.location ?? "Location not set"}
          </span>
          <span>
            <HugeIcon icon={Money03Icon} size={16} />
            {opportunity.salary ?? "Salary not set"}
          </span>
          <span>
            <HugeIcon icon={Calendar03Icon} size={16} />
            Apply by {formatDate(opportunity.deadline)}
          </span>
        </div>
      </header>

      <div className={styles.layout}>
        <main className={styles.content}>
          <article>
            <span>Opportunity brief</span>
            <h3>About this opportunity</h3>
            <p>
              {opportunity.description ??
                "The opportunity owner has not provided a description."}
            </p>
          </article>
          {opportunity.responsibilities.length ? (
            <article>
              <span>Your contribution</span>
              <h3>Responsibilities</h3>
              <ul>
                {opportunity.responsibilities.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ) : null}
          {opportunity.qualifications.length ||
          opportunity.requirements ||
          opportunity.experience ? (
            <article>
              <span>Readiness</span>
              <h3>Qualifications and requirements</h3>
              {opportunity.requirements ? (
                <p>{opportunity.requirements}</p>
              ) : null}
              {opportunity.experience ? (
                <p>{opportunity.experience}</p>
              ) : null}
              <ul>
                {opportunity.qualifications.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ) : null}
          {opportunity.document_url ? (
            <a
              className={styles.document}
              href={opportunity.document_url}
              rel="noreferrer"
              target="_blank"
            >
              <HugeIcon icon={File01Icon} size={19} />
              Open opportunity document
            </a>
          ) : null}
        </main>

        <ApplicationWizard
          autoOpen={autoOpenApplication}
          latestDocument={latestDocument}
          opportunity={opportunity}
          type={type}
        />
      </div>
    </section>
  );
}

function formatDate(value: string | null) {
  if (!value) return "not specified";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "not specified"
    : new Intl.DateTimeFormat("en-RW", { dateStyle: "long" }).format(date);
}
