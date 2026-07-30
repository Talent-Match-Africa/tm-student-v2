import type { StudentSidebarLink } from "@/constants/student-sidebar";

export function isStudentSidebarLinkActive(
  pathname: string,
  item: StudentSidebarLink,
): boolean {
  if (item.exact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}
