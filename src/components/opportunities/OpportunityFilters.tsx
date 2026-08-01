"use client";

import { useState, type FormEvent } from "react";
import { Cancel01Icon, FilterHorizontalIcon, Search01Icon } from "@hugeicons/core-free-icons";
import { AdminFilterShell } from "@/components/shared/AdminFilterShell";
import { AuthButton } from "@/components/shared/AuthButton";
import { InputField } from "@/components/shared/InputField";
import { buildOpportunityHref } from "@/endpoints/student/opportunity-query";
import type { OpportunityFilters as FilterValues, OpportunityRouteType } from "@/types/opportunities";
import styles from "./OpportunityFilters.module.css";

interface Props { filters: FilterValues; isPending: boolean; onNavigate: (href: string) => void; type: OpportunityRouteType }

export function OpportunityFilters({ filters, isPending, onNavigate, type }: Props) {
  const [search, setSearch] = useState(filters.search ?? "");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = search.trim();
    onNavigate(buildOpportunityHref(type, { ...filters, page: 1, search: value.length >= 3 ? value : null }));
  }
  function reset() { setSearch(""); onNavigate(`/opportunities/${type}`); }
  return (
    <AdminFilterShell actions={<><AuthButton className={styles.utilityButton} icon={FilterHorizontalIcon} isLoading={isPending} type="submit">Apply</AuthButton><AuthButton className={styles.utilityButton} disabled={!filters.search && filters.status === "ACTIVE" && !filters.workFlexibility && !filters.industrySector && !filters.location && filters.ordering === "-created_at"} icon={Cancel01Icon} onClick={reset} variant="secondary">Reset</AuthButton></>} ariaLabel="Opportunity filters" onSubmit={submit}>
      <div className={styles.searchField}><InputField autoComplete="off" icon={Search01Icon} label={type === "job-listings" ? "Search job listings" : "Search internships"} name="search" onChange={(event) => setSearch(event.target.value)} placeholder="Type at least 3 characters" type="search" value={search} /></div>
    </AdminFilterShell>
  );
}
