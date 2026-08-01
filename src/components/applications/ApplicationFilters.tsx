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
import { buildApplicationsHref } from "@/endpoints/student/application-query";
import { useLiveSearch } from "@/lib/use-live-search";
import type {
  ApplicationFilters as FilterValues,
  ApplicationRouteType,
} from "@/types/applications";
import styles from "./ApplicationFilters.module.css";

interface ApplicationFiltersProps {
  filters: FilterValues;
  isPending: boolean;
  onNavigate: (href: string) => void;
  type: ApplicationRouteType;
}

export function ApplicationFilters({
  filters,
  isPending,
  onNavigate,
  type,
}: ApplicationFiltersProps) {
  const [search, setSearch] = useState(filters.search ?? "");
  const [appliedFrom, setAppliedFrom] = useState(filters.appliedFrom ?? "");
  const [appliedTo, setAppliedTo] = useState(filters.appliedTo ?? "");

  useLiveSearch({
    appliedValue: filters.search,
    onSearch: (value) =>
      onNavigate(
        buildApplicationsHref(type, { ...filters, page: 1, search: value }),
      ),
    value: search,
  });

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    let from = appliedFrom || null;
    let to = appliedTo || null;
    if (from && to && from > to) [from, to] = [to, from];
    const value = search.trim();
    onNavigate(
      buildApplicationsHref(type, {
        ...filters,
        appliedFrom: from,
        appliedTo: to,
        page: 1,
        search: value.length >= 3 ? value : null,
      }),
    );
  }

  function reset() {
    setSearch("");
    setAppliedFrom("");
    setAppliedTo("");
    onNavigate(`/applications/${type}`);
  }

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
            disabled={
              !filters.search &&
              !filters.status &&
              !filters.appliedFrom &&
              !filters.appliedTo
            }
            icon={Cancel01Icon}
            onClick={reset}
            variant="secondary"
          >
            Reset
          </AuthButton>
        </>
      }
      ariaLabel="Application filters"
      dateControls={
        <>
          <div className={styles.dateField}>
            <InputField
              icon={Calendar03Icon}
              label="From date"
              name="applied_from"
              onChange={(event) => setAppliedFrom(event.target.value)}
              type="date"
              value={appliedFrom}
            />
          </div>
          <div className={styles.dateField}>
            <InputField
              icon={Calendar03Icon}
              label="To date"
              name="applied_to"
              onChange={(event) => setAppliedTo(event.target.value)}
              type="date"
              value={appliedTo}
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
          label="Search applications"
          name="search"
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Opportunity or owner"
          type="search"
          value={search}
        />
      </div>
    </AdminFilterShell>
  );
}
