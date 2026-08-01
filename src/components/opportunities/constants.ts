import { Briefcase01Icon, GraduationCapIcon } from "@hugeicons/core-free-icons";

export const OPPORTUNITY_TABS = [
  { type: "job-listings" as const, href: "/opportunities/job-listings", label: "Job listings", description: "Roles open to students and graduates", icon: Briefcase01Icon },
  { type: "internships" as const, href: "/opportunities/internships", label: "Internships", description: "Practical learning opportunities", icon: GraduationCapIcon },
];

export const STUDENT_STATUS_OPTIONS = [
  { label: "Available opportunities", value: "ACTIVE" },
  { label: "Open now", value: "OPEN" },
  { label: "Opening soon", value: "UPCOMING" },
  { label: "Closed", value: "CLOSED" },
  { label: "All opportunities", value: "ALL" },
];

export const STUDENT_WORK_MODE_OPTIONS = [
  { label: "All work modes", value: "" },
  { label: "Remote", value: "REMOTE" },
  { label: "Hybrid", value: "HYBRID" },
  { label: "On site", value: "ONSITE" },
];

export const STUDENT_ORDERING_OPTIONS = [
  { label: "Newest first", value: "-created_at" },
  { label: "Oldest first", value: "created_at" },
  { label: "Deadline", value: "deadline" },
  { label: "Title", value: "title" },
];
