import styles from "./ResourcesManagementSkeleton.module.css";

const SKELETON_ROWS = Array.from({ length: 24 }, (_, index) => index);

export function ResourcesManagementSkeleton() {
  return (
    <div
      aria-label="Loading resources"
      aria-live="polite"
      className={styles.workspace}
      role="status"
    >
      <header className={styles.header} aria-hidden="true">
        <div className={styles.headerCopy}>
          <span className={styles.eyebrow} />
          <span className={styles.title} />
          <span className={styles.description} />
        </div>
        <div className={styles.headerActions}>
          <span className={styles.resultBadge} />
          <span className={styles.resultBadge} />
          <span className={styles.addButton} />
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
                <th>Resource</th>
                <th>Content</th>
                <th>Owner</th>
                <th>Audience and date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {SKELETON_ROWS.map((row) => (
                <tr key={row}>
                  <td data-label="Resource">
                    <div className={styles.identity}>
                      <span className={styles.cover} />
                      <span className={styles.stack}>
                        <span className={styles.lineName} />
                        <span className={styles.lineDescription} />
                      </span>
                    </div>
                  </td>
                  <td data-label="Content">
                    <span className={styles.stack}>
                      <span className={styles.typeBadge} />
                      <span className={styles.lineMedium} />
                    </span>
                  </td>
                  <td data-label="Owner">
                    <span className={styles.owner}>
                      <span className={styles.ownerAvatar} />
                      <span className={styles.stack}>
                        <span className={styles.lineOwner} />
                        <span className={styles.lineShort} />
                      </span>
                    </span>
                  </td>
                  <td data-label="Audience and date">
                    <span className={styles.stack}>
                      <span className={styles.lineAudience} />
                      <span className={styles.lineMedium} />
                    </span>
                  </td>
                  <td data-label="Status">
                    <span className={styles.statusBadge} />
                  </td>
                  <td data-label="Actions">
                    <span className={styles.rowActions}>
                      <span />
                      <span />
                      <span />
                      <span />
                    </span>
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
      <span className={styles.screenReaderOnly}>Loading resources...</span>
    </div>
  );
}
