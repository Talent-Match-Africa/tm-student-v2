"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { AuthButton } from "@/components/shared/AuthButton";
import { ManagementFormShell } from "@/components/shared/ManagementFormShell";
import { useToast } from "@/components/shared/ToastProvider";
import type { StudentProfile } from "@/types/student-self-service";
import type { StudentDocument } from "@/types/student-self-service";
import type { StudentEmailChangeRequestResponse, StudentFacultyOption, StudentPasswordChangeResponse, StudentProfileMutationResponse, StudentUniversityOption } from "@/types/student-profile";
import { StudentProfileDiscardDialog } from "./StudentProfileDiscardDialog";
import { StudentDocumentsPanel } from "./StudentDocumentsPanel";
import { StudentProfileEducationStep } from "./StudentProfileEducationStep";
import { StudentProfileEmailStep } from "./StudentProfileEmailStep";
import { StudentProfileIdentityStep } from "./StudentProfileIdentityStep";
import { StudentProfileSecurityStep } from "./StudentProfileSecurityStep";
import { StudentProfileStepIndicator } from "./StudentProfileStepIndicator";
import { STUDENT_PROFILE_STEPS } from "./constants";
import { useUnsavedProfileChanges } from "./useUnsavedProfileChanges";
import { isSuccessfulMutation, profileSavingLabel, profileSubmitLabel, readFieldErrors, readStudentProfileError, requestStudentProfile, validateEmailChange, validateIdentity, validatePasswordChange, type StudentProfileFieldErrors } from "./utils";
import styles from "./StudentProfileManagementForm.module.css";

interface Props {
  documents: StudentDocument[];
  faculties: StudentFacultyOption[];
  profile: StudentProfile;
  universities: StudentUniversityOption[];
}

