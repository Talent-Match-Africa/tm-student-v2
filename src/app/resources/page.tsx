import type { Metadata } from "next";
import { ResourcesManagementTable } from "@/components/resources/ResourcesManagementTable";
import {
  parseResourceFilters,
  readResourceError,
} from "@/components/resources/utils";
import { listResources } from "@/endpoints/student/list-resources";
import { requireStudentSession } from "@/lib/student-session";

export const metadata: Metadata = {
  title: "Resources | Talent Match Student",
  description:
    "Explore secure career documents and trusted student guidance videos.",
};

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const filters = parseResourceFilters(await searchParams);
  const { accessToken } = await requireStudentSession("/resources");
  const result = await listResources(accessToken, filters);
  return (
    <ResourcesManagementTable
      errorMessage={result.ok ? null : readResourceError(result.payload)}
      filters={filters}
      result={result.ok ? result.payload : null}
    />
  );
}
