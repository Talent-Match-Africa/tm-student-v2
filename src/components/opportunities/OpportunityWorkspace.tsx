"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { SentIcon } from "@hugeicons/core-free-icons";
import { AuthButton } from "@/components/shared/AuthButton";
import type { OpportunityFilters as FilterValues, OpportunityListResponse, OpportunityRouteType } from "@/types/opportunities";
import { OpportunityFeed } from "./OpportunityFeed";
import { OpportunityFilters } from "./OpportunityFilters";
import { OpportunitySidebarFilters } from "./OpportunitySidebarFilters";
import { OpportunityTypeTabs } from "./OpportunityTypeTabs";
import styles from "./OpportunityWorkspace.module.css";

interface Props { data: OpportunityListResponse | null; errorMessage: string | null; filters: FilterValues; type: OpportunityRouteType }

export function OpportunityWorkspace({ data, errorMessage, filters, type }: Props) {
  const router = useRouter(); const [isPending, startTransition] = useTransition();
  const label = type === "job-listings" ? "Job listings" : "Internships";
  function navigate(href: string) { startTransition(() => router.replace(href, { scroll: false })); }
  return (
    <div className={styles.workspace} aria-busy={isPending}>
      <header className={styles.header}><div><p className={styles.eyebrow}>Student opportunities</p><h1>{label}</h1><p className={styles.description}>Discover opportunities available to you and your university across Talent Match.</p></div><div className={styles.headerActions}><div className={styles.resultBadge}><strong>{(data?.count ?? 0).toLocaleString()}</strong><span>Matched records</span></div><AuthButton className={styles.addButton} icon={SentIcon} onClick={() => router.push(`/applications/${type}`)}>My applications</AuthButton></div></header>
      <OpportunityFilters filters={filters} isPending={isPending} onNavigate={navigate} type={type} />
      <div className={styles.contentLayout}><div className={styles.categoryRail}><OpportunityTypeTabs activeType={type} /><div aria-label="Opportunity filter controls" className={styles.sidebarScroll} role="region" tabIndex={0}><OpportunitySidebarFilters filters={filters} isPending={isPending} onNavigate={navigate} type={type} /></div></div><main className={styles.results}><OpportunityFeed errorMessage={errorMessage} filters={filters} initialData={data} onReset={() => navigate(`/opportunities/${type}`)} type={type} /></main></div>
    </div>
  );
}
