import { updateProfile } from "@/endpoints/student/update-profile";
import { createAuthenticatedBackendResponse } from "@/lib/student-api-route";

export async function PATCH(request: Request) {
  const input = (await request.json()) as Record<string, unknown>;
  return createAuthenticatedBackendResponse((token) =>
    updateProfile(token, input),
  );
}
