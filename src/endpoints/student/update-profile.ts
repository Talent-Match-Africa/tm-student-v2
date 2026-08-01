import { backendFormData, type BackendResult } from "@/lib/api-client";
import type { StudentProfileMutationResponse } from "@/types/student-profile";

export function updateProfile(
  accessToken: string,
  input: FormData,
): Promise<BackendResult<StudentProfileMutationResponse>> {
  return backendFormData("/student/profile", input, accessToken, "PATCH");
}
