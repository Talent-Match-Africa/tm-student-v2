import { updateProfileEducation } from "@/endpoints/student/update-profile-education";
import { createAuthenticatedBackendResponse } from "@/lib/student-api-route";

export async function PATCH(request: Request) {
  const body = (await request.json()) as { university_id?: string; faculty_id?: string | null };
  return createAuthenticatedBackendResponse((token) => updateProfileEducation(token, body.university_id ?? "", body.faculty_id || null));
}
