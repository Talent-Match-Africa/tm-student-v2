import styles from "./StudentEmailChangeConfirmationSkeleton.module.css";

export function StudentEmailChangeConfirmationSkeleton() {
  return (
    <section
      aria-label="Loading email verification"
      aria-live="polite"
      className={styles.page}
      role="status"
    >
      <header className={styles.header} aria-hidden="true">
        <span />
        <span />
        <span />
      </header>
      <div className={styles.panel} aria-hidden="true">
        <span className={styles.icon} />
        <div className={styles.copy}>
          <span />
          <span />
          <span />
        </div>
        <span className={styles.action} />
      </div>
      <span className="sr-only">Verifying student email.</span>
    </section>
  );
}
