import type { Severity } from "@/types/api";
import { Badge } from "@/components/ui/badge";

export function SeverityBadge({ severity }: { severity: Severity }) {
  const variant =
    severity === "CRITICAL" || severity === "HIGH_RISK"
      ? "danger"
      : severity === "MEDIUM_RISK"
        ? "warning"
        : severity === "SAFE"
          ? "success"
          : "default";

  return <Badge variant={variant}>{severity.replace(/_/g, " ")}</Badge>;
}

