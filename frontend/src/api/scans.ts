import type { Scan } from "@/types/api";
import { apiRequest } from "./client";

export function uploadScan(file: File, token: string) {
  const formData = new FormData();
  formData.append("file", file);

  return apiRequest<Scan>("/api/scan/upload", {
    method: "POST",
    body: formData,
    token
  });
}

export function fetchScanHistory(token: string) {
  return apiRequest<Scan[]>("/api/scan/history", { token });
}

export function fetchScanById(id: string, token: string) {
  return apiRequest<Scan>(`/api/scan/${id}`, { token });
}

export function fetchRecentScans(token: string) {
  return apiRequest<Scan[]>("/api/scan/recent", { token });
}

