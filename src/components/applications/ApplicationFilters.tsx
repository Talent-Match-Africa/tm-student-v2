"use client";
import { useState, type FormEvent } from "react";
import { Cancel01Icon, FilterHorizontalIcon, Search01Icon } from "@hugeicons/core-free-icons";
import { AdminFilterShell } from "@/components/shared/AdminFilterShell";
import { AuthButton } from "@/components/shared/AuthButton";
import { InputField } from "@/components/shared/InputField";
import { buildApplicationsHref } from "@/endpoints/student/application-query";
import { useLiveSearch } from "@/lib/use-live-search";
import type { ApplicationFilters as Values, ApplicationRouteType } from "@/types/applications";
import styles from "./ApplicationFilters.module.css";

export function ApplicationFilters({ filters, isPending, onNavigate, type }: { filters: Values; isPending: boolean; onNavigate: (href: string) => void; type: ApplicationRouteType }) {
  const [search, setSearch] = useState(filters.search ?? "");
  useLiveSearch({ appliedValue: filters.search, onSearch: (value) => onNavigate(buildApplicationsHref(type, { ...filters, page: 1, search: value })), value: search });
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const value = search.trim(); onNavigate(buildApplicationsHref(type, { ...filters, page: 1, search: value.length >= 3 ? value : null })); }
  function reset() { setSearch(""); onNavigate(`/applications/${type}`); }
  return <AdminFilterShell actions={<><AuthButton className={styles.utilityButton} icon={FilterHorizontalIcon} isLoading={isPending} type="submit">Apply</AuthButton><AuthButton className={styles.utilityButton} disabled={!filters.search && !filters.status} icon={Cancel01Icon} onClick={reset} variant="secondary">Reset</AuthButton></>} ariaLabel="Application filters" onSubmit={submit}><div className={styles.searchField}><InputField autoComplete="off" icon={Search01Icon} label="Search applications" name="search" onChange={(event) => setSearch(event.target.value)} placeholder="Opportunity or owner" type="search" value={search} /></div></AdminFilterShell>;
}
