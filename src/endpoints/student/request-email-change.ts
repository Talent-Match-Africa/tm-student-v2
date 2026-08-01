import { backendJson, type BackendResult } from "@/lib/api-client";
import type { StudentEmailChangeRequestResponse } from "@/types/student-profile";

export function requestEmailChange(accessToken: string, newEmail: string, currentPassword: string): Promise<BackendResult<StudentEmailChangeRequestResponse>> {
  return backendJson("/student/profile/email-change", { accessToken, body: { new_email: newEmail, current_password: currentPassword }, method: "POST" });
}
