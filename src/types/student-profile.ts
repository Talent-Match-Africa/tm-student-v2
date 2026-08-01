import type { StudentProfile } from "./student-self-service";

export interface StudentProfileMutationResponse {
  status: "success";
  message: string;
  data: StudentProfile;
}

export interface StudentEmailChangeRequestResponse {
  status: "success";
  message: string;
  data: { new_email: string; expires_at: string };
}

export interface StudentPasswordChangeResponse {
  status: "success";
  message: string;
  data: { other_sessions_revoked: number };
}

export interface StudentUniversityOption {
  id: string;
  name: string;
  imageUrl: string | null;
}

export interface StudentFacultyOption {
  id: string;
  name: string;
}
