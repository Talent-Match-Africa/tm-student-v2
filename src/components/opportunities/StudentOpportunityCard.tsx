import Image from "next/image";
import Link from "next/link";
import { Building03Icon, Location01Icon, Money03Icon, SentIcon, ViewIcon } from "@hugeicons/core-free-icons";
import { HugeIcon } from "@/components/shared/HugeIcon";
import type { OpportunityRecord, OpportunityRouteType } from "@/types/opportunities";
import styles from "./StudentOpportunityCard.module.css";

export function StudentOpportunityCard({ opportunity, type }: { opportunity: OpportunityRecord; type: OpportunityRouteType }) {
  const ownerName = opportunity.posted_by.name || "Talent Match partner";
  const route = `/opportunities/${type}/${opportunity.id}`;
  return (
    <article className={styles.card} data-open={opportunity.is_open ? "true" : "false"}>
      <header className={styles.ownerHeader}>
        <div className={styles.ownerImageShell}>{opportunity.posted_by.image_url ? <Image alt={`${ownerName} logo`} className={styles.ownerImage} height={48} src={opportunity.posted_by.image_url} unoptimized width={48} /> : <span className={styles.ownerInitials}>{initials(ownerName)}</span>}</div>
        <div className={styles.ownerCopy}><strong>{ownerName}</strong><span>{formatLabel(opportunity.posted_by.role, "Opportunity owner")}</span></div>
        <span className={styles.statusBadge}><span className={styles.statusDot} aria-hidden="true" />{opportunity.is_open ? "Open" : opportunity.status === "UPCOMING" ? "Upcoming" : "Closed"}</span>
      </header>
      <Link className={styles.body} href={route}>
        <div className={styles.titleBlock}><span className={styles.eyebrow}>{opportunity.industry_sector ?? "Sector not set"}</span><h3>{opportunity.title ?? "Untitled opportunity"}</h3></div>
        <div className={styles.badgeList} aria-label="Opportunity details">
          <span className={styles.infoBadge}><HugeIcon icon={Building03Icon} size={14} />{formatLabel(opportunity.work_flexibility, "Work mode not set")}</span>
          <span className={styles.infoBadge}><HugeIcon icon={Location01Icon} size={14} />{opportunity.location ?? "Location not set"}</span>
          <span className={styles.infoBadge}><HugeIcon icon={Money03Icon} size={14} />{opportunity.salary ?? "Salary not set"}</span>
        </div>
      </Link>
      <footer className={styles.footer}><div className={styles.actions}>
        <Link className={styles.statButton} href={route}><HugeIcon icon={ViewIcon} size={14} /><span>View details</span></Link>
        <span className={styles.actionDivider} aria-hidden="true" />
        {opportunity.is_open ? <Link className={`${styles.iconButton} ${styles.editButton}`} href={`${route}?apply=true`}><HugeIcon icon={SentIcon} size={14} /><span>Apply now</span></Link> : <span aria-disabled="true" className={styles.statButton}><HugeIcon icon={SentIcon} size={14} /><span>Applications closed</span></span>}
      </div></footer>
    </article>
  );
}

function initials(value: string) { return value.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "TM"; }
function formatLabel(value: string | null, fallback: string) { return value ? value.toLowerCase().split(/[_\s-]+/).filter(Boolean).map((part) => `${part[0]?.toUpperCase() ?? ""}${part.slice(1)}`).join(" ") : fallback; }
