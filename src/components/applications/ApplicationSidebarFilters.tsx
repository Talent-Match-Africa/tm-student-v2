"use client";
import { useState, type FormEvent } from "react";
import { Cancel01Icon, FilterHorizontalIcon, StatusIcon } from "@hugeicons/core-free-icons";
import { AuthButton } from "@/components/shared/AuthButton";
import { HugeIcon } from "@/components/shared/HugeIcon";
import { SelectField } from "@/components/shared/SelectField";
import { buildApplicationsHref } from "@/endpoints/student/application-query";
import type { ApplicationFilters, ApplicationRouteType } from "@/types/applications";
import { APPLICATION_STATUS_OPTIONS } from "./constants";
import styles from "./ApplicationSidebarFilters.module.css";

export function ApplicationSidebarFilters({ filters, isPending, onNavigate, type }: { filters: ApplicationFilters; isPending: boolean; onNavigate: (href: string) => void; type: ApplicationRouteType }) {
  const [status, setStatus] = useState(filters.status ?? "");
  function apply(event: FormEvent<HTMLFormElement>) { event.preventDefault(); onNavigate(buildApplicationsHref(type, { ...filters, page: 1, status: status || null })); }
  function reset() { setStatus(""); onNavigate(buildApplicationsHref(type, { ...filters, page: 1, status: null })); }
  return <section className={styles.panel} aria-labelledby="application-filter-title"><header className={styles.header}><span className={styles.headerIcon} aria-hidden="true"><HugeIcon icon={FilterHorizontalIcon} size={15} /></span><div><h2 id="application-filter-title">Filter results</h2><p>Refine your application history.</p></div></header><form className={styles.form} onSubmit={apply}><div className={styles.fields}><SelectField icon={StatusIcon} label="Application status" name="status" onChange={(event) => setStatus(event.target.value)} options={APPLICATION_STATUS_OPTIONS} requirement="optional" value={status} /></div><footer className={styles.actions}><AuthButton className={styles.actionButton} disabled={!filters.status} icon={Cancel01Icon} onClick={reset} type="button" variant="secondary">Reset</AuthButton><AuthButton className={styles.actionButton} icon={FilterHorizontalIcon} isLoading={isPending} loadingLabel="Applying filters" type="submit">Apply</AuthButton></footer></form></section>;
}
