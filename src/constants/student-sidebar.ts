import type { IconSvgElement } from "@hugeicons/react";

import {
  Archive01Icon,
  Briefcase01Icon,
  Calendar03Icon,
  File01Icon,
  Home01Icon,
  OlympicTorchIcon,
  StudentIcon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";

export interface StudentSidebarLink {
  label: string;
  href: string;
  icon: IconSvgElement;
  exact?: boolean;

  badge?: {
    label: string;
    expiresAt: string;
  };
}

export const STUDENT_SIDEBAR_LINKS: StudentSidebarLink[] = [
  {
    label: "Dashboard",
    icon: Home01Icon,
    href: "/dashboard",
    exact: true,
  },

  {
    label: "Opportunities",
    icon: Briefcase01Icon,
    href: "/opportunities",
  },

  {
    label: "My Applications",
    icon: File01Icon,
    href: "/applications",
  },

  {
    label: "Counselors",
    icon: UserGroupIcon,
    href: "/counselors",
  },

  {
    label: "Appointments",
    icon: Calendar03Icon,
    href: "/appointments",
  },

  {
    label: "Resources",
    icon: Archive01Icon,
    href: "/resources",
  },

  {
    label: "Events",
    icon: OlympicTorchIcon,
    href: "/events",

    badge: {
      label: "New",

      // Set this to exactly 30 days after the Events feature goes live.
      expiresAt: "2026-09-25T23:59:59",
    },
  },

  {
    label: "Profile",
    icon: StudentIcon,
    href: "/profile",
  },
];

export const STUDENT_PROFILE_LINK = STUDENT_SIDEBAR_LINKS.at(-1)!;