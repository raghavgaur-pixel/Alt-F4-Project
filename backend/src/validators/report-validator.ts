import { ThreatCategory } from "@prisma/client";
import { z } from "zod";

export const reportSchema = z.object({
  scanId: z.string().min(1),
  category: z.nativeEnum(ThreatCategory),
  description: z.string().min(10).max(500)
});

export type ReportInput = z.infer<typeof reportSchema>;

