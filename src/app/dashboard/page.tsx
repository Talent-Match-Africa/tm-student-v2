import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight01Icon,
  Briefcase01Icon,
  Calendar03Icon,
  File01Icon,
  GraduationCapIcon,
} from "@hugeicons/core-free-icons";
import { DashboardApplicationSummary } from "@/components/dashboard/DashboardApplicationSummary";
import { DashboardAppointments } from "@/components/dashboard/DashboardAppointments";
import { DashboardResources } from "@/components/dashboard/DashboardResources";
import { HugeIcon } from "@/components/shared/HugeIcon";
import { getStudentDashboard } from "@/endpoints/student/get-dashboard";
import { requireStudentSession } from "@/lib/student-session";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your Talent Match student workspace.",
};

export default async function DashboardPage() {
  const { accessToken, profile } = await requireStudentSession("/dashboard");
  const result = await getStudentDashboard(accessToken);

  if (!result.ok) {
    return (
      <section className={styles.workspace}>
        <div className={styles.errorState} role="alert">
          <span>Dashboard unavailable</span>
          <h2>Your workspace could not be loaded.</h2>
          <p>
            {readMessage(result.payload) ??
              "Check your connection and try again."}
          </p>
          <Link href="/dashboard">Try again</Link>
        </div>
      </section>
    );
  }

  const dashboard = result.payload.data;
  const name =
    profile.profile?.displayName?.trim() ||
    profile.name?.trim() ||
    "there";

  return (
    <section className={styles.workspace}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Student journey</p>
          <h2>Welcome back, {firstName(name)}</h2>
          <p>
            Keep your profile ready, track your applications, and prepare for
            what comes next.
          </p>
        </div>
        <div className={styles.completion}>
          <span>{dashboard.completion.profile_percent}%</span>
          <div>
            <strong>Profile readiness</strong>
            <small>
              {dashboard.completion.has_document
                ? "Document ready"
                : "Add a supporting document"}
            </small>
          </div>
        </div>
      </header>

      <div className={styles.commandGrid}>
        <Link className={styles.primaryCommand} href="/opportunities">
          <span className={styles.commandIcon}>
            <HugeIcon icon={Briefcase01Icon} size={22} />
          </span>
          <div>
            <strong>Explore new opportunities</strong>
            <p>
              {dashboard.new_opportunities.jobs} jobs and{" "}
              {dashboard.new_opportunities.internships} internships added
              recently.
            </p>
          </div>
          <HugeIcon icon={ArrowRight01Icon} size={20} />
        </Link>

        <Link className={styles.command} href="/applications">
          <HugeIcon icon={File01Icon} size={20} />
          <span>Track applications</span>
        </Link>
        <Link className={styles.command} href="/appointments">
          <HugeIcon icon={Calendar03Icon} size={20} />
          <span>View appointments</span>
        </Link>
        <Link className={styles.command} href="/profile">
          <HugeIcon icon={GraduationCapIcon} size={20} />
          <span>Complete profile</span>
        </Link>
      </div>

      <div className={styles.dashboardGrid}>
        <DashboardApplicationSummary
          statuses={dashboard.applications_by_status}
        />
        <DashboardAppointments items={dashboard.upcoming_appointments} />
        <DashboardResources items={dashboard.recent_resources} />
      </div>
    </section>
  );
}

function firstName(name: string) {
  return name.split(/\s+/)[0] || "there";
}

function readMessage(payload: unknown) {
  if (typeof payload !== "object" || payload === null) return null;
  const message = (payload as Record<string, unknown>).message;
  return typeof message === "string" ? message : null;
}
