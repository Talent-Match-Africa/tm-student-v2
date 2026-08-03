"use client";

import { useCallback, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar03Icon,
  CalendarAdd01Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";
import { AuthButton } from "@/components/shared/AuthButton";
import { EmptyState } from "@/components/shared/EmptyState";
import { Pagination } from "@/components/shared/Pagination";
import type {
  Appointment,
  Counselor,
  PageResponse,
} from "@/types/student-self-service";
import { AppointmentBookingDialog } from "./AppointmentBookingDialog";
import { AppointmentManagementRow } from "./AppointmentManagementRow";
import { AppointmentsManagementFilters } from "./AppointmentsManagementFilters";
import {
  buildAppointmentsHref,
  hasAppointmentFilters,
  type AppointmentFilters,
} from "./utils";
import styles from "./AppointmentsManagementTable.module.css";

interface AppointmentsManagementTableProps {
  counselors: Counselor[];
  errorMessage: string | null;
  filters: AppointmentFilters;
  initialCounselorId?: string;
  result: PageResponse<Appointment> | null;
}

export function AppointmentsManagementTable({
  counselors,
  errorMessage,
  filters,
  initialCounselorId,
  result,
}: AppointmentsManagementTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [bookingOpen, setBookingOpen] = useState(Boolean(initialCounselorId));
  const count = result?.count ?? 0;
  const totalPages = result?.total_pages ?? 0;
  const navigate = useCallback(
    (href: string) => startTransition(() => router.push(href)),
    [router],
  );

  return (
    <div className={styles.workspace} aria-busy={isPending}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Guidance calendar</p>
          <h1>Appointments</h1>
          <p className={styles.description}>
            Book and manage confidential career-guidance sessions with
            counselors from your university.
          </p>
        </div>
        <div className={styles.headerActions}>
          <div
            className={styles.resultBadge}
            aria-label="Appointment result count"
          >
            <strong>{count.toLocaleString()}</strong>
            <span>appointments</span>
          </div>
          <AuthButton
            className={styles.bookButton}
            icon={CalendarAdd01Icon}
            onClick={() => setBookingOpen(true)}
            type="button"
          >
            Book appointment
          </AuthButton>
        </div>
      </header>

      {errorMessage ? (
        <div className={styles.alert} role="alert">
          {errorMessage}
        </div>
      ) : null}

      <AppointmentsManagementFilters
        filters={filters}
        isPending={isPending}
        onNavigate={navigate}
      />

      <section className={styles.tablePanel}>
        <div className={styles.tableHeader}>
          <strong>{count.toLocaleString()} appointments</strong>
          <span>
            Page {result?.page ?? filters.page} of {Math.max(1, totalPages)} |{" "}
            {result?.page_size ?? 20} rows per page
          </span>
        </div>
        <div className={styles.scroller}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Appointment</th>
                <th>Student</th>
                <th>Counselor</th>
                <th>University</th>
                <th>Schedule</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {result?.results.length ? (
                result.results.map((appointment) => (
                  <AppointmentManagementRow
                    appointment={appointment}
                    key={appointment.id}
                  />
                ))
              ) : (
                <tr>
                  <td className={styles.emptyCell} colSpan={7}>
                    <EmptyState
                      actions={[
                        {
                          icon: Calendar03Icon,
                          label: "Book appointment",
                          onClick: () => setBookingOpen(true),
                          variant: "primary",
                        },
                        ...(hasAppointmentFilters(filters)
                          ? [
                              {
                                icon: Cancel01Icon,
                                label: "Reset filters",
                                onClick: () => navigate("/appointments"),
                                variant: "secondary" as const,
                              },
                            ]
                          : []),
                      ]}
                      icon={Calendar03Icon}
                      message={
                        errorMessage
                          ? "The appointment directory is unavailable right now. Reload the page to try again."
                          : "No appointments match the current search and filters."
                      }
                      title={
                        errorMessage
                          ? "Appointments could not be loaded"
                          : "No appointments found"
                      }
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <Pagination
        currentPage={result?.page ?? filters.page}
        getPageHref={(page) => buildAppointmentsHref({ ...filters, page })}
        label="Appointments pagination"
        totalPages={totalPages}
      />

      <AppointmentBookingDialog
        counselors={counselors}
        initialCounselorId={initialCounselorId}
        onClose={() => setBookingOpen(false)}
        open={bookingOpen}
      />
    </div>
  );
}
