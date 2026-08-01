import { ProfileForm } from "@/components/profile/ProfileForm";
import { StudentDocumentsPanel } from "@/components/profile/StudentDocumentsPanel";
import styles from "@/components/shared/SelfService.module.css";
import { getProfile } from "@/endpoints/student/get-profile";
import { listDocuments } from "@/endpoints/student/list-documents";
import { requireStudentSession } from "@/lib/student-session";

export default async function ProfilePage() {
  const { accessToken } = await requireStudentSession("/profile");
  const [profileResult, documentsResult] = await Promise.all([
    getProfile(accessToken),
    listDocuments(accessToken),
  ]);
  if (!profileResult.ok)
    return (
      <div className={styles.empty}>
        Your profile is temporarily unavailable. Please try again.
      </div>
    );
  const profile = profileResult.payload.data;
  const documents = documentsResult.ok ? documentsResult.payload.results : [];

  return (
    <section className={styles.workspace}>
      <header className={styles.header}>
        <div>
          <p>Student identity</p>
          <h2>My profile</h2>
          <span>Keep your details and application documents ready.</span>
        </div>
        <span className={styles.badge}>
          {profile.email_verified ? "Verified" : "Verification pending"}
        </span>
      </header>
      <div className={styles.details}>
        <article className={styles.panel}>
          <span>Personal details</span>
          <h3>{profile.full_name}</h3>
          <ProfileForm profile={profile} />
        </article>
        <aside className={styles.panel}>
          <span>Private files</span>
          <h3>My documents</h3>
          <p>
            Documents are private and accessed only through short-lived secure
            links.
          </p>
          <StudentDocumentsPanel documents={documents} />
        </aside>
      </div>
    </section>
  );
}
