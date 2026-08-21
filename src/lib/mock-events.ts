import type { EventCardRecord } from "@/components/events/EventCard";

export const mockEvents: EventCardRecord[] = [
  {
    id: "evt_1",
    title: "Frontend Engineer, Growth",
    description:
      "Own the signup and onboarding funnel end to end, from experiment design to shipped UI.",
    industry_sector: "Software",
    location: "Kigali, Rwanda",
    salary: "$60k – $80k",
    work_flexibility: "Hybrid",
    is_open: true,
    application_count: 33,
    view_count: 482,
    apply_start: "2026-08-10T00:00:00Z",
    application_deadline: "2026-09-05T00:00:00Z",
    created_at: "2026-08-24T00:00:00Z",
    owner_id: "org_1",
    owner_name: "Talent Match",
    owner_type: "Employer",
    owner_image: null,
  },
  {
    id: "evt_2",
    title: "Product Designer",
    description:
      "Shape the design system and lead research for our core admin dashboard product.",
    industry_sector: "Design",
    location: "Remote",
    salary: null,
    work_flexibility: "Remote",
    is_open: true,
    application_count: 12,
    view_count: 201,
    apply_start: "2026-07-01T00:00:00Z",
    application_deadline: "2026-08-27T00:00:00Z",
    created_at: "2026-07-01T00:00:00Z",
    owner_id: "org_2",
    owner_name: "Northwind Labs",
    owner_type: "Employer",
    owner_image: null,
  },
  {
    id: "evt_3",
    title: "Backend Engineer, Payments",
    description: null,
    industry_sector: "Fintech",
    location: "Nairobi, Kenya",
    salary: "$90k – $110k",
    work_flexibility: "Onsite",
    is_open: false,
    application_count: 58,
    view_count: 1240,
    apply_start: "2026-06-01T00:00:00Z",
    application_deadline: "2026-07-15T00:00:00Z",
    created_at: "2026-06-01T00:00:00Z",
    owner_id: "org_3",
    owner_name: "Rivet Financial",
    owner_type: "Employer",
    owner_image: null,
  },
];

// Simulates network latency so loading states are visible during dev.
export async function fetchMockEvents(): Promise<EventCardRecord[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockEvents;
}