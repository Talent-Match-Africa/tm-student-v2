import {
  Mail01Icon,
  File01Icon,
  SecurityCheckIcon,
  UniversityIcon,
  UserEdit01Icon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";

export interface StudentProfileStepDefinition {
  description: string;
  icon: IconSvgElement;
  key: "identity" | "education" | "email" | "security" | "documents";
  label: string;
}

export const STUDENT_PROFILE_STEPS: StudentProfileStepDefinition[] = [
  { key: "identity", label: "Profile", description: "Identity, username, phone, and image", icon: UserEdit01Icon },
  { key: "education", label: "Education", description: "University and faculty assignment", icon: UniversityIcon },
  { key: "email", label: "Email", description: "Verified account email change", icon: Mail01Icon },
  { key: "security", label: "Security", description: "Password and active sessions", icon: SecurityCheckIcon },
  { key: "documents", label: "Documents", description: "Private application files", icon: File01Icon },
];
