"use client";
import { useState, type FormEvent } from "react";
import { Cancel01Icon, FilterHorizontalIcon, Search01Icon } from "@hugeicons/core-free-icons";
import { AdminFilterShell } from "@/components/shared/AdminFilterShell";
import { AuthButton } from "@/components/shared/AuthButton";
import { InputField } from "@/components/shared/InputField";
import { useLiveSearch } from "@/lib/use-live-search";
import { buildCounselorsHref, type CounselorFilters as Values } from "./utils";
import styles from "./CounselorFilters.module.css";

export function CounselorFilters({ filters, isPending, onNavigate }: { filters: Values; isPending: boolean; onNavigate: (href: string) => void }) {
  const [search, setSearch] = useState(filters.search ?? "");
  useLiveSearch({ appliedValue: filters.search, onSearch: (value) => onNavigate(buildCounselorsHref({ page: 1, search: value })), value: search });
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const value = search.trim(); onNavigate(buildCounselorsHref({ page: 1, search: value.length >= 3 ? value : null })); }
  function reset() { setSearch(""); onNavigate("/counselors"); }
  return <AdminFilterShell actionCount={2} actions={<><AuthButton className={styles.utilityButton} icon={FilterHorizontalIcon} isLoading={isPending} type="submit">Apply</AuthButton><AuthButton className={styles.utilityButton} disabled={!filters.search} icon={Cancel01Icon} onClick={reset} type="button" variant="secondary">Reset</AuthButton></>} ariaLabel="Counselor filters" onSubmit={submit}><div className={styles.searchField}><InputField icon={Search01Icon} label="Search counselors" name="search" onChange={(event) => setSearch(event.target.value)} placeholder="Counselor name" type="search" value={search} /></div></AdminFilterShell>;
}
