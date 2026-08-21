"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Add01Icon } from "@hugeicons/core-free-icons";
import { AuthButton } from "@/components/shared/AuthButton";
import styles from "./EventsWorkspace.module.css";
import { EventFilters } from "./EventFilters";
import { EventSidebarFilters } from "./EventSidebarFilters";
import { EventFeed } from "./EventFeed";
import { fetchMockEvents } from "@/lib/mock-events";
import type { EventCardRecord } from "./EventCard";

interface EventsWorkspaceProps {
  errorMessage: string | null;
}

export function EventsWorkspace({
  errorMessage,
}: EventsWorkspaceProps) {
  const router = useRouter();

  const [events, setEvents] = useState<EventCardRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadEvents() {
      setIsLoading(true);

      try {
        const data = await fetchMockEvents();

        if (!cancelled) {
          setEvents(data);
          setFetchError(null);
        }
      } catch {
        if (!cancelled) {
          setFetchError(
            "Couldn't load events. Please try again."
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadEvents();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className={styles.workspace}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>
            Platform opportunities
          </p>

          <h1>Events</h1>

          <p className={styles.description}>
            View all events and schedules for Talent Match. You can filter events by category, date, and location to find the ones that interest you most.
          </p>
        </div>
      </header>

      <EventFilters />

      <div className={styles.contentLayout}>
        <div className={styles.categoryRail}>
          <div
            aria-label="Event filter controls"
            className={styles.sidebarScroll}
            role="region"
            tabIndex={0}
          >
            <EventSidebarFilters />
          </div>
        </div>

        <main className={styles.results}>
          <EventFeed
            events={events}
            errorMessage={errorMessage ?? fetchError}
            isInitialLoading={isLoading}
          />
        </main>
      </div>
    </div>
  );
}