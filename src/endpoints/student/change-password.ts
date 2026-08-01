import { backendJson, type BackendResult } from "@/lib/api-client";
import type { StudentPasswordChangeResponse } from "@/types/student-profile";

export function changePassword(accessToken: string, currentPassword: string, newPassword: string, confirmPassword: string): Promise<BackendResult<StudentPasswordChangeResponse>> {
  return backendJson("/student/profile/password", { accessToken, body: { current_password: currentPassword, new_password: newPassword, confirm_password: confirmPassword }, method: "PATCH" });
}
