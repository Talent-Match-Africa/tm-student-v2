import { cancelAppointment } from "@/endpoints/student/cancel-appointment";
import { createAuthenticatedBackendResponse } from "@/lib/student-api-route";

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ appointmentId: string }> },
) {
  const { appointmentId } = await params;
  return createAuthenticatedBackendResponse((token) =>
    cancelAppointment(token, appointmentId),
  );
}
