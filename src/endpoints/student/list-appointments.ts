import { buildAppointmentsQuery, type AppointmentFilters } from "@/components/appointments/utils";
import { backendJson, type BackendResult } from "@/lib/api-client";
import type { Appointment, PageResponse } from "@/types/student-self-service";

export function listAppointments(
  token: string,
  filters: AppointmentFilters,
): Promise<BackendResult<PageResponse<Appointment>>> {
  return backendJson(
    `/student/appointments?${buildAppointmentsQuery(filters)}`,
    { accessToken: token, method: "GET" },
  );
}
