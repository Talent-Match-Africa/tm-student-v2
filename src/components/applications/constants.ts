import { Briefcase01Icon, GraduationCapIcon } from "@hugeicons/core-free-icons";

export const APPLICATION_TABS = [
  { description: "Track your job submissions.", href: "/applications/job-listings", icon: Briefcase01Icon, label: "Job applications", type: "job-listings" },
  { description: "Track your internship submissions.", href: "/applications/internships", icon: GraduationCapIcon, label: "Internship applications", type: "internships" },
] as const;

export const APPLICATION_STATUS_OPTIONS = [
  { label: "Any status", value: "" }, { label: "Applied", value: "APPLIED" },
  { label: "Under review", value: "UNDER_REVIEW" }, { label: "Shortlisted", value: "SHORTLISTED" },
  { label: "Rejected", value: "REJECTED" }, { label: "Hired", value: "HIRED" },
  { label: "Withdrawn", value: "WITHDRAWN" },
];
