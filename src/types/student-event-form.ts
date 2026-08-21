export interface StudentEventForm {
  attend: boolean;
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
