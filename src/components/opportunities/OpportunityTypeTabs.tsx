import Link from "next/link";
import { HugeIcon } from "@/components/shared/HugeIcon";
import type { OpportunityRouteType } from "@/types/opportunities";
import { OPPORTUNITY_TABS } from "./constants";
import styles from "./OpportunityTypeTabs.module.css";

export function OpportunityTypeTabs({ activeType }: { activeType: OpportunityRouteType }) {
  return (
    <aside className={styles.rail}>
      <p className={styles.railLabel}>Categories</p>
      <nav aria-label="Opportunity type" className={styles.tabs}>
        {OPPORTUNITY_TABS.map((tab) => (
          <Link aria-current={activeType === tab.type ? "page" : undefined} className={styles.tab} data-active={activeType === tab.type ? "true" : "false"} href={tab.href} key={tab.type}>
            <span className={styles.icon} aria-hidden="true"><HugeIcon icon={tab.icon} size={17} /></span>
            <span className={styles.copy}><strong>{tab.label}</strong><small>{tab.description}</small></span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
