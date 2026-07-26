export const dynamic = "force-dynamic";

export function GET() {
  return Response.json(
    {
      status: "success",
      service: "talent-match-v2-student-portal",
      check: "live",
      timestamp: new Date().toISOString(),
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
