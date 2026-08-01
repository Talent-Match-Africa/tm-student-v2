import type { Metadata } from "next";
import { StudentProfileManagementForm } from "@/components/profile/StudentProfileManagementForm";
import { getProfile } from "@/endpoints/student/get-profile";
import { listProfileFaculties } from "@/endpoints/student/list-profile-faculties";
import { listProfileUniversities } from "@/endpoints/student/list-profile-universities";
import { listDocuments } from "@/endpoints/student/list-documents";
import { requireStudentSession } from "@/lib/student-session";

export const metadata: Metadata = {
  title: "My Profile",
  description: "Manage your Talent Match student profile and account security.",
};

export default async function ProfilePage() {
  const { accessToken } = await requireStudentSession("/profile");
  const [profileResult, universitiesResult, documentsResult] = await Promise.all([
    getProfile(accessToken),
    listProfileUniversities(),
    listDocuments(accessToken),
  ]);
  if (!profileResult.ok) throw new Error("Student profile could not be loaded.");
  const profile = profileResult.payload.data;
  const facultiesResult = profile.university.id
    ? await listProfileFaculties(profile.university.id)
    : null;

  return (
    <StudentProfileManagementForm
      documents={documentsResult.ok ? documentsResult.payload.results : []}
      faculties={facultiesResult?.ok ? facultiesResult.payload.data : []}
      profile={profile}
      universities={universitiesResult.ok ? universitiesResult.payload.data : []}
    />
  );
}
