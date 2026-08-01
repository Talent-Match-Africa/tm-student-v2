export type AdminUniversityOrdering =
  | "created_at"
  | "-created_at"
  | "school_name"
  | "-school_name"
  | "email"
  | "-email"
  | "student_count"
  | "-student_count"
  | "faculty_count"
  | "-faculty_count";

export type UniversityScopedStudentOrdering =
  | "created_at"
  | "-created_at"
  | "firstname"
  | "-firstname"
  | "lastname"
  | "-lastname"
  | "graduation_year"
  | "-graduation_year";

export type UniversityScopedOpportunityOrdering =
  | "created_at"
  | "-created_at"
  | "apply_start"
  | "-apply_start"
  | "application_deadline"
  | "-application_deadline"
  | "title"
  | "-title";

export type UniversityAuditOrdering = "created_at" | "-created_at";

export type UniversityDetailTab =
  | "overview"
  | "facilities"
  | "students"
  | "pending-students"
  | "job-listings"
  | "internships"
  | "audit-logs";

export interface UniversityListFilters {
  createdFrom?: string | null;
  createdTo?: string | null;
  isActive?: boolean | null;
  ordering?: AdminUniversityOrdering;
  page?: number;
  pageSize?: number;
  schoolCode?: string | null;
  schoolName?: string | null;
  search?: string | null;
}

export interface UniversityScopedStudentsFilters {
  createdFrom?: string | null;
  createdTo?: string | null;
  facultyId?: string | null;
  gender?: string | null;
  graduationYear?: number | null;
  ordering?: UniversityScopedStudentOrdering;
  page?: number;
  pageSize?: number;
  search?: string | null;
}

export interface UniversityScopedOpportunitiesFilters {
  isOpen?: boolean | null;
  ordering?: UniversityScopedOpportunityOrdering;
  page?: number;
  pageSize?: number;
  search?: string | null;
}

export interface UniversityAuditLogsFilters {
  action?: string | null;
  ordering?: UniversityAuditOrdering;
  page?: number;
  pageSize?: number;
  severity?: string | null;
}

export interface UniversityListItem {
  id: string;
  user_id: string | null;
  school_name: string | null;
  school_code: string | null;
  email: string | null;
  phone_number: string | null;
  website: string | null;
  is_active: boolean | null;
  image: string | null;
  faculty_count: number;
  student_count: number;
  job_listing_count: number;
  internship_count: number;
  created_at: string | null;
}

export interface UniversitySelectOption {
  value: string;
  name: string;
  email: string | null;
  imageUrl: string | null;
  isActive: boolean | null;
}

export interface PaginatedResponse<T> {
  status?: "success";
  count: number;
  next: number | string | null;
  previous: number | string | null;
  page?: number;
  page_size?: number;
  results: T[];
}

export interface UniversityFacultyInput {
  faculty_name: string;
  faculty_code: string | null;
}

export interface UniversityFacultiesCreateInput {
  faculties: UniversityFacultyInput[];
}

export interface UniversityFacultyMutationResponse {
  status: "success";
  message: string;
  data: UniversityFaculty | UniversityFaculty[];
}

export interface UniversityCreateInput {
  email: string;
  faculties: UniversityFacultyInput[];
  image?: string | null;
  phone_number: string;
  school_code?: string | null;
  school_name: string;
  website: string | null;
}

export interface UniversityUpdateInput {
  email?: string;
  faculties?: UniversityFacultyInput[];
  image?: string | null;
  phone_number?: string;
  school_name?: string;
  website?: string | null;
}

export interface UniversityMutationResponse {
  status: "success";
  message: string;
  data: unknown;
}

export interface UniversityDeleteResponse extends UniversityMutationResponse {
  data: {
    id: string;
    user_id: string | null;
    school_name: string | null;
  };
}

export interface UniversityDeleteInput {
  force?: boolean;
}

export interface UniversityToggleActiveResponse extends UniversityMutationResponse {
  data: {
    id: string;
    user_id: string | null;
    school_name: string | null;
    is_active: boolean;
  };
}

export interface UniversityMigrateStudentsInput {
  source_university_id: string | null;
  target_university_id: string;
  student_ids: string[];
}

export interface UniversityMigrateStudentsResponse extends UniversityMutationResponse {
  data: {
    source_university: {
      id: string;
      school_name: string | null;
    };
    target_university: {
      id: string;
      school_name: string | null;
    };
    migrated_student_count: number;
    migrated_pending_student_count: number;
  };
}

export interface UniversityOverviewResponse {
  status: "success";
  data: UniversityOverview;
}

export interface UniversityOverview {
  id: string;
  user_id: string | null;
  school_name: string | null;
  school_code: string | null;
  email: string | null;
  phone_number: string | null;
  website: string | null;
  campus_name: string | null;
  image: string | null;
  is_active: boolean | null;
  created_at: string | null;
  user: {
    id: string;
    email: string | null;
    username: string | null;
    phone_number: string | null;
    role: string;
    is_active: boolean;
    image: string | null;
    last_login: string | null;
    created_at: string | null;
  } | null;
  overview: {
    audit_log_count: number;
    campus_count: number;
    counselor_count: number;
    faculty_count: number;
    internship_count: number;
    job_listing_count: number;
    pending_student_count: number;
    resource_count: number;
    student_count: number;
    university_application_count: number;
  };
  facilities: {
    faculties: UniversityFaculty[];
  };
}

export interface UniversityFaculty {
  id: string;
  faculty_name: string | null;
  faculty_code: string | null;
  student_count: number;
  created_at: string | null;
}

export interface UniversityStudent {
  id: string;
  user_id: string;
  firstname: string;
  lastname: string;
  full_name: string;
  email: string;
  phone_number: string;
  gender: string | null;
  image: string | null;
  is_active: boolean | null;
  faculty_name: string | null;
  created_at: string | null;
}

export interface UniversityOpportunity {
  id: string;
  title: string | null;
  description: string | null;
  work_flexibility: string | null;
  industry_sector: string | null;
  location: string | null;
  province: string | null;
  district: string | null;
  salary: string | null;
  apply_start: string | null;
  application_deadline?: string | null;
  application_end?: string | null;
  created_at: string | null;
  updated_at?: string | null;
  everyone: boolean | null;
  application_count: number;
  is_open: boolean;
  owner_id: string | null;
  owner_name: string | null;
  owner_type: string | null;
  owner_image: string | null;
}

export interface UniversityAuditLog {
  id: string;
  actor_id: string | null;
  actor_email: string | null;
  actor_role: string | null;
  action: string;
  severity: string;
  resource_type: string | null;
  resource_id: string | null;
  description: string;
  method: string | null;
  path: string;
  status_code: number | null;
  response_time_ms: number | null;
  extra: unknown;
  created_at: string | null;
}
