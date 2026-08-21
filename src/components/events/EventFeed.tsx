"use client";

import { useState } from "react";
import { BackToTopButton } from "@/components/shared/BackToTopButton";
import styles from "./EventFeed.module.css";
import { EventCard, type EventCardRecord } from "./EventCard";
import { EventCardSkeleton } from "./EventCardSkeleton";

interface EventFeedProps {
  events?: EventCardRecord[];
  errorMessage: string | null;
  isInitialLoading?: boolean;
}

export function EventFeed({
  events = [],
  errorMessage,
  isInitialLoading = false,
}: EventFeedProps) {
  const [loadError] = useState(errorMessage);

  return (
    <section
      className={styles.feed}
      aria-label="Event results"
    >
      <div
        className={styles.grid}
        role="list"
      >
        {isInitialLoading ? (
          Array.from({ length: 6 }, (_, index) => (
            <div
              className={styles.gridItem}
              key={`initial-${index}`}
            >
              <EventCardSkeleton />
            </div>
          ))
        ) : events.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No events yet</p>

            <span>
              New postings will show up here as soon as theyre live.
            </span>
          </div>
        ) : (
          events.map((event) => (
            <div
              className={styles.gridItem}
              key={event.id}
              role="listitem"
            >
              <EventCard event={event} />
            </div>
          ))
        )}
      </div>

      {loadError ? (
        <div
          className={styles.loadError}
          role="alert"
        >
          <span>{loadError}</span>

          <button type="button">
            Try again
          </button>
        </div>
      ) : null}

      <BackToTopButton />
    </section>
  );
}