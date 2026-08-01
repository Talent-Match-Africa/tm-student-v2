import Link from "next/link";
import clsx from "clsx";
import type { OpportunityRouteType } from "@/types/opportunities";
import styles from "./OpportunityTypeTabs.module.css";

interface OpportunityTypeTabsProps {
  activeType: OpportunityRouteType;
}

export function OpportunityTypeTabs({
  activeType,
}: OpportunityTypeTabsProps) {
  return (
    <nav className={styles.tabs} aria-label="Opportunity types">
      <span>Browse by type</span>
      <Link
        className={clsx(
          styles.tab,
          activeType === "job-listings" && styles.active,
        )}
        href="/opportunities/job-listings"
      >
        Job listings
      </Link>
      <Link
        className={clsx(
          styles.tab,
          activeType === "internships" && styles.active,
        )}
        href="/opportunities/internships"
      >
        Internships
      </Link>
    </nav>
  );
}
