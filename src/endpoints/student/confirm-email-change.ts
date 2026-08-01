import { backendJson, type BackendResult } from "@/lib/api-client";
import type { StudentProfileMutationResponse } from "@/types/student-profile";

export function confirmEmailChange(accessToken: string, token: string): Promise<BackendResult<StudentProfileMutationResponse>> {
  return backendJson("/student/profile/email-change/confirm", { accessToken, body: { token }, method: "POST" });
}
