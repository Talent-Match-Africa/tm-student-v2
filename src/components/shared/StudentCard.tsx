import Image from "next/image";
import Link from "next/link";
import {
	Calendar03Icon,
	Delete02Icon,
	Edit02Icon,
	Mail01Icon,
	SchoolIcon,
	SmartPhone01Icon,
} from "@hugeicons/core-free-icons";
import { HugeIcon } from "@/components/shared/HugeIcon";
import { resolveStudentProfileImage } from "@/components/students/utils";
import styles from "./StudentCard.module.css";

export interface StudentCardRecord {
	created_at: string | null;
	email: string;
	faculty_name: string | null;
	firstname: string;
	full_name: string;
	gender: string | null;
	id: string;
	image: string | null;
	is_active: boolean | null;
	lastname: string;
	phone_number: string;
}

interface StudentCardProps {
	onDelete?: (student: StudentCardRecord) => void;
	student: StudentCardRecord;
}

export function StudentCard({
	onDelete,
	student,
}: StudentCardProps) {
	const imageSrc = resolveStudentProfileImage(student.image, student.gender);
	const studentName = formatStudentDisplayName(student);
	const isActive = student.is_active === true;

	return (
		<article className={styles.card}>
			<Link
				aria-label={`Open ${studentName}'s profile`}
				className={styles.imageLink}
				href={`/students/${student.id}`}
			>
				<span className={styles.imageShell}>
				<Image
					alt={`${studentName} profile image`}
					className={styles.image}
					height={144}
					src={imageSrc}
					unoptimized
					width={144}
				/>

				<span
					aria-label={isActive ? "Active student" : "Inactive student"}
					className={styles.statusIndicator}
					data-active={isActive ? "true" : "false"}
					role="img"
				/>
				</span>
			</Link>

			<div className={styles.content}>
				<div className={styles.identity}>
					<span className={styles.genderBadge}>
						{formatGender(student.gender)}
					</span>
					<h3>
						<Link href={`/students/${student.id}`}>{studentName}</Link>
					</h3>
				</div>

				<div className={styles.badgeList} aria-label="Student information">
					<span className={styles.infoBadge}>
						<HugeIcon icon={Mail01Icon} size={14} />
						{student.email}
					</span>
					<br />

					<span className={styles.infoBadge}>
						<HugeIcon icon={SmartPhone01Icon} size={14} />
						{student.phone_number || "No phone"}
					</span>

					<span className={styles.infoBadge}>
						<HugeIcon icon={SchoolIcon} size={14} />
						{student.faculty_name ?? "No faculty"}
					</span>

					<span className={styles.infoBadge}>
						<HugeIcon icon={Calendar03Icon} size={14} />
						Joined {formatDate(student.created_at)}
					</span>
				</div>

				{onDelete ? (
					<div className={styles.actions} aria-label={`${studentName} actions`}>
						<Link
							className={styles.action}
							href={`/students/${student.id}/edit`}
						>
							<HugeIcon icon={Edit02Icon} size={13} />
							Edit
						</Link>
						<button
							className={`${styles.action} ${styles.deleteAction}`}
							onClick={() => onDelete(student)}
							type="button"
						>
							<HugeIcon icon={Delete02Icon} size={13} />
							Delete
						</button>
					</div>
				) : null}
			</div>
		</article>
	);
}

function formatStudentDisplayName(student: StudentCardRecord): string {
	const firstInitial = student.firstname.trim().charAt(0).toUpperCase();
	const lastName = student.lastname.trim();

	if (firstInitial && lastName) {
		return `${firstInitial}. ${lastName}`;
	}

	return student.full_name || "Unnamed student";
}

function formatGender(value: string | null): string {
	if (!value) {
		return "Gender not set";
	}

	return value
		.toLowerCase()
		.split(/[_\s-]+/)
		.filter(Boolean)
		.map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
		.join(" ");
}

function formatDate(value: string | null): string {
	if (!value) {
		return "Not available";
	}

	const date = new Date(value);

	if (Number.isNaN(date.getTime())) {
		return "Not available";
	}

	return new Intl.DateTimeFormat("en", {
		day: "numeric",
		month: "short",
		year: "numeric",
	}).format(date);
}
