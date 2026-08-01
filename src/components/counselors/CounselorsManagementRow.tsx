"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Calendar03Icon, Mail01Icon } from "@hugeicons/core-free-icons";
import { HugeIcon } from "@/components/shared/HugeIcon";
import type { Counselor } from "@/types/student-self-service";
import { CounselorUniversitySource } from "./CounselorUniversitySource";
import { counselorInitials, formatCounselorDate } from "./utils";
import styles from "./CounselorsManagementRow.module.css";

export function CounselorsManagementRow({ counselor }: { counselor: Counselor }) {
  const [imageFailed, setImageFailed] = useState(false); const showImage = Boolean(counselor.image_url) && !imageFailed;
  return <tr className={styles.row}><td data-label="Counselor"><div className={styles.identity}><span className={styles.avatar} aria-hidden="true">{showImage ? <Image alt="" fill onError={() => setImageFailed(true)} sizes="42px" src={counselor.image_url as string} unoptimized /> : counselorInitials(counselor.name)}</span><div><Link href={`/appointments?counselor=${counselor.id}`}>{counselor.name}<small>Available since {formatCounselorDate(counselor.created_at)}</small></Link></div></div></td><td data-label="Contact"><div className={styles.contact}><strong>{counselor.email || "No email address"}</strong><span>{counselor.phone_number || "Available online"}</span></div></td><td data-label="University"><CounselorUniversitySource counselorId={counselor.id} university={counselor.university} /></td><td data-label="Guidance"><div className={styles.appointmentCounts}><span className={styles.appointmentCount}><span className={styles.appointmentIcon} aria-hidden="true"><HugeIcon icon={Calendar03Icon} size={14} /></span><span><strong>1:1</strong><small>Sessions</small></span></span><span className={styles.appointmentCount}><span className={styles.appointmentIcon} aria-hidden="true"><HugeIcon icon={Mail01Icon} size={14} /></span><span><strong>Direct</strong><small>Support</small></span></span></div></td><td data-label="Status"><span className={styles.statusToggle} data-active="true"><span aria-hidden="true" />Available</span></td><td data-label="Actions"><div className={styles.actions}><Link href={`/appointments?counselor=${counselor.id}`}>Book session</Link></div></td></tr>;
}
