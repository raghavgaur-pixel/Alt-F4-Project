import type { CommunityReportResponse } from "@/types/api";
import { apiRequest } from "./client";

export function fetchReports() {
  return apiRequest<CommunityReportResponse>("/api/reports");
}

export function submitReport(
  payload: { scanId: string; category: string; description: string },
  token: string
) {
  return apiRequest("/api/report", {
    method: "POST",
    token,
    body: JSON.stringify(payload)
  });
}

