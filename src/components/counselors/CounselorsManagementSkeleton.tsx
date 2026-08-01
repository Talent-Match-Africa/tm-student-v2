import styles from "./CounselorsManagementSkeleton.module.css";

const SKELETON_ROWS = Array.from({ length: 24 }, (_, index) => index);

export function CounselorsManagementSkeleton() {
  return (
    <div
      aria-label="Loading counselors"
      aria-live="polite"
      className={styles.workspace}
      role="status"
    >
      <header className={styles.header}>
        <div className={styles.headerCopy}>
          <span className={styles.pageEyebrow} />
          <span className={styles.pageTitle} />
          <span className={styles.pageDescription} />
        </div>
        <div className={styles.headerActions}>
          <span className={styles.resultBadge} />
          <span className={styles.headerButtonPrimary} />
        </div>
      </header>

      <section className={styles.filterPanel} aria-hidden="true">
        <div className={styles.filterForm}>
          <div className={styles.searchControl}>
            <span className={styles.controlLabel} />
            <span className={styles.controlField} />
          </div>
          <div className={styles.dateControls}>
            <div className={styles.dateControl}>
              <span className={styles.controlLabel} />
              <span className={styles.controlField} />
            </div>
            <div className={styles.dateControl}>
              <span className={styles.controlLabel} />
              <span className={styles.controlField} />
            </div>
          </div>
          <div className={styles.filterActions}>
            <span className={styles.filterButton} />
            <span className={styles.filterButtonPrimary} />
            <span className={styles.filterButton} />
          </div>
        </div>
      </section>

      <section className={styles.tablePanel} aria-hidden="true">
        <div className={styles.tableHeader}>
          <span className={styles.tableCount} />
          <span className={styles.tablePage} />
        </div>
        <div className={styles.scroller}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Counselor</th>
                <th>Contact</th>
                <th>University</th>
                <th>Appointments</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {SKELETON_ROWS.map((row) => (
                <tr key={row}>
                  <td data-label="Counselor">
                    <div className={styles.identity}>
                      <span className={styles.avatar} />
                      <span className={styles.stack}>
                        <span className={styles.lineName} />
                        <span className={styles.lineShort} />
                      </span>
                    </div>
                  </td>
                  <td data-label="Contact">
                    <span className={styles.stack}>
                      <span className={styles.lineContact} />
                      <span className={styles.lineMedium} />
                    </span>
                  </td>
                  <td data-label="University">
                    <span className={styles.universitySource}>
                      <span className={styles.universityDot} />
                      <span className={styles.lineUniversity} />
                    </span>
                  </td>
                  <td data-label="Appointments">
                    <span className={styles.appointmentCounts}>
                      <span className={styles.appointmentCount} />
                      <span className={styles.appointmentCount} />
                    </span>
                  </td>
                  <td data-label="Status">
                    <span className={styles.statusBadge} />
                  </td>
                  <td data-label="Actions">
                    <div className={styles.rowActions}>
                      <span />
                      <span />
                      <span />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <footer className={styles.pagination} aria-hidden="true">
        <span className={styles.paginationButton} />
        <span className={styles.paginationStatus} />
        <span className={styles.paginationButton} />
      </footer>

      <span className={styles.screenReaderOnly}>Loading counselors...</span>
    </div>
  );
}
