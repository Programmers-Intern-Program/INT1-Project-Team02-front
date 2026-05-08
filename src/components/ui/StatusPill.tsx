import { Badge } from "./Badge";

export function StatusPill({ status }: { status?: string | null }) {
  const normalized = status?.toLowerCase() ?? "unknown";
  const tone = normalized.includes("done") || normalized.includes("connected") || normalized.includes("active") ? "green" : normalized.includes("todo") || normalized.includes("pending") ? "amber" : normalized.includes("error") || normalized.includes("disconnect") ? "red" : "neutral";

  return <Badge tone={tone}>{status ?? "Unknown"}</Badge>;
}
