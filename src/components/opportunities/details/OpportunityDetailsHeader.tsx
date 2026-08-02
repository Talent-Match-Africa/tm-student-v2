"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft01Icon,
  SentIcon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { AuthButton } from "@/components/shared/AuthButton";
import type {
  OpportunityRecord,
  OpportunityRouteType,
} from "@/types/opportunities";
import {
  formatOpportunityDate,
  formatOpportunityLabel,
  opportunityOwnerInitials,
} from "./opportunity-details-utils";
import styles from "./OpportunityDetailsHeader.module.css";

interface OpportunityDetailsHeaderProps {
  opportunity: OpportunityRecord;
  type: OpportunityRouteType;
}

export function OpportunityDetailsHeader({
  opportunity,
  type,
}: OpportunityDetailsHeaderProps) {
  const router = useRouter();
  const ownerName = opportunity.posted_by.name || "Unknown owner";

  return (
    <header className={styles.header}>
      <div className={styles.identity}>
        <div className={styles.ownerImage} aria-hidden="true">
          {opportunity.posted_by.image_url ? (
            <Image
              alt=""
              height={54}
              src={opportunity.posted_by.image_url}
              unoptimized
              width={54}
            />
          ) : (
            opportunityOwnerInitials(ownerName)
          )}
        </div>
        <div className={styles.titleGroup}>
          <div className={styles.ownerLine}>
            <span>{ownerName}</span>
            <span className={styles.ownerType}>
              {formatOpportunityLabel(
                opportunity.posted_by.role,
                "Opportunity owner",
              )}
            </span>
          </div>
          <h1>
            {opportunity.title ??
              `Untitled ${type === "job-listings" ? "job listing" : "internship"}`}
          </h1>
          <div className={styles.statusLine}>
            <span
              className={styles.status}
              data-open={opportunity.is_open ? "true" : "false"}
            >
              <span aria-hidden="true" />
              {formatOpportunityLabel(opportunity.status, "Unavailable")}
            </span>
            <span>Apply by {formatOpportunityDate(opportunity.deadline)}</span>
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <AuthButton
          className={styles.action}
          icon={ArrowLeft01Icon}
          onClick={() => router.push(`/opportunities/${type}`)}
          variant="secondary"
        >
          Go back
        </AuthButton>
        <AuthButton
          className={styles.action}
          disabled={!opportunity.is_open}
          icon={SentIcon}
          onClick={() =>
            router.push(`/opportunities/${type}/${opportunity.id}?apply=true`, {
              scroll: false,
            })
          }
        >
          Apply now
        </AuthButton>
      </div>
    </header>
  );
}
