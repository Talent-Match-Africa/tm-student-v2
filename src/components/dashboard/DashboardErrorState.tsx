"use client";
import { useRouter } from "next/navigation";
import { Alert01Icon, RefreshIcon } from "@hugeicons/core-free-icons";
import { AuthButton } from "@/components/shared/AuthButton";
import { HugeIcon } from "@/components/shared/HugeIcon";
import { DashboardShortcuts } from "./DashboardShortcuts";
import styles from "./DashboardErrorState.module.css";

export function DashboardErrorState({ message }: { message: string }) { const router = useRouter(); return <div className={styles.workspace}><header className={styles.header}><span>Student journey</span><h1>Dashboard</h1><p>Keep your profile ready, track your applications, and prepare for what comes next.</p></header><DashboardShortcuts /><section className={styles.alert} role="alert"><span className={styles.icon} aria-hidden="true"><HugeIcon icon={Alert01Icon} size={22} /></span><div><h2>Dashboard information is unavailable</h2><p>{message}</p></div><AuthButton className={styles.retryButton} icon={RefreshIcon} onClick={() => router.refresh()} type="button" variant="secondary">Try again</AuthButton></section></div>; }
