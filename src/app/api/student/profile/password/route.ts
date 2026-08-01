import { changePassword } from "@/endpoints/student/change-password";
import { createAuthenticatedBackendResponse } from "@/lib/student-api-route";

export async function PATCH(request: Request) {
  const body = (await request.json()) as { current_password?: string; new_password?: string; confirm_password?: string };
  return createAuthenticatedBackendResponse((token) => changePassword(token, body.current_password ?? "", body.new_password ?? "", body.confirm_password ?? ""));
}
