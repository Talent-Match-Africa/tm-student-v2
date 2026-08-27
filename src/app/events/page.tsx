import type { Metadata } from "next";
import { StudentEventForm } from "@/components/events/StudentEventForm";
import { getEventForm } from "@/endpoints/student/get-event-form";
import { requireStudentSession } from "@/lib/student-session";

export const metadata: Metadata = {
	title: "Event Response | Talent Match",
	description: "Submit your Talent Match event participation response.",
};

export default async function EventsPage() {
	const { accessToken } = await requireStudentSession("/events");
	const result = await getEventForm(accessToken);

	if (!result.ok) {
		console.error("getEventForm failed:", result);
		throw new Error(
			`Your event response could not be loaded: ${result.error ?? "Unknown error"}`
		);
	}

	return <StudentEventForm initialForm={result.payload.data} />;
}