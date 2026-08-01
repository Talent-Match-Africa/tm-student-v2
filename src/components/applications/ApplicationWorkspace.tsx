"use client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import type { ApplicationFilters as Values, ApplicationListResponse, ApplicationRouteType } from "@/types/applications";
import { ApplicationFeed } from "./ApplicationFeed";
import { ApplicationFilters } from "./ApplicationFilters";
import { ApplicationSidebarFilters } from "./ApplicationSidebarFilters";
import { ApplicationTypeTabs } from "./ApplicationTypeTabs";
import styles from "./ApplicationWorkspace.module.css";

export function ApplicationWorkspace({ errorMessage, filters, initialData, type }: { errorMessage: string | null; filters: Values; initialData: ApplicationListResponse | null; type: ApplicationRouteType }) {
  const router = useRouter(); const [isPending, startTransition] = useTransition(); const label = type === "job-listings" ? "Job applications" : "Internship applications";
  function navigate(href: string) { startTransition(() => router.replace(href, { scroll: false })); }
  return <div className={styles.workspace} aria-busy={isPending}><header className={styles.header}><div><p className={styles.eyebrow}>My applications</p><h1>{label}</h1><p className={styles.description}>Track every submission, review its latest decision, and return to the related opportunity.</p></div><div className={styles.resultBadge}><strong>{(initialData?.count ?? 0).toLocaleString()}</strong><span>Matched applications</span></div></header><div className={styles.contentLayout}><div className={styles.categoryRail}><ApplicationTypeTabs activeType={type} /><div aria-label="Application filter controls" className={styles.sidebarScroll} role="region" tabIndex={0}><ApplicationSidebarFilters filters={filters} isPending={isPending} onNavigate={navigate} type={type} /></div></div><main className={styles.results}><ApplicationFilters filters={filters} isPending={isPending} onNavigate={navigate} type={type} /><ApplicationFeed errorMessage={errorMessage} filters={filters} initialData={initialData} onReset={() => navigate(`/applications/${type}`)} type={type} /></main></div></div>;
}
