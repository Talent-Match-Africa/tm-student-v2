import Image from "next/image";
import Link from "next/link";
import {
  Building03Icon,
  Calendar03Icon,
  Location01Icon,
  Money03Icon,
  SentIcon,
  ViewIcon,
} from "@hugeicons/core-free-icons";
import { HugeIcon } from "@/components/shared/HugeIcon";
import type {
  OpportunityRecord,
  OpportunityRouteType,
} from "@/types/opportunities";
import styles from "./StudentOpportunityCard.module.css";

interface StudentOpportunityCardProps {
  opportunity: OpportunityRecord;
  type: OpportunityRouteType;
}

export function StudentOpportunityCard({
  opportunity,
  type,
}: StudentOpportunityCardProps) {
  const route = `/opportunities/${type}/${opportunity.id}`;
  return (
    <article className={styles.card} data-open={opportunity.is_open}>
      <header className={styles.ownerHeader}>
        <span className={styles.ownerImageShell}>
          {opportunity.posted_by.image_url ? (
            <Image
              alt=""
              className={styles.ownerImage}
              height={48}
              src={opportunity.posted_by.image_url}
              unoptimized
              width={48}
            />
          ) : (
            <span className={styles.ownerInitials}>
              {initials(opportunity.posted_by.name)}
            </span>
          )}
        </span>
        <span className={styles.ownerCopy}>
          <strong>{opportunity.posted_by.name}</strong>
          <span>{formatLabel(opportunity.posted_by.role, "Opportunity owner")}</span>
        </span>
        <span className={styles.statusBadge}>
          <span className={styles.statusDot} />
          {opportunity.status}
        </span>
      </header>

      <Link className={styles.body} href={route}>
        <span className={styles.eyebrow}>
          {opportunity.industry_sector ?? "Sector not set"}
        </span>
        <h3>{opportunity.title ?? "Untitled opportunity"}</h3>
        <div className={styles.badges}>
          <span>
            <HugeIcon icon={Building03Icon} size={14} />
            {formatLabel(opportunity.work_flexibility, "Mode not set")}
          </span>
          <span>
            <HugeIcon icon={Location01Icon} size={14} />
            {opportunity.location ?? "Location not set"}
          </span>
          <span>
            <HugeIcon icon={Money03Icon} size={14} />
            {opportunity.salary ?? "Salary not set"}
          </span>
        </div>
        <div className={styles.timeline}>
          <span>
            <HugeIcon icon={Calendar03Icon} size={14} />
            Apply by
          </span>
          <strong>{formatDate(opportunity.deadline)}</strong>
        </div>
      </Link>

      <footer className={styles.footer}>
        <Link href={route}>
          <HugeIcon icon={ViewIcon} size={15} />
          View details
        </Link>
        <span />
        <Link
          aria-disabled={!opportunity.is_open}
          className={opportunity.is_open ? styles.apply : styles.disabled}
          href={opportunity.is_open ? `${route}?apply=true` : route}
        >
          <HugeIcon icon={SentIcon} size={15} />
          {opportunity.is_open ? "Apply now" : "Applications closed"}
        </Link>
      </footer>
    </article>
  );
}

function initials(value: string) {
  return (
    value
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "TM"
  );
}

function formatLabel(value: string | null, fallback: string) {
  if (!value) return fallback;
  return value
    .toLowerCase()
    .split(/[_\s-]+/)
    .map((part) => `${part[0]?.toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

function formatDate(value: string | null) {
  if (!value) return "No deadline";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Date unavailable"
    : new Intl.DateTimeFormat("en-RW", { dateStyle: "medium" }).format(date);
}
