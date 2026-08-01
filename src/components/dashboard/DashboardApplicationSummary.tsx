import Link from "next/link";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeIcon } from "@/components/shared/HugeIcon";
import styles from "./DashboardPanel.module.css";

interface DashboardApplicationSummaryProps {
  statuses: Record<string, number>;
}

export function DashboardApplicationSummary({
  statuses,
}: DashboardApplicationSummaryProps) {
  const entries = Object.entries(statuses);
  const total = entries.reduce((sum, [, count]) => sum + count, 0);

  return (
    <article className={`${styles.panel} ${styles.applicationPanel}`}>
      <header className={styles.panelHeader}>
        <div>
          <span>Application pipeline</span>
          <h3>{total.toLocaleString()} total applications</h3>
        </div>
        <Link href="/applications" aria-label="View all applications">
          <HugeIcon icon={ArrowRight01Icon} size={18} />
        </Link>
      </header>
      {entries.length ? (
        <div className={styles.statusList}>
          {entries.map(([status, count]) => (
            <div className={styles.statusRow} key={status}>
              <span>{formatStatus(status)}</span>
              <strong>{count.toLocaleString()}</strong>
            </div>
          ))}
        </div>
      ) : (
        <p className={styles.empty}>
          Your application journey starts in Opportunities.
        </p>
      )}
    </article>
  );
}

function formatStatus(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => `${part[0]?.toUpperCase()}${part.slice(1)}`)
    .join(" ");
}
