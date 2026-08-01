import Image from "next/image";
import Link from "next/link";
import {
  Building03Icon,
  Delete02Icon,
  Edit02Icon,
  Location01Icon,
  Money03Icon,
  UserGroupIcon,
  ViewIcon,
} from "@hugeicons/core-free-icons";
import { HugeIcon } from "@/components/shared/HugeIcon";
import styles from "./OpportunityListingCard.module.css";

export type OpportunityListingType = "internship" | "job";

export interface OpportunityListingCardRecord {
  application_count: number;
  application_deadline?: string | null;
  apply_start: string | null;
  created_at: string | null;
  description: string | null;
  id: string;
  industry_sector: string | null;
  is_open: boolean;
  location: string | null;
  owner_id: string | null;
  owner_image: string | null;
  owner_name: string | null;
  owner_type: string | null;
  salary: string | null;
  title: string | null;
  view_count?: number | null;
  work_flexibility: string | null;
}

interface OpportunityListingCardProps {
  opportunity: OpportunityListingCardRecord;
  type: OpportunityListingType;
}

export function OpportunityListingCard({
  opportunity,
  type,
}: OpportunityListingCardProps) {
  const ownerName = opportunity.owner_name ?? "Unknown owner";
  const ownerInitials = buildInitials(ownerName);
  const route = buildOpportunityRoute(type, opportunity.id);
  const opportunityLabel = type === "job" ? "job listing" : "internship";

  return (
    <article
      className={styles.card}
      data-open={opportunity.is_open ? "true" : "false"}
    >
      <header className={styles.ownerHeader}>
        <div className={styles.ownerImageShell}>
          {opportunity.owner_image ? (
            <Image
              alt={`${ownerName} logo`}
              className={styles.ownerImage}
              height={48}
              src={opportunity.owner_image}
              unoptimized
              width={48}
            />
          ) : (
            <span className={styles.ownerInitials}>{ownerInitials}</span>
          )}
        </div>

        <div className={styles.ownerCopy}>
          <strong>{ownerName}</strong>
          <span>{formatOwnerType(opportunity.owner_type)}</span>
        </div>

        <span className={styles.statusBadge}>
          <span className={styles.statusDot} aria-hidden="true" />
          {opportunity.is_open ? "Open" : "Closed"}
        </span>
      </header>

      <Link className={styles.body} href={route}>
        <div className={styles.titleBlock}>
          <span className={styles.eyebrow}>
            {opportunity.industry_sector ?? "Sector not set"}
          </span>
          <h3>{opportunity.title ?? `Untitled ${opportunityLabel}`}</h3>
        </div>

        <div
          className={styles.badgeList}
          aria-label={`${opportunityLabel} details`}
        >
          <span className={styles.infoBadge}>
            <HugeIcon icon={Building03Icon} size={14} />
            {formatLabel(opportunity.work_flexibility, "Work mode not set")}
          </span>

          <span className={styles.infoBadge}>
            <HugeIcon icon={Location01Icon} size={14} />
            {opportunity.location ?? "Location not set"}
          </span>

          <span className={styles.infoBadge}>
            <HugeIcon icon={Money03Icon} size={14} />
            {opportunity.salary ?? "Salary not set"}
          </span>
        </div>
      </Link>

      <footer className={styles.footer}>
        <div className={styles.actions}>
          <Link className={styles.statButton} href={route}>
            <HugeIcon icon={ViewIcon} size={14} />
            <span>View details</span>
          </Link>

          <span className={styles.actionDivider} aria-hidden="true" />

          <Link
            aria-label={`View applications: ${formatCount(opportunity.application_count)} applicants`}
            className={styles.statButton}
            href={`${route}/applications`}
          >
            <HugeIcon icon={UserGroupIcon} size={14} />
            <span>
              {formatCount(opportunity.application_count)} Applications
            </span>
          </Link>

          <span className={styles.actionDivider} aria-hidden="true" />

          <Link
            aria-label={`Edit ${opportunityLabel}`}
            className={`${styles.iconButton} ${styles.editButton}`}
            href={`${route}/edit`}
          >
            <HugeIcon icon={Edit02Icon} size={14} />
            <span>Edit</span>
          </Link>

          <span className={styles.actionDivider} aria-hidden="true" />

          <Link
            aria-label={`Delete ${opportunityLabel}`}
            className={`${styles.iconButton} ${styles.deleteButton}`}
            href={`${route}/delete`}
          >
            <HugeIcon icon={Delete02Icon} size={14} />
            <span>Delete</span>
          </Link>
        </div>
      </footer>
    </article>
  );
}

function buildOpportunityRoute(
  type: OpportunityListingType,
  opportunityId: string,
): string {
  const routeSegment = type === "job" ? "job-listing" : "internship";
  return `/opportunities/${routeSegment === "job-listing" ? "job-listings" : "internships"}/${opportunityId}`;
}

/* ---------------------------------------------------------------------- */
/* Helpers                                                                 */
/* ---------------------------------------------------------------------- */

function buildInitials(value: string): string {
  const initials = value
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return initials || "TM";
}

function formatCount(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return "0";
  }
  return value.toLocaleString();
}

function formatLabel(
  value: string | null | undefined,
  fallback: string,
): string {
  if (!value) {
    return fallback;
  }

  return value
    .toLowerCase()
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

function formatOwnerType(value: string | null): string {
  return formatLabel(value, "Owner type not set");
}
