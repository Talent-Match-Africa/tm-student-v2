export interface WorkHistoryEntry {
  organization: string;
  role: string;
  period: string;
  summary: string;
}

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
