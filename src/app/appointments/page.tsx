import type { Metadata } from "next";
import { AppointmentsManagementTable } from "@/components/appointments/AppointmentsManagementTable";
import {
  parseAppointmentFilters,
  readAppointmentError,
} from "@/components/appointments/utils";
import { listAppointments } from "@/endpoints/student/list-appointments";
import { listCounselors } from "@/endpoints/student/list-counselors";
import { requireStudentSession } from "@/lib/student-session";

export const metadata: Metadata = {
  title: "Appointments | Talent Match Student",
  description: "Book and manage university career-guidance appointments.",
};

export default async function AppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const filters = parseAppointmentFilters(query);
  const initialCounselorId =
    typeof query.counselor === "string" ? query.counselor : undefined;
  const { accessToken } = await requireStudentSession("/appointments");
  const [appointmentsResult, counselorsResult] = await Promise.all([
    listAppointments(accessToken, filters),
    listCounselors(accessToken, 1, null),
  ]);
  return (
    <AppointmentsManagementTable
      counselors={counselorsResult.ok ? counselorsResult.payload.results : []}
      errorMessage={
        appointmentsResult.ok
          ? null
          : readAppointmentError(appointmentsResult.payload)
      }
      filters={filters}
      initialCounselorId={initialCounselorId}
      result={appointmentsResult.ok ? appointmentsResult.payload : null}
    />
  );
}
