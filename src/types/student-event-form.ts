export interface StudentEventForm {
  attend: boolean;
  created_at: string;
  employed: boolean;
  student_id: string;
  which_cohort: string;
  working_place: string;
}

export interface StudentEventFormResponse {
  data: StudentEventForm | null;
  status: "success";
}

export interface StudentEventFormMutationResponse {
  data: StudentEventForm;
  message: string;
  status: "success";
}
