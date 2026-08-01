import { requestEmailChange } from "@/endpoints/student/request-email-change";
import { createAuthenticatedBackendResponse } from "@/lib/student-api-route";

export async function POST(request: Request) {
  const body = (await request.json()) as { new_email?: string; current_password?: string };
  return createAuthenticatedBackendResponse((token) => requestEmailChange(token, body.new_email ?? "", body.current_password ?? ""));
}
