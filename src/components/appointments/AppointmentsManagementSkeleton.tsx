import { AdminFilterSkeleton } from "@/components/shared/AdminFilterSkeleton";
import styles from "./AppointmentsManagementSkeleton.module.css";

const ROWS = Array.from({ length: 8 }, (_, index) => index);

export function AppointmentsManagementSkeleton() {
  return (
    <div
      className={styles.workspace}
      aria-busy="true"
      aria-label="Loading appointments"
    >
      <header className={styles.header} aria-hidden="true">
        <div>
          <span className={styles.eyebrow} />
          <span className={styles.title} />
          <span className={styles.description} />
        </div>
        <span className={styles.resultBadge} />
      </header>

      <AdminFilterSkeleton />

      <section className={styles.tablePanel} aria-hidden="true">
        <div className={styles.tableHeader}>
          <span className={styles.lineShort} />
          <span className={styles.lineMedium} />
        </div>
        <div className={styles.scroller}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Appointment</th>
                <th>Student</th>
                <th>Counselor</th>
                <th>University</th>
                <th>Schedule</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row}>
                  <td>
                    <span className={styles.identityLine} />
                  </td>
                  <td>
                    <span className={styles.personLine} />
                  </td>
                  <td>
                    <span className={styles.personLine} />
                  </td>
                  <td>
                    <span className={styles.universityLine} />
                  </td>
                  <td>
                    <span className={styles.scheduleLine} />
                  </td>
                  <td>
                    <span className={styles.statusLine} />
                  </td>
                  <td>
                    <span className={styles.actionLine} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
