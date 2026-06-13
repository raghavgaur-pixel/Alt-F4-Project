-- CreateEnum
CREATE TYPE "Severity" AS ENUM ('SAFE', 'LOW_RISK', 'MEDIUM_RISK', 'HIGH_RISK', 'CRITICAL');

-- CreateEnum
CREATE TYPE "ThreatCategory" AS ENUM ('PHISHING', 'MALWARE', 'PAYMENT_FRAUD', 'SOCIAL_ENGINEERING', 'SUSPICIOUS_REDIRECT', 'DATA_HARVESTING', 'UNKNOWN');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Scan" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "originalContent" TEXT NOT NULL,
    "qrType" TEXT NOT NULL,
    "riskScore" INTEGER NOT NULL,
    "aiExplanation" TEXT NOT NULL,
    "severity" "Severity" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Scan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ThreatReport" (
    "id" TEXT NOT NULL,
    "scanId" TEXT NOT NULL,
    "category" "ThreatCategory" NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ThreatReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Scan" ADD CONSTRAINT "Scan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThreatReport" ADD CONSTRAINT "ThreatReport_scanId_fkey" FOREIGN KEY ("scanId") REFERENCES "Scan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