export function StudentProfileManagementForm({ documents, faculties: initialFaculties, profile: initialProfile, universities }: Props) {
  const router = useRouter();
  const { showSuccessToast } = useToast();
  const objectUrlRef = useRef<string | null>(null);
  const formErrorRef = useRef<HTMLParagraphElement>(null);
  const [profile, setProfile] = useState(initialProfile);
  const [currentStep, setCurrentStep] = useState(0);
  const [firstname, setFirstname] = useState(profile.firstname);
  const [lastname, setLastname] = useState(profile.lastname);
  const [username, setUsername] = useState(profile.username ?? "");
  const [phoneNumber, setPhoneNumber] = useState(profile.phone_number ?? "");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(profile.image_url);
  const [removeImage, setRemoveImage] = useState(false);
  const [universityId, setUniversityId] = useState(profile.university.id ?? "");
  const [facultyId, setFacultyId] = useState(profile.faculty?.id ?? "");
  const [faculties, setFaculties] = useState(initialFaculties);
  const [loadingFaculties, setLoadingFaculties] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");
  const [pendingEmailChange, setPendingEmailChange] = useState<{ new_email: string; expires_at: string } | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<StudentProfileFieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [discardOpen, setDiscardOpen] = useState(false);
  const step = STUDENT_PROFILE_STEPS[currentStep];
  const hasUnsavedChanges = useMemo(() => firstname !== profile.firstname || lastname !== profile.lastname || username !== (profile.username ?? "") || phoneNumber !== (profile.phone_number ?? "") || image !== null || removeImage || universityId !== (profile.university.id ?? "") || facultyId !== (profile.faculty?.id ?? "") || Boolean(newEmail || emailPassword || currentPassword || newPassword || confirmPassword), [confirmPassword, currentPassword, emailPassword, facultyId, firstname, image, lastname, newEmail, newPassword, phoneNumber, profile, removeImage, universityId, username]);

  useUnsavedProfileChanges(hasUnsavedChanges && !isSaving);
  useEffect(() => () => { if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current); }, []);
  useEffect(() => { if (formError) formErrorRef.current?.focus(); }, [formError]);

  function updateField(field: string, setter: (value: string) => void, value: string) {
    setter(value);
    if (fieldErrors[field]) setFieldErrors((current) => { const next = { ...current }; delete next[field]; return next; });
  }

  function changeStep(next: number) {
    if (isSaving || next < 0 || next >= STUDENT_PROFILE_STEPS.length) return;
    setFieldErrors({}); setFormError(null); setCurrentStep(next);
  }

  function handleImageChange(nextImage: File | null, removeExisting: boolean) {
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    const preview = nextImage ? URL.createObjectURL(nextImage) : null;
    objectUrlRef.current = preview; setImage(nextImage); setRemoveImage(removeExisting);
    setImagePreviewUrl(preview ?? (removeExisting ? null : profile.image_url));
  }

  async function changeUniversity(value: string) {
    updateField("university_id", setUniversityId, value); setFacultyId(""); setFaculties([]);
    if (!value) return;
    setLoadingFaculties(true);
    const response = await fetch(`/api/student/profile/faculties/${value}`);
    const payload = (await response.json()) as { data?: StudentFacultyOption[] };
    setFaculties(response.ok ? payload.data ?? [] : []); setLoadingFaculties(false);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (isSaving) return; setFieldErrors({}); setFormError(null);
    if (currentStep === 0) await saveIdentity();
    if (currentStep === 1) await saveEducation();
    if (currentStep === 2) await requestEmail();
    if (currentStep === 3) await changePassword();
  }

  async function saveIdentity() {
    const errors = validateIdentity(firstname, lastname, username); if (Object.keys(errors).length) { setFieldErrors(errors); return; }
    const body = new FormData(); body.set("payload", JSON.stringify({ firstname, lastname, username: username.trim().toLowerCase(), phone_number: phoneNumber, remove_image: removeImage })); if (image) body.set("image", image, image.name);
    await mutateProfile("/api/student/profile", { method: "PATCH", body }, "Your profile could not be updated.");
  }

  async function saveEducation() {
    if (!universityId) { setFieldErrors({ university_id: "Choose a university." }); return; }
    await mutateProfile("/api/student/profile/education", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ university_id: universityId, faculty_id: facultyId || null }) }, "Your education assignment could not be updated.");
  }

  async function mutateProfile(url: string, init: RequestInit, fallback: string) {
    setIsSaving(true); const result = await requestStudentProfile<StudentProfileMutationResponse>(url, init); setIsSaving(false);
    if (!result.ok || !isSuccessfulMutation<StudentProfileMutationResponse>(result.payload)) { applyError(result.payload, result.transportError ?? fallback); return; }
    setProfile(result.payload.data); setImage(null); setRemoveImage(false); setImagePreviewUrl(result.payload.data.image_url); showSuccessToast(result.payload.message); router.refresh();
  }

  async function requestEmail() {
    const errors = validateEmailChange(newEmail, emailPassword, profile.email); if (Object.keys(errors).length) { setFieldErrors(errors); return; }
    setIsSaving(true); const result = await requestStudentProfile<StudentEmailChangeRequestResponse>("/api/student/profile/email-change", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ new_email: newEmail.trim().toLowerCase(), current_password: emailPassword }) }); setIsSaving(false);
    if (!result.ok || !isSuccessfulMutation<StudentEmailChangeRequestResponse>(result.payload)) { applyError(result.payload, result.transportError ?? "The verification email could not be sent."); return; }
    setPendingEmailChange(result.payload.data); setNewEmail(""); setEmailPassword(""); showSuccessToast(result.payload.message);
  }

  async function changePassword() {
    const errors = validatePasswordChange(currentPassword, newPassword, confirmPassword); if (Object.keys(errors).length) { setFieldErrors(errors); return; }
    setIsSaving(true); const result = await requestStudentProfile<StudentPasswordChangeResponse>("/api/student/profile/password", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ current_password: currentPassword, new_password: newPassword, confirm_password: confirmPassword }) }); setIsSaving(false);
    if (!result.ok || !isSuccessfulMutation<StudentPasswordChangeResponse>(result.payload)) { applyError(result.payload, result.transportError ?? "Your password could not be changed."); return; }
    setCurrentPassword(""); setNewPassword(""); setConfirmPassword(""); showSuccessToast(result.payload.message);
  }

  function applyError(payload: unknown, fallback: string) { setFieldErrors(readFieldErrors(payload)); setFormError(readStudentProfileError(payload) ?? fallback); }
  function leave() { if (isSaving) return; if (hasUnsavedChanges) setDiscardOpen(true); else router.push("/dashboard"); }

  return (
    <ManagementFormShell actions={<>{currentStep > 0 ? <AuthButton disabled={isSaving} icon={ArrowLeft01Icon} onClick={() => changeStep(currentStep - 1)} variant="ghost">Previous</AuthButton> : null}{currentStep < STUDENT_PROFILE_STEPS.length - 1 ? <AuthButton disabled={isSaving} icon={ArrowRight01Icon} onClick={() => changeStep(currentStep + 1)} variant="secondary">Next section</AuthButton> : null}{currentStep < 4 ? <AuthButton icon={step.icon} isLoading={isSaving} loadingLabel={profileSavingLabel(currentStep)} type="submit">{profileSubmitLabel(currentStep)}</AuthButton> : null}</>} description="Manage your student identity, education, verified email, account security, and private files from one protected workspace." eyebrow="Student account" formError={formError ? <p className={styles.formError} ref={formErrorRef} role="alert" tabIndex={-1}>{formError}</p> : undefined} headerAction={<AuthButton disabled={isSaving} icon={ArrowLeft01Icon} onClick={leave} variant="secondary">Go back</AuthButton>} isSaving={isSaving} onSubmit={submit} progressPercent={((currentStep + 1) / STUDENT_PROFILE_STEPS.length) * 100} savingLabel={profileSavingLabel(currentStep)} stepDescription={step.description} stepLabel={`Section ${currentStep + 1} of ${STUDENT_PROFILE_STEPS.length}`} stepNavigation={<StudentProfileStepIndicator currentStep={currentStep} disabled={isSaving} onStepChange={changeStep} />} stepTitle={step.label} title="My profile" titleId="student-profile-title">
      {currentStep === 0 ? <StudentProfileIdentityStep errors={fieldErrors} existingImageUrl={profile.image_url} firstname={firstname} imagePreviewUrl={imagePreviewUrl} lastname={lastname} onFirstnameChange={(value) => updateField("firstname", setFirstname, value)} onImageChange={handleImageChange} onLastnameChange={(value) => updateField("lastname", setLastname, value)} onPhoneChange={(value) => updateField("phone_number", setPhoneNumber, value)} onUsernameChange={(value) => updateField("username", setUsername, value)} phoneNumber={phoneNumber} username={username} /> : null}
      {currentStep === 1 ? <StudentProfileEducationStep errors={fieldErrors} faculties={faculties} facultyId={facultyId} loadingFaculties={loadingFaculties} onFacultyChange={(value) => updateField("faculty_id", setFacultyId, value)} onUniversityChange={(value) => void changeUniversity(value)} universities={universities} universityId={universityId} /> : null}
      {currentStep === 2 ? <StudentProfileEmailStep currentEmail={profile.email} currentPassword={emailPassword} errors={fieldErrors} isVerified={profile.email_verified} newEmail={newEmail} onCurrentPasswordChange={(value) => updateField("current_password", setEmailPassword, value)} onNewEmailChange={(value) => updateField("new_email", setNewEmail, value)} pendingEmailChange={pendingEmailChange} /> : null}
      {currentStep === 3 ? <StudentProfileSecurityStep confirmPassword={confirmPassword} currentPassword={currentPassword} errors={fieldErrors} newPassword={newPassword} onConfirmPasswordChange={(value) => updateField("confirm_password", setConfirmPassword, value)} onCurrentPasswordChange={(value) => updateField("current_password", setCurrentPassword, value)} onNewPasswordChange={(value) => updateField("new_password", setNewPassword, value)} /> : null}
      {currentStep === 4 ? <StudentDocumentsPanel documents={documents} /> : null}
      <StudentProfileDiscardDialog onDiscard={() => router.push("/dashboard")} onOpenChange={setDiscardOpen} open={discardOpen} />
    </ManagementFormShell>
  );
}
