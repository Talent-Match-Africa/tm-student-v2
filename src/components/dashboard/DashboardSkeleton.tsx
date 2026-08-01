import { AdminFilterSkeleton } from "@/components/shared/AdminFilterSkeleton";
import styles from "./DashboardSkeleton.module.css";

export function DashboardSkeleton() {
  return (
    <div
      aria-label="Loading dashboard"
      aria-live="polite"
      className={styles.workspace}
      role="status"
    >
      <span className={styles.screenReaderOnly}>
        Loading dashboard overview.
      </span>
      <header className={styles.header} aria-hidden="true">
        <div className={styles.headerCopy}>
          <span className={styles.eyebrow} />
          <span className={styles.title} />
          <span className={styles.description} />
        </div>
        <div className={styles.context}>
          <span />
          <span />
        </div>
      </header>

      <AdminFilterSkeleton actionCount={2} showSearch={false} />

      <section className={styles.totals} aria-hidden="true">
        <div className={styles.sectionHeading}>
          <span />
          <span />
        </div>
        <div className={styles.totalGrid}>
          {Array.from({ length: 5 }, (_, index) => (
            <div className={styles.totalMetric} key={index}>
              <span className={styles.icon} />
              <div>
                <span className={styles.label} />
                <span className={styles.number} />
                <span className={styles.shortLine} />
              </div>
              <span className={styles.badges} />
            </div>
          ))}
        </div>
      </section>

      <div className={styles.operationalGrid} aria-hidden="true">
        <section className={styles.activityPanel}>
          <div className={styles.sectionHeading}>
            <span />
            <span />
          </div>
          <div className={styles.activityGrid}>
            {Array.from({ length: 10 }, (_, index) => (
              <span className={styles.activityMetric} key={index} />
            ))}
          </div>
        </section>
        <section className={styles.attentionPanel}>
          <div className={styles.sectionHeading}>
            <span />
            <span />
          </div>
          <div className={styles.attentionList}>
            {Array.from({ length: 6 }, (_, index) => (
              <span className={styles.countMetric} key={index} />
            ))}
          </div>
        </section>
      </div>

      <section className={styles.outcomes} aria-hidden="true">
        <div className={styles.sectionHeading}>
          <span />
          <span />
        </div>
        <div className={styles.outcomeGrid}>
          {Array.from({ length: 8 }, (_, index) => (
            <span className={styles.countMetric} key={index} />
          ))}
        </div>
      </section>
    </div>
  );
}
