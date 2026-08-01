import Link from "next/link";
import { ArrowRight01Icon, Calendar03Icon } from "@hugeicons/core-free-icons";
import { HugeIcon } from "@/components/shared/HugeIcon";
import type { DashboardAppointment } from "@/types/student-dashboard";
import styles from "./DashboardPanel.module.css";

interface DashboardAppointmentsProps {
  items: DashboardAppointment[];
}

export function DashboardAppointments({ items }: DashboardAppointmentsProps) {
  return (
    <article className={styles.panel}>
      <header className={styles.panelHeader}>
        <div>
          <span>Guidance calendar</span>
          <h3>Upcoming appointments</h3>
        </div>
        <Link href="/appointments" aria-label="View all appointments">
          <HugeIcon icon={ArrowRight01Icon} size={18} />
        </Link>
      </header>
      {items.length ? (
        <div className={styles.timeline}>
          {items.map((item) => (
            <Link href={`/appointments/${item.id}`} key={item.id}>
              <span className={styles.timelineIcon}>
                <HugeIcon icon={Calendar03Icon} size={17} />
              </span>
              <div>
                <strong>{item.subject}</strong>
                <span>
                  {formatDate(item.date)} ·{" "}
                  {item.counselor.name ?? "Counselor"}
                </span>
              </div>
              <small>{item.status}</small>
            </Link>
          ))}
        </div>
      ) : (
        <p className={styles.empty}>
          No upcoming guidance sessions. Book one when you need support.
        </p>
      )}
    </article>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Date unavailable"
    : new Intl.DateTimeFormat("en-RW", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
}
