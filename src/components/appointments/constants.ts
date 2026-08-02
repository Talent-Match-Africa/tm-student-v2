import type {
  AppointmentOrdering,
  AppointmentScheduleScope,
} from "./utils";

export const APPOINTMENT_STATUS_OPTIONS = [
  { label: "Any status", value: "" },
  { label: "Pending", value: "PENDING" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Cancelled", value: "CANCELLED" },
];

export const APPOINTMENT_SCOPE_OPTIONS: Array<{
  label: string;
  value: "" | AppointmentScheduleScope;
}> = [
  { label: "Any scheduled date", value: "" },
  { label: "Upcoming", value: "UPCOMING" },
  { label: "Past", value: "PAST" },
];

export const APPOINTMENT_ORDERING_OPTIONS: Array<{
  label: string;
  value: AppointmentOrdering;
}> = [
  { label: "Newest records", value: "-created_at" },
  { label: "Oldest records", value: "created_at" },
  { label: "Schedule: soonest", value: "date" },
  { label: "Schedule: latest", value: "-date" },
  { label: "Counselor A-Z", value: "counselor_name" },
  { label: "Status A-Z", value: "status" },
];
