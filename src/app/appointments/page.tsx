import { AppointmentBookingForm } from "@/components/appointments/AppointmentBookingForm";
import { CancelAppointmentButton } from "@/components/appointments/CancelAppointmentButton";
import { Pagination } from "@/components/shared/Pagination";
import styles from "@/components/shared/SelfService.module.css";
import { listAppointments } from "@/endpoints/student/list-appointments";
import { listCounselors } from "@/endpoints/student/list-counselors";
import { requireStudentSession } from "@/lib/student-session";

export default async function AppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ counselor?: string; page?: string; status?: string }>;
}) {
  const query = await searchParams;
  const page = Math.max(1, Number(query.page) || 1);
  const { accessToken } = await requireStudentSession("/appointments");
  const [appointmentsResult, counselorsResult] = await Promise.all([
    listAppointments(accessToken, page, query.status ?? null, false),
    listCounselors(accessToken, 1, null),
  ]);
  const appointments = appointmentsResult.ok
    ? appointmentsResult.payload
    : null;
  const counselors = counselorsResult.ok
    ? counselorsResult.payload.results
    : [];

  return (
    <section className={styles.workspace}>
      <header className={styles.header}>
        <div>
          <p>Guidance calendar</p>
          <h2>Appointments</h2>
          <span>Book and manage confidential career-guidance sessions.</span>
        </div>
        <span className={styles.badge}>
          {appointments?.count ?? 0} sessions
        </span>
      </header>
      <div className={styles.details}>
        <div className={styles.workspace}>
          <form className={styles.filters}>
            <label>
              <span>Status</span>
              <select defaultValue={query.status ?? ""} name="status">
                <option value="">All statuses</option>
                <option>PENDING</option>
                <option>CONFIRMED</option>
                <option>COMPLETED</option>
                <option>CANCELLED</option>
              </select>
            </label>
            <button type="submit">Apply</button>
          </form>
          {appointments?.results.length ? (
            appointments.results.map((appointment) => (
              <article className={styles.card} key={appointment.id}>
                <span>{appointment.university.name ?? "Career guidance"}</span>
                <h3>{appointment.subject}</h3>
                <p>{appointment.message}</p>
                <div className={styles.meta}>
                  <span>
                    {new Date(appointment.date).toLocaleString("en-RW")}
                  </span>
                  <span
                    className={styles.status}
                    data-status={appointment.status}
                  >
                    {appointment.status}
                  </span>
                </div>
                <footer>
                  <span>{appointment.counselor.name ?? "Counselor"}</span>
                  {appointment.status !== "CANCELLED" &&
                  appointment.status !== "COMPLETED" ? (
                    <CancelAppointmentButton appointmentId={appointment.id} />
                  ) : null}
                </footer>
              </article>
            ))
          ) : (
            <div className={styles.empty}>
              You have no appointments in this view.
            </div>
          )}
          {appointments ? (
            <Pagination
              currentPage={appointments.page}
              totalPages={appointments.total_pages}
              getPageHref={(nextPage) =>
                `/appointments?page=${nextPage}${query.status ? `&status=${query.status}` : ""}`
              }
            />
          ) : null}
        </div>
        <aside className={styles.panel}>
          <span>New session</span>
          <h3>Book a counselor</h3>
          <AppointmentBookingForm
            counselors={counselors}
            initialCounselorId={query.counselor}
          />
        </aside>
      </div>
    </section>
  );
}
