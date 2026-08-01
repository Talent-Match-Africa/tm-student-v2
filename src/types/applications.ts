import type { PageResponse, StudentApplication } from "./student-self-service";

export interface WorkHistoryEntry {
  organization: string;
  role: string;
  period: string;
  summary: string;
}

export type ApplicationRouteType = "job-listings" | "internships";

export interface ApplicationFilters {
  page: number;
  search: string | null;
  status: string | null;
}

export type ApplicationListResponse = PageResponse<StudentApplication>;

export interface ApplicationSubmissionResponse {
  status: "success";
  message: string;
  data: {
    id: string;
    type: "JOB" | "INTERNSHIP";
    status: string;
    created_at: string;
  };
}
