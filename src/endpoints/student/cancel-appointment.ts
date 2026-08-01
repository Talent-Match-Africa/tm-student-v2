import { backendJson, type BackendResult } from "@/lib/api-client";
import type { Appointment } from "@/types/student-self-service";

export function cancelAppointment(
  accessToken: string,
  appointmentId: string,
): Promise<BackendResult<Appointment>> {
  return backendJson(`/student/appointments/${appointmentId}/cancel`, {
    accessToken,
    method: "PATCH",
  });
}
