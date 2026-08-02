"use client";

import { useState, type FormEvent } from "react";
import {
  Calendar03Icon,
  Cancel01Icon,
  Clock03Icon,
  FilterHorizontalIcon,
  Search01Icon,
  SortByDown02Icon,
  StatusIcon,
} from "@hugeicons/core-free-icons";
import { AdminFilterShell } from "@/components/shared/AdminFilterShell";
import { AuthButton } from "@/components/shared/AuthButton";
import { HugeIcon } from "@/components/shared/HugeIcon";
import { InputField } from "@/components/shared/InputField";
import { SelectField } from "@/components/shared/SelectField";
import { useLiveSearch } from "@/lib/use-live-search";
import {
  APPOINTMENT_ORDERING_OPTIONS,
  APPOINTMENT_SCOPE_OPTIONS,
  APPOINTMENT_STATUS_OPTIONS,
} from "./constants";
import {
  buildAppointmentsHref,
  hasAppointmentFilters,
  type AppointmentFilters,
  type AppointmentOrdering,
  type AppointmentScheduleScope,
} from "./utils";
import styles from "./AppointmentsManagementFilters.module.css";

interface AppointmentsManagementFiltersProps {
  filters: AppointmentFilters;
  isPending: boolean;
  onNavigate: (href: string) => void;
}

export function AppointmentsManagementFilters({
  filters,
  isPending,
  onNavigate,
}: AppointmentsManagementFiltersProps) {
  const [search, setSearch] = useState(filters.search ?? "");
  const [dateFrom, setDateFrom] = useState(filters.dateFrom ?? "");
  const [dateTo, setDateTo] = useState(filters.dateTo ?? "");
  const [status, setStatus] = useState(filters.status ?? "");
  const [scheduleScope, setScheduleScope] = useState(
    filters.scheduleScope ?? "",
  );
  const [ordering, setOrdering] = useState<AppointmentOrdering>(
    filters.ordering,
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  useLiveSearch({
    appliedValue: filters.search,
    onSearch: (value) =>
      onNavigate(buildAppointmentsHref({ ...filters, page: 1, search: value })),
    value: search,
  });

  function applyFilters() {
    let from = validDate(dateFrom);
    let to = validDate(dateTo);
    if (from && to && from > to) [from, to] = [to, from];
    setDialogOpen(false);
    onNavigate(
      buildAppointmentsHref({
        ...filters,
        dateFrom: from,
        dateTo: to,
        ordering,
        page: 1,
        scheduleScope: scheduleScope
          ? (scheduleScope as AppointmentScheduleScope)
          : null,
        search: search.trim().length >= 3 ? search.trim() : null,
        status: status || null,
      }),
    );
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    applyFilters();
  }

  function reset() {
    setSearch("");
    setDateFrom("");
    setDateTo("");
    setStatus("");
    setScheduleScope("");
    setOrdering("-created_at");
    setDialogOpen(false);
    onNavigate("/appointments");
  }

  return (
    <AdminFilterShell
      actionCount={3}
      actions={
        <>
          <AuthButton
            className={styles.utilityButton}
            icon={FilterHorizontalIcon}
            onClick={() => setDialogOpen(true)}
            type="button"
            variant="secondary"
          >
            Filter
          </AuthButton>
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
            disabled={!hasAppointmentFilters(filters)}
            icon={Cancel01Icon}
            onClick={reset}
            type="button"
            variant="secondary"
          >
            Reset
          </AuthButton>
        </>
      }
      ariaLabel="Appointment filters"
      dateControls={
        <>
          <div className={styles.dateField}>
            <InputField
              icon={Calendar03Icon}
              label="From date"
              name="date_from"
              onChange={(event) => setDateFrom(event.target.value)}
              type="date"
              value={dateFrom}
            />
          </div>
          <div className={styles.dateField}>
            <InputField
              icon={Calendar03Icon}
              label="To date"
              name="date_to"
              onChange={(event) => setDateTo(event.target.value)}
              type="date"
              value={dateTo}
            />
          </div>
        </>
      }
      dialog={
        dialogOpen ? (
          <div className={styles.backdrop} role="presentation">
            <section
              aria-labelledby="appointment-filter-title"
              aria-modal="true"
              className={styles.dialog}
              role="dialog"
            >
              <header className={styles.dialogHeader}>
                <div>
                  <span aria-hidden="true">
                    <HugeIcon icon={FilterHorizontalIcon} size={20} />
                  </span>
                  <div>
                    <h2 id="appointment-filter-title">Refine appointments</h2>
                    <p>Narrow your appointments by lifecycle and schedule.</p>
                  </div>
                </div>
                <button
                  aria-label="Close appointment filters"
                  onClick={() => setDialogOpen(false)}
                  title="Close"
                  type="button"
                >
                  <HugeIcon icon={Cancel01Icon} size={16} />
                </button>
              </header>

              <div className={styles.dialogGrid}>
                <SelectField
                  icon={StatusIcon}
                  label="Appointment status"
                  name="status"
                  onChange={(event) => setStatus(event.target.value)}
                  options={APPOINTMENT_STATUS_OPTIONS}
                  value={status}
                />
                <SelectField
                  icon={Clock03Icon}
                  label="Schedule"
                  name="schedule_scope"
                  onChange={(event) => setScheduleScope(event.target.value)}
                  options={APPOINTMENT_SCOPE_OPTIONS}
                  value={scheduleScope}
                />
                <SelectField
                  icon={SortByDown02Icon}
                  label="Sort by"
                  name="ordering"
                  onChange={(event) =>
                    setOrdering(event.target.value as AppointmentOrdering)
                  }
                  options={APPOINTMENT_ORDERING_OPTIONS}
                  value={ordering}
                />
              </div>

              <footer className={styles.dialogActions}>
                <AuthButton
                  icon={Cancel01Icon}
                  onClick={reset}
                  type="button"
                  variant="secondary"
                >
                  Reset
                </AuthButton>
                <AuthButton
                  icon={FilterHorizontalIcon}
                  onClick={applyFilters}
                  type="button"
                >
                  Apply filters
                </AuthButton>
              </footer>
            </section>
          </div>
        ) : null
      }
      onSubmit={submit}
    >
      <div className={styles.searchField}>
        <InputField
          autoComplete="off"
          icon={Search01Icon}
          label="Search appointments"
          name="search"
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Subject, message, or counselor"
          type="search"
          value={search}
        />
      </div>
    </AdminFilterShell>
  );
}

function validDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : null;
}
