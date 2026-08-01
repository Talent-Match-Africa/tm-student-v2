"use client";

import { UniversityIcon, UserGroupIcon } from "@hugeicons/core-free-icons";
import { SelectField } from "@/components/shared/SelectField";
import { HugeIcon } from "@/components/shared/HugeIcon";
import type { StudentFacultyOption, StudentUniversityOption } from "@/types/student-profile";
import styles from "./StudentProfileIdentityStep.module.css";

interface Props {
  errors: Record<string, string>;
  faculties: StudentFacultyOption[];
  facultyId: string;
  loadingFaculties: boolean;
  onFacultyChange: (value: string) => void;
  onUniversityChange: (value: string) => void;
  universities: StudentUniversityOption[];
  universityId: string;
}

export function StudentProfileEducationStep(props: Props) {
  return (
    <div className={styles.fields}>
      <SelectField error={props.errors.university_id} icon={UniversityIcon} isSearchable label="University" name="university_id" onChange={(event) => props.onUniversityChange(event.target.value)} options={[{ label: "Choose university", value: "" }, ...props.universities.map((item) => ({ label: item.name, value: item.id }))]} requirement="required" value={props.universityId} />
      <SelectField disabled={!props.universityId || props.loadingFaculties} error={props.errors.faculty_id} icon={UserGroupIcon} isSearchable label="Faculty" name="faculty_id" onChange={(event) => props.onFacultyChange(event.target.value)} options={[{ label: props.loadingFaculties ? "Loading faculties…" : "No faculty selected", value: "" }, ...props.faculties.map((item) => ({ label: item.name, value: item.id }))]} requirement="optional" value={props.facultyId} />
      <div className={styles.accountNote}><span aria-hidden="true"><HugeIcon icon={UniversityIcon} size={16} /></span><p>Changing university clears any previous campus assignment. A faculty can only be selected from the chosen university.</p></div>
    </div>
  );
}
