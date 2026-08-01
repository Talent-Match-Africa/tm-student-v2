"use client";
import { useState, type FormEvent } from "react";
import { CalendarAdd01Icon, Cancel01Icon, FilterHorizontalIcon, StatusIcon } from "@hugeicons/core-free-icons";
import { AdminFilterShell } from "@/components/shared/AdminFilterShell";
import { AuthButton } from "@/components/shared/AuthButton";
import { SelectField } from "@/components/shared/SelectField";
import { SelectionCheckbox } from "@/components/shared/SelectionCheckbox";
import { APPOINTMENT_STATUS_OPTIONS } from "./constants";
import { buildAppointmentsHref, type AppointmentFilters } from "./utils";
import styles from "./AppointmentsManagementFilters.module.css";

export function AppointmentsManagementFilters({ filters, isPending, onBook, onNavigate }: { filters: AppointmentFilters; isPending: boolean; onBook: () => void; onNavigate: (href: string) => void }) {
  const [status, setStatus] = useState(filters.status ?? ""); const [upcoming, setUpcoming] = useState(filters.upcoming); const active = Boolean(filters.status || filters.upcoming);
  function apply(event?: FormEvent<HTMLFormElement>) { event?.preventDefault(); onNavigate(buildAppointmentsHref({ page: 1, status: status || null, upcoming })); }
  function reset() { setStatus(""); setUpcoming(false); onNavigate("/appointments"); }
  return <AdminFilterShell actions={<><AuthButton className={styles.utilityButton} icon={CalendarAdd01Icon} onClick={onBook} type="button" variant="secondary">Book</AuthButton><AuthButton className={styles.utilityButton} icon={FilterHorizontalIcon} isLoading={isPending} type="submit">Apply</AuthButton><AuthButton className={styles.utilityButton} disabled={!active} icon={Cancel01Icon} onClick={reset} type="button" variant="secondary">Reset</AuthButton></>} ariaLabel="Appointment filters" onSubmit={apply}><div className={styles.searchField}><SelectField icon={StatusIcon} label="Appointment status" name="status" onChange={(event) => setStatus(event.target.value)} options={APPOINTMENT_STATUS_OPTIONS} value={status} /></div><SelectionCheckbox checked={upcoming} description="Hide past sessions" label="Upcoming only" name="upcoming" onChange={setUpcoming} presentation="labeled" /></AdminFilterShell>;
}
