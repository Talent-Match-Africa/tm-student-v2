import type { EventCardRecord } from "@/components/events/EventCard";

export const mockEvents: EventCardRecord[] = [
  {
    id: "evt_1",
    title: "Talent Match career fair",
    category: "Career event",
    status: "upcoming",
    date: "10 September 2026",
    time: "09:00",
    location: "Kigali, Rwanda",
    attendeesCount: 33,
  },
  {
    id: "evt_2",
    title: "Product design community session",
    category: "Community",
    status: "live",
    date: "27 August 2026",
    time: "14:00",
    location: "Remote",
    attendeesCount: 12,
  },
  {
    id: "evt_3",
    title: "Alumni networking evening",
    category: "Networking",
    status: "past",
    date: "15 July 2026",
    time: "17:30",
    location: "Nairobi, Kenya",
    attendeesCount: 58,
  },
];

// Simulates network latency so loading states are visible during dev.
export async function fetchMockEvents(): Promise<EventCardRecord[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockEvents;
}
