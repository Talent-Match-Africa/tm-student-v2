import type { Metadata } from "next";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your Talent Match student workspace.",
};

export default function DashboardPage() {
  return (
    <section className={styles.workspace}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Student journey</p>
          <h2>Welcome to your workspace</h2>
          <p>
            Your opportunities, applications, appointments, resources, and
            profile progress will come together here.
          </p>
        </div>
        <span className={styles.phaseBadge}>Foundation ready</span>
      </header>

      <div className={styles.foundation} role="status">
        <span className={styles.foundationMark}>TM</span>
        <div>
          <strong>Your secure student portal is connected.</strong>
          <p>
            Dashboard data and feature workspaces will be added in the next
            implementation phases.
          </p>
        </div>
      </div>
    </section>
  );
}
