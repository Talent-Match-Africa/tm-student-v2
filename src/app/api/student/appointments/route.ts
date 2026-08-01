import { createAppointment } from "@/endpoints/student/create-appointment";
import { createAuthenticatedBackendResponse } from "@/lib/student-api-route";

export async function POST(request: Request) {
  const input = (await request.json()) as {
    counselor_id: string;
    date: string;
    message: string;
    subject: string;
  };
  return createAuthenticatedBackendResponse((token) =>
    createAppointment(token, input),
  );
}
