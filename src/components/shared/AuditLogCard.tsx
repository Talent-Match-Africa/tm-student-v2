import {
  ApiIcon,
  Audit02Icon,
  Calendar03Icon,
  Link04Icon,
  Timer02Icon,
  UserAccountIcon,
} from "@hugeicons/core-free-icons";
import { HugeIcon } from "@/components/shared/HugeIcon";
import styles from "./AuditLogCard.module.css";

export interface AuditLogCardRecord {
  action: string;
  actor_email: string | null;
  actor_id: string | null;
  created_at: string | null;
  description: string;
  method: string | null;
  path: string | null;
  response_time_ms: number | null;
  severity: string;
  status_code: number | null;
}

interface AuditLogCardProps {
  log: AuditLogCardRecord;
}

export function AuditLogCard({ log }: AuditLogCardProps) {
  const severity = formatAuditLabel(log.severity);
  const actor = log.actor_email ?? log.actor_id ?? "System event";
  const statusCode = log.status_code ? String(log.status_code) : "No status";
  const method = log.method ?? "System";
  const path = log.path || "Internal activity";

  return (
    <article className={styles.card} data-severity={log.severity}>
      <header className={styles.header}>
        <span className={styles.eventIcon} aria-hidden="true">
          <HugeIcon icon={Audit02Icon} size={18} />
        </span>

        <div className={styles.eventTitle}>
          <span>{formatAuditLabel(log.action)}</span>
          <strong>{severity}</strong>
        </div>
      </header>

      <p className={styles.description}>{log.description}</p>

      <div className={styles.metaGrid} aria-label="Audit log metadata">
        <span>
          <HugeIcon icon={UserAccountIcon} size={14} />
          {actor}
        </span>

        <span>
          <HugeIcon icon={Link04Icon} size={14} />
          {path}
        </span>

        <span>
          <HugeIcon icon={ApiIcon} size={14} />
          {method} · {statusCode}
        </span>

        <span>
          <HugeIcon icon={Timer02Icon} size={14} />
          {formatResponseTime(log.response_time_ms)}
        </span>
      </div>

      <footer className={styles.footer}>
        <span>
          <HugeIcon icon={Calendar03Icon} size={14} />
          {formatDateTime(log.created_at)}
        </span>
      </footer>
    </article>
  );
}

function formatAuditLabel(value: string | null): string {
  if (!value) {
    return "Not set";
  }

  return value
    .toLowerCase()
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

function formatDateTime(value: string | null): string {
  if (!value) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Africa/Kigali",
  }).format(new Date(value));
}

function formatResponseTime(value: number | null): string {
  if (typeof value !== "number") {
    return "No timing";
  }

  return `${value}ms`;
}
