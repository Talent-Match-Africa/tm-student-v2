"use client";

import { useState, type FormEvent } from "react";
import { Briefcase01Icon, Cancel01Icon, FilterHorizontalIcon, Location01Icon, SortByDown02Icon, StatusIcon } from "@hugeicons/core-free-icons";
import { AuthButton } from "@/components/shared/AuthButton";
import { HugeIcon } from "@/components/shared/HugeIcon";
import { InputField } from "@/components/shared/InputField";
import { SelectField } from "@/components/shared/SelectField";
import { buildOpportunityHref } from "@/endpoints/student/opportunity-query";
import type { OpportunityFilters, OpportunityRouteType } from "@/types/opportunities";
import { STUDENT_ORDERING_OPTIONS, STUDENT_STATUS_OPTIONS, STUDENT_WORK_MODE_OPTIONS } from "./constants";
import styles from "./OpportunitySidebarFilters.module.css";

interface Props { filters: OpportunityFilters; isPending: boolean; onNavigate: (href: string) => void; type: OpportunityRouteType }

export function OpportunitySidebarFilters({ filters, isPending, onNavigate, type }: Props) {
  const [draft, setDraft] = useState(filters);
  function apply(event: FormEvent<HTMLFormElement>) { event.preventDefault(); onNavigate(buildOpportunityHref(type, { ...draft, page: 1, industrySector: normalize(draft.industrySector), location: normalize(draft.location) })); }
  function reset() { const next = { ...filters, page: 1, workFlexibility: null, industrySector: null, location: null, status: "ACTIVE", ordering: "-created_at" }; setDraft(next); onNavigate(buildOpportunityHref(type, next)); }
  const advanced = Boolean(draft.workFlexibility || draft.industrySector || draft.location || draft.status !== "ACTIVE" || draft.ordering !== "-created_at");
  return (
    <section className={styles.panel} aria-labelledby="opportunity-filter-title">
      <header className={styles.header}><span className={styles.headerIcon} aria-hidden="true"><HugeIcon icon={FilterHorizontalIcon} size={15} /></span><div><h2 id="opportunity-filter-title">Filter results</h2><p>Refine the current opportunity feed.</p></div></header>
      <form className={styles.form} onSubmit={apply}><div className={styles.fields}>
        <SelectField icon={StatusIcon} label="Availability" name="status" onChange={(event) => setDraft((current) => ({ ...current, status: event.target.value }))} options={STUDENT_STATUS_OPTIONS} requirement="optional" value={draft.status} />
        <SelectField icon={Briefcase01Icon} label="Work mode" name="work_flexibility" onChange={(event) => setDraft((current) => ({ ...current, workFlexibility: event.target.value || null }))} options={STUDENT_WORK_MODE_OPTIONS} requirement="optional" value={draft.workFlexibility ?? ""} />
        <InputField icon={Briefcase01Icon} label="Industry sector" name="industry_sector" onChange={(event) => setDraft((current) => ({ ...current, industrySector: event.target.value }))} placeholder="Technology" requirement="optional" value={draft.industrySector ?? ""} />
        <InputField icon={Location01Icon} label="Location" name="location" onChange={(event) => setDraft((current) => ({ ...current, location: event.target.value }))} placeholder="Kigali" requirement="optional" value={draft.location ?? ""} />
        <SelectField icon={SortByDown02Icon} label="Sort results" name="ordering" onChange={(event) => setDraft((current) => ({ ...current, ordering: event.target.value }))} options={STUDENT_ORDERING_OPTIONS} requirement="optional" value={draft.ordering} />
      </div><footer className={styles.actions}><AuthButton className={styles.actionButton} disabled={!advanced} icon={Cancel01Icon} onClick={reset} type="button" variant="secondary">Reset</AuthButton><AuthButton className={styles.actionButton} icon={FilterHorizontalIcon} isLoading={isPending} loadingLabel="Applying filters" type="submit">Apply</AuthButton></footer></form>
    </section>
  );
}

function normalize(value: string | null) { return value?.trim() || null; }
