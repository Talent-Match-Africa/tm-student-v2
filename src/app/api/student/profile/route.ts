import { updateProfile } from "@/endpoints/student/update-profile";
import { createAuthenticatedBackendResponse } from "@/lib/student-api-route";

export async function PATCH(request: Request) {
  const input = await request.formData();
  return createAuthenticatedBackendResponse((token) =>
    updateProfile(token, input),
  );
}
