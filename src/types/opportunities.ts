export type OpportunityRouteType = "job-listings" | "internships";
export type OpportunityApiType = "jobs" | "internships";

export interface OpportunityRecord {
  id: string;
  type: "JOB" | "INTERNSHIP";
  title: string | null;
  description: string | null;
  requirements: string | null;
  experience: string | null;
  work_flexibility: string | null;
  industry_sector: string | null;
  salary: string | null;
  facilitation: boolean | null;
  location: string | null;
  address: {
    province: string | null;
    district: string | null;
    sector: string | null;
    cell: string | null;
    village: string | null;
  };
  apply_start: string | null;
  deadline: string | null;
  document_url: string | null;
  is_open: boolean;
  /** True when this student already has an application on record. */
  has_applied: boolean;
  status: "OPEN" | "UPCOMING" | "CLOSED";
  posted_by: {
    id: string | null;
    name: string;
    role: string | null;
    image_url: string | null;
  };
  responsibilities: string[];
  qualifications: string[];
  created_at: string | null;
  updated_at: string;
}

export interface OpportunityListResponse {
  status: "success";
  count: number;
  page: number;
  page_size: number;
  total_pages: number;
  next: number | null;
  previous: number | null;
  results: OpportunityRecord[];
}

export interface OpportunityDetailResponse {
  status: "success";
  data: OpportunityRecord;
}

export interface OpportunityFilters {
  createdFrom: string | null;
  createdTo: string | null;
  page: number;
  search: string | null;
  workFlexibility: string | null;
  industrySector: string | null;
  location: string | null;
  status: string;
  ordering: string;
}
