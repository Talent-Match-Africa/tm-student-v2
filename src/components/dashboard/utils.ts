export function formatDashboardCount(value: number) { return value.toLocaleString("en-RW"); }
export function firstName(value: string) { return value.trim().split(/\s+/)[0] || "there"; }
export function formatDashboardDate(value: string | null) { return value ? new Intl.DateTimeFormat("en-RW", { day: "numeric", month: "short" }).format(new Date(value)) : "Available now"; }
export function readDashboardError(payload: unknown) { return typeof payload === "object" && payload !== null && "message" in payload && typeof payload.message === "string" ? payload.message : "Your dashboard could not be loaded right now."; }
