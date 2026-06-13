ALTER TABLE "Scan" ADD COLUMN IF NOT EXISTS "finalUrl" TEXT;
ALTER TABLE "Scan" ADD COLUMN IF NOT EXISTS "browserInspection" JSONB;

CREATE TABLE IF NOT EXISTS "ScanScreenshot" (
    "id" TEXT NOT NULL,
    "scanId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "storagePath" TEXT NOT NULL,
    "publicUrl" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ScanScreenshot_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "ScanScreenshot_scanId_idx" ON "ScanScreenshot"("scanId");

ALTER TABLE "ScanScreenshot"
  ADD CONSTRAINT "ScanScreenshot_scanId_fkey"
  FOREIGN KEY ("scanId")
  REFERENCES "Scan"("id")
  ON DELETE CASCADE
  ON UPDATE CASCADE;
