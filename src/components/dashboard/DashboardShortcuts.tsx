"use client";
import { useRouter } from "next/navigation";
import { Briefcase01Icon, File01Icon, GraduationCapIcon } from "@hugeicons/core-free-icons";
import { AdminFilterShell } from "@/components/shared/AdminFilterShell";
import { AuthButton } from "@/components/shared/AuthButton";
import styles from "./DashboardFilters.module.css";

export function DashboardShortcuts() { const router = useRouter(); return <AdminFilterShell actions={<><AuthButton className={styles.actionButton} icon={Briefcase01Icon} onClick={() => router.push("/opportunities/job-listings")}>Explore jobs</AuthButton><AuthButton className={styles.actionButton} icon={File01Icon} onClick={() => router.push("/applications/job-listings")} variant="secondary">Applications</AuthButton><AuthButton className={styles.actionButton} icon={GraduationCapIcon} onClick={() => router.push("/profile")} variant="secondary">Complete profile</AuthButton></>} actionCount={3} ariaLabel="Student journey shortcuts" onSubmit={(event) => event.preventDefault()} />; }
