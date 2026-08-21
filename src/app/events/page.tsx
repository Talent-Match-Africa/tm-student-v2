import { EventsWorkspace } from "@/components/events/EventsWorkspace";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Events | Talent Match Admin",
	description:
		"Manage Talent Match events and schedules.",
};

export default async function EventsPage() {

	return (
		<EventsWorkspace />
	);
}