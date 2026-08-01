"use client";

import { SmartPhone01Icon, UserAccountIcon, UserEdit01Icon } from "@hugeicons/core-free-icons";
import { HugeIcon } from "@/components/shared/HugeIcon";
import { InputField } from "@/components/shared/InputField";
import { PhoneNumberField } from "@/components/shared/PhoneNumberField";
import { StudentProfileImageField } from "./StudentProfileImageField";
import styles from "./StudentProfileIdentityStep.module.css";

interface Props {
  errors: Record<string, string>;
  existingImageUrl: string | null;
  imagePreviewUrl: string | null;
  firstname: string;
  lastname: string;
  username: string;
  phoneNumber: string;
  onImageChange: (file: File | null, removeExisting: boolean) => void;
  onFirstnameChange: (value: string) => void;
  onLastnameChange: (value: string) => void;
  onUsernameChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
}

export function StudentProfileIdentityStep(props: Props) {
  return (
    <div className={styles.layout}>
      <StudentProfileImageField apiError={props.errors.image} existingUrl={props.existingImageUrl} onChange={props.onImageChange} previewUrl={props.imagePreviewUrl} />
      <div className={styles.fields}>
        <InputField autoComplete="given-name" error={props.errors.firstname} icon={UserEdit01Icon} label="First name" name="firstname" onChange={(event) => props.onFirstnameChange(event.target.value)} requirement="required" value={props.firstname} />
        <InputField autoComplete="family-name" error={props.errors.lastname} icon={UserEdit01Icon} label="Last name" name="lastname" onChange={(event) => props.onLastnameChange(event.target.value)} requirement="required" value={props.lastname} />
        <InputField autoCapitalize="none" autoComplete="username" error={props.errors.username} icon={UserAccountIcon} label="Username" name="username" onChange={(event) => props.onUsernameChange(event.target.value)} preserveCase requirement="required" spellCheck={false} value={props.username} />
        <PhoneNumberField error={props.errors.phone_number} label="Phone number" name="phone_number" onChange={props.onPhoneChange} requirement="optional" value={props.phoneNumber} />
        <div className={styles.accountNote}><span aria-hidden="true"><HugeIcon icon={SmartPhone01Icon} size={16} /></span><p>Your username and phone number can be used to sign in. Changes take effect across the student portal.</p></div>
      </div>
    </div>
  );
}
