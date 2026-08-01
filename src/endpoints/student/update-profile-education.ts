import { backendJson, type BackendResult } from "@/lib/api-client";
import type { StudentProfileMutationResponse } from "@/types/student-profile";

export function updateProfileEducation(accessToken: string, universityId: string, facultyId: string | null): Promise<BackendResult<StudentProfileMutationResponse>> {
  return backendJson("/student/profile/education", { accessToken, body: { university_id: universityId, faculty_id: facultyId }, method: "PATCH" });
}
