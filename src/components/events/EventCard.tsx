"use client";

import { useMemo, useState } from "react";
import styles from "./EventCard.module.css";

export interface EventCardAttendee {
  id: string;
  name: string;
  avatarUrl?: string;
}

export type EventStatus = "upcoming" | "live" | "past";

export interface EventCardRecord {
  id: string;
  title: string;
  category?: string;
  status?: EventStatus;
  date: string;
  time: string;
  location: string;
  /** Real event photo. If omitted (or it fails to load), a branded placeholder is shown. */
  imageUrl?: string;
  attendees?: EventCardAttendee[];
  /** Total attendee count, in case it's larger than the avatars you pass in. */
  attendeesCount?: number;
}

export interface EventCardProps {
  event: EventCardRecord;
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
}

const STATUS_LABEL: Record<EventStatus, string> = {
  upcoming: "Upcoming",
  live: "Live now",
  past: "Past",
};

function slugify(value: string) {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "event"
  );
}

// Dummy attendee avatars used only when the consumer doesn't pass real ones.
const DEFAULT_ATTENDEES: EventCardAttendee[] = [
  {
    id: "a1",
    name: "Aline U.",
    avatarUrl: "https://i.pravatar.cc/64?img=32",
  },
  {
    id: "a2",
    name: "Eric N.",
    avatarUrl: "https://i.pravatar.cc/64?img=12",
  },
  {
    id: "a3",
    name: "Diane K.",
    avatarUrl: "https://i.pravatar.cc/64?img=47",
  },
];

export function EventCard({
  event,
  onEdit,
  onDelete,
  className,
}: EventCardProps) {
  const {
    title,
    category = "Community",
    status = "upcoming",
    date,
    time,
    location,
    imageUrl,
    attendees = DEFAULT_ATTENDEES,
    attendeesCount,
  } = event;

  const [imageFailed, setImageFailed] = useState(false);

  // Dummy/placeholder photo used when no real imageUrl is supplied yet.
  const fallbackImage = useMemo(
    () => `https://picsum.photos/seed/${slugify(title)}/640/420`,
    [title]
  );

  const resolvedImage = imageUrl ?? fallbackImage;

  const visibleAttendees = attendees.slice(0, 3);
  const totalAttendees = attendeesCount ?? attendees.length;
  const overflowCount = Math.max(
    totalAttendees - visibleAttendees.length,
    0
  );

  return (
    <article
      className={[styles.card, className].filter(Boolean).join(" ")}
    >
      <div className={styles.media} data-status={status}>
        {!imageFailed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={resolvedImage}
            alt={title}
            className={styles.mediaImage}
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div
            className={styles.mediaPlaceholder}
            role="img"
            aria-label={title}
          >
            <CalendarIcon className={styles.placeholderIcon} />
          </div>
        )}

        <div className={styles.mediaOverlay} />

        <span
          className={`${styles.statusBadge} ${styles[`status-${status}`]}`}
        >
          <span className={styles.statusDot} />
          {STATUS_LABEL[status]}
        </span>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.actionButton}
            onClick={onEdit}
            aria-label={`Edit ${title}`}
          >
            <EditIcon />
          </button>

          <button
            type="button"
            className={`${styles.actionButton} ${styles.actionButtonDanger}`}
            onClick={onDelete}
            aria-label={`Delete ${title}`}
          >
            <TrashIcon />
          </button>
        </div>

        <span className={styles.categoryChip}>{category}</span>
      </div>

      {/* Signature ticket-stub seam between the photo and the details */}
      <div className={styles.ticketDivider} aria-hidden="true">
        <span className={styles.notch} data-side="left" />
        <span className={styles.perforation} />
        <span className={styles.notch} data-side="right" />
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>{title}</h3>

        <div className={styles.metaList}>
          <div className={styles.metaItem}>
            <CalendarIcon className={styles.metaIcon} />

            <span>
              {date} &middot; {time}
            </span>
          </div>

          <div className={styles.metaItem}>
            <PinIcon className={styles.metaIcon} />

            <span className={styles.metaTruncate}>{location}</span>
          </div>
        </div>

        <div className={styles.footer}>
          <div className={styles.attendees}>
            <div className={styles.avatarStack}>
              {visibleAttendees.map((attendee) => (
                <span key={attendee.id} className={styles.avatar}>
                  {attendee.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={attendee.avatarUrl}
                      alt={attendee.name}
                    />
                  ) : (
                    <span className={styles.avatarInitial}>
                      {attendee.name.charAt(0)}
                    </span>
                  )}
                </span>
              ))}

              {overflowCount > 0 && (
                <span
                  className={`${styles.avatar} ${styles.avatarMore}`}
                >
                  +{overflowCount}
                </span>
              )}
            </div>

            <span className={styles.attendeesLabel}>
              <UsersIcon className={styles.metaIcon} />
              {totalAttendees.toLocaleString()} attending
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

/* ---------------------------------------------------------------------- */
/* Inline icons — kept local so this component ships with zero new deps.  */
/* ---------------------------------------------------------------------- */

function CalendarIcon({
  className,
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <rect
        x="3"
        y="4.5"
        width="14"
        height="12"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.4"
      />

      <path
        d="M3 8h14"
        stroke="currentColor"
        strokeWidth="1.4"
      />

      <path
        d="M6.5 2.5v3M13.5 2.5v3"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PinIcon({
  className,
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M10 17.5s5.5-4.86 5.5-9.17A5.5 5.5 0 1 0 4.5 8.33C4.5 12.64 10 17.5 10 17.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />

      <circle
        cx="10"
        cy="8.2"
        r="2"
        stroke="currentColor"
        strokeWidth="1.4"
      />
    </svg>
  );
}

function UsersIcon({
  className,
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle
        cx="7.2"
        cy="6.6"
        r="2.4"
        stroke="currentColor"
        strokeWidth="1.4"
      />

      <path
        d="M2.8 16c0-2.5 1.97-4.2 4.4-4.2s4.4 1.7 4.4 4.2"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />

      <path
        d="M12.6 5.2a2.4 2.4 0 0 1 0 4.7"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />

      <path
        d="M14 11.9c2 .3 3.2 1.8 3.2 4.1"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12.9 3.6 16.4 7.1 6.9 16.6 3 17.5l.9-3.9 9-9.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 6h12M8 6V4.6c0-.4.3-.6.6-.6h2.8c.3 0 .6.2.6.6V6M6.2 6l.6 9.4c0 .6.5 1 1 1h4.4c.5 0 1-.4 1-1L13.8 6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}