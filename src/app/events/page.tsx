import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Profile",
  description: "Manage your Talent Match student profile and account security.",
};

export default async function ProfilePage() {

  return (
    <StudentProfileManagementForm />
  );
}
