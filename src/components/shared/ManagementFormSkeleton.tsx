import styles from "./ManagementFormSkeleton.module.css";

interface ManagementFormSkeletonProps {
  stepCount?: number;
}

export function ManagementFormSkeleton({
  stepCount = 4,
}: ManagementFormSkeletonProps) {
  const steps = Array.from(
    { length: Math.max(1, Math.min(stepCount, 6)) },
    (_, index) => index,
  );

  return (
    <section
      aria-live="polite"
      aria-label="Loading management form"
      className={styles.page}
      role="status"
    >
      <header className={styles.pageHeader}>
        <div className={styles.headerCopy}>
          <span className={styles.eyebrow} />
          <span className={styles.title} />
          <span className={styles.description} />
        </div>
        <span className={styles.headerAction} />
      </header>

      <span className={styles.progress} />

      <div className={styles.shell}>
        <aside className={styles.steps}>
          {steps.map((step) => (
            <span key={step} />
          ))}
        </aside>
        <div className={styles.formPanel}>
          <header className={styles.formHeader}>
            <span className={styles.stepLabel} />
            <span className={styles.stepTitle} />
            <span className={styles.stepDescription} />
          </header>
          <div className={styles.fields}>
            <span />
            <span />
            <span />
          </div>
          <footer className={styles.actions}>
            <span />
            <span />
            <span />
          </footer>
        </div>
      </div>
    </section>
  );
}
