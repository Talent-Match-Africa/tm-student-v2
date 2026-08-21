import EventsWorkspace from "@/components/events/EventsWorkspace";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Events",
  description: "See all events of talent match",
};

export default async function ProfilePage() {
    return (
        <EventsWorkspace />
    );
}
