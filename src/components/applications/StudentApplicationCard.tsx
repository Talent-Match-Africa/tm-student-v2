"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Briefcase01Icon, Download04Icon, File01Icon, SentIcon, ViewIcon } from "@hugeicons/core-free-icons";
import { HugeIcon } from "@/components/shared/HugeIcon";
import { MediumButton } from "@/components/shared/MediumButton";
import type { StudentApplication } from "@/types/student-self-service";
import type { ApplicationRouteType } from "@/types/applications";
import styles from "./StudentApplicationCard.module.css";

export function StudentApplicationCard({ application, type }: { application: StudentApplication; type: ApplicationRouteType }) {
  const router = useRouter();
  const owner = application.opportunity.owner;
  const label = application.type === "JOB" ? "Job" : "Internship";
  return <article className={styles.card}><header className={styles.header}><div className={styles.ownerAvatar}>{owner.image_url ? <Image alt="" fill sizes="48px" src={owner.image_url} unoptimized /> : <span>{initials(owner.name)}</span>}</div><div className={styles.heading}><div className={styles.headingMeta}><span>{label} application</span><span className={styles.status} data-status={application.status}><HugeIcon icon={statusIcon(application.status)} size={12} />{formatLabel(application.status)}</span></div><h3>{application.opportunity.title ?? `Untitled ${label.toLowerCase()}`}</h3><p>{owner.name} · Submitted {formatDate(application.created_at)}</p></div></header><section aria-label="Related opportunity" className={styles.opportunityContext}><span className={styles.opportunityIcon} aria-hidden="true"><HugeIcon icon={Briefcase01Icon} size={15} /></span><div><span>{label} opportunity</span><strong>{application.opportunity.title ?? `Untitled ${label.toLowerCase()}`}</strong><small>{owner.name}</small></div><Link href={`/opportunities/${type}/${application.opportunity.id}`}>View listing</Link></section><section className={styles.statusEditor} aria-label="Application progress"><div className={styles.decisionHeader}><div><span>Application progress</span><strong>{statusMessage(application.status)}</strong></div></div></section><footer className={styles.actions}>{application.documents.primary ? <MediumButton icon={Download04Icon} onClick={() => window.open(`/api/student/application-documents/${type === "job-listings" ? "jobs" : "internships"}/${application.id}/document`, "_blank", "noopener,noreferrer")} variant="secondary">Open document</MediumButton> : null}<MediumButton icon={ViewIcon} onClick={() => router.push(`/applications/${type}/${application.id}`)} variant="secondary">View application</MediumButton></footer></article>;
}

function initials(value: string) { return value.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "TM"; }
function formatLabel(value: string) { return value.toLowerCase().split("_").map((part) => `${part[0]?.toUpperCase() ?? ""}${part.slice(1)}`).join(" "); }
function formatDate(value: string) { return new Intl.DateTimeFormat("en-RW", { dateStyle: "medium" }).format(new Date(value)); }
function statusIcon(status: string) { return status === "APPLIED" ? SentIcon : status === "WITHDRAWN" ? File01Icon : Briefcase01Icon; }
function statusMessage(status: string) { const messages: Record<string, string> = { APPLIED: "Your submission was received.", UNDER_REVIEW: "The opportunity owner is reviewing your application.", SHORTLISTED: "You have been shortlisted for the next step.", REJECTED: "This application was not selected.", HIRED: "Congratulations — this application was successful.", WITHDRAWN: "This application has been withdrawn." }; return messages[status] ?? "Follow this application as its status changes."; }
