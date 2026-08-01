"use client";

import { useState, type FormEvent } from "react";
import {
  Calendar03Icon,
  Cancel01Icon,
  FilterHorizontalIcon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { AdminFilterShell } from "@/components/shared/AdminFilterShell";
import { AuthButton } from "@/components/shared/AuthButton";
import { InputField } from "@/components/shared/InputField";
import { buildOpportunityHref } from "@/endpoints/student/opportunity-query";
import type {
  OpportunityFilters as FilterValues,
  OpportunityRouteType,
} from "@/types/opportunities";
import styles from "./OpportunityFilters.module.css";

interface OpportunityFiltersProps {
  filters: FilterValues;
  isPending: boolean;
  onNavigate: (href: string) => void;
  type: OpportunityRouteType;
}

export function OpportunityFilters({
  filters,
  isPending,
  onNavigate,
  type,
}: OpportunityFiltersProps) {
  const [search, setSearch] = useState(filters.search ?? "");
  const [createdFrom, setCreatedFrom] = useState(filters.createdFrom ?? "");
  const [createdTo, setCreatedTo] = useState(filters.createdTo ?? "");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    let from = createdFrom || null;
    let to = createdTo || null;
    if (from && to && from > to) [from, to] = [to, from];
    const value = search.trim();
    onNavigate(
      buildOpportunityHref(type, {
        ...filters,
        createdFrom: from,
        createdTo: to,
        page: 1,
        search: value.length >= 3 ? value : null,
      }),
    );
  }

  function reset() {
    setSearch("");
    setCreatedFrom("");
    setCreatedTo("");
    onNavigate(`/opportunities/${type}`);
  }

  const hasFilters = Boolean(
    filters.search ||
    filters.createdFrom ||
    filters.createdTo ||
    filters.status !== "ACTIVE" ||
    filters.workFlexibility ||
    filters.industrySector ||
    filters.location ||
    filters.ordering !== "-created_at",
  );

  return (
    <AdminFilterShell
      actionCount={2}
      actions={
        <>
          <AuthButton
            className={styles.utilityButton}
            icon={FilterHorizontalIcon}
            isLoading={isPending}
            type="submit"
          >
            Apply
          </AuthButton>
          <AuthButton
            className={styles.utilityButton}
            disabled={!hasFilters}
            icon={Cancel01Icon}
            onClick={reset}
            variant="secondary"
          >
            Reset
          </AuthButton>
        </>
      }
      ariaLabel="Opportunity filters"
      dateControls={
        <>
          <div className={styles.dateField}>
            <InputField
              icon={Calendar03Icon}
              label="From date"
              name="created_from"
              onChange={(event) => setCreatedFrom(event.target.value)}
              type="date"
              value={createdFrom}
            />
          </div>
          <div className={styles.dateField}>
            <InputField
              icon={Calendar03Icon}
              label="To date"
              name="created_to"
              onChange={(event) => setCreatedTo(event.target.value)}
              type="date"
              value={createdTo}
            />
          </div>
        </>
      }
      onSubmit={submit}
    >
      <div className={styles.searchField}>
        <InputField
          autoComplete="off"
          icon={Search01Icon}
          label={
            type === "job-listings"
              ? "Search job listings"
              : "Search internships"
          }
          name="search"
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Type at least 3 characters"
          type="search"
          value={search}
        />
      </div>
    </AdminFilterShell>
  );
}
