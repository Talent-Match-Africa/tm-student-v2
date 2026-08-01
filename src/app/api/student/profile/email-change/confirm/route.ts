import { confirmEmailChange } from "@/endpoints/student/confirm-email-change";
import { createAuthenticatedBackendResponse } from "@/lib/student-api-route";

export async function POST(request: Request) {
  const body = (await request.json()) as { token?: string };
  return createAuthenticatedBackendResponse((accessToken) => confirmEmailChange(accessToken, body.token?.trim() ?? ""));
}
