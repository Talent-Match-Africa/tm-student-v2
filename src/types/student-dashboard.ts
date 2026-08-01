export interface DashboardAppointment {
  id: string;
  date: string;
  subject: string;
  status: string;
  counselor: {
    id: string | null;
    name: string | null;
    email: string | null;
  };
}

export interface DashboardResource {
  id: string;
  name: string;
  type: string;
  description: string | null;
  publishedAt: string | null;
}

export interface StudentDashboardResponse {
  status: "success";
  data: {
    applications_by_status: Record<string, number>;
    upcoming_appointments: DashboardAppointment[];
    new_opportunities: {
      jobs: number;
      internships: number;
    };
    recent_resources: DashboardResource[];
    completion: {
      profile_percent: number;
      has_document: boolean;
    };
  };
}
