import { useRef, useState } from "react";
import { Camera, ShieldCheck, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UploadZoneProps {
  onFileSelected: (file: File) => void;
  isLoading: boolean;
  statusLabel?: string;
  statusDetail?: string;
  errorMessage?: string;
}

export function UploadZone({ onFileSelected, isLoading, statusLabel, statusDetail, errorMessage }: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  function handleFileList(files: FileList | null) {
    const file = files?.[0];
    if (file) onFileSelected(file);
  }

  return (
    <Card>
      <CardHeader>
        <div className="space-y-1">
          <p className="text-sm uppercase text-slate-500">Threat intake</p>
          <CardTitle>Scan a QR code</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragging(false);
            handleFileList(event.dataTransfer.files);
          }}
          className={`rounded-2xl border border-dashed p-8 text-center transition ${
            isDragging ? "border-cyan-300 bg-cyan-400/10" : "border-border bg-slate-950/40"
          }`}
        >
          <Upload className="mx-auto mb-4 h-10 w-10 text-cyan-300" />
          <div className="text-lg font-medium text-white">Drop a QR image here</div>
          <p className="mt-2 text-sm text-slate-400">
            Upload a receipt, poster, package label, payment request, or screenshot for instant analysis.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <Button onClick={() => inputRef.current?.click()} disabled={isLoading}>
              {isLoading ? "Analyzing..." : "Choose File"}
            </Button>
            <Button variant="outline" disabled>
              <Camera className="mr-2 h-4 w-4" />
              Camera Scan Placeholder
            </Button>
          </div>
          <div className="mt-5 grid gap-2 text-left text-xs text-slate-400 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-slate-950/40 px-3 py-2">
              <ShieldCheck className="mb-1 h-4 w-4 text-emerald-300" />
              PNG, JPG, and other common image formats
            </div>
            <div className="rounded-xl border border-border bg-slate-950/40 px-3 py-2">
              <ShieldCheck className="mb-1 h-4 w-4 text-cyan-300" />
              Instant risk, severity, and confidence scoring
            </div>
            <div className="rounded-xl border border-border bg-slate-950/40 px-3 py-2">
              <ShieldCheck className="mb-1 h-4 w-4 text-amber-300" />
              Results automatically open after upload
            </div>
          </div>
          {isLoading ? (
            <div className="mt-5 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-left">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase text-cyan-200/70">{statusLabel ?? "Analysis in progress"}</p>
                  <p className="mt-1 text-sm text-cyan-50">{statusDetail ?? "Decoding, loading the URL in an isolated browser session, and capturing screenshots."}</p>
                </div>
                <div className="h-9 w-9 animate-pulse rounded-full border border-cyan-300/30 bg-cyan-300/10" />
              </div>
            </div>
          ) : errorMessage ? (
            <div className="mt-5 rounded-2xl border border-rose-400/20 bg-rose-400/10 p-4 text-left">
              <p className="text-xs uppercase text-rose-200/70">Upload failed</p>
              <p className="mt-1 text-sm text-rose-100">{errorMessage}</p>
            </div>
          ) : null}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => handleFileList(event.target.files)}
          />
        </div>
      </CardContent>
    </Card>
  );
}

