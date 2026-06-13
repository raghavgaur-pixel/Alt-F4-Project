import { useRef, useState } from "react";
import { Upload, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UploadZoneProps {
  onFileSelected: (file: File) => void;
  isLoading: boolean;
}

export function UploadZone({ onFileSelected, isLoading }: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  function handleFileList(files: FileList | null) {
    const file = files?.[0];
    if (file) onFileSelected(file);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scan a QR code</CardTitle>
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
          className={`rounded-2xl border border-dashed p-6 text-center transition sm:p-8 ${
            isDragging ? "border-cyan-300 bg-cyan-400/10 shadow-glow" : "border-border bg-slate-950/40 hover:border-cyan-400/30"
          }`}
        >
          <Upload className="mx-auto mb-4 h-10 w-10 text-cyan-300" />
          <div className="text-lg font-medium text-white">{isLoading ? "Analyzing uploaded QR..." : "Drop a QR image here"}</div>
          <p className="mt-2 text-sm text-slate-400">
            Supports PNG, JPG, or other image formats readable by the backend decoder.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs text-slate-500">
            <span className="rounded-full border border-border px-3 py-1">Fast risk scoring</span>
            <span className="rounded-full border border-border px-3 py-1">AI explanation</span>
            <span className="rounded-full border border-border px-3 py-1">Community reporting</span>
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <Button onClick={() => inputRef.current?.click()} disabled={isLoading}>
              {isLoading ? "Analyzing..." : "Choose File"}
            </Button>
            <Button variant="outline" disabled>
              <Camera className="mr-2 h-4 w-4" />
              Camera Scan
            </Button>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => handleFileList(event.target.files)}
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-slate-950/30 p-4 text-left">
            <div className="text-sm font-medium text-white">1. Upload</div>
            <div className="mt-1 text-sm text-slate-400">Select a QR image from desktop or mobile.</div>
          </div>
          <div className="rounded-xl border border-border bg-slate-950/30 p-4 text-left">
            <div className="text-sm font-medium text-white">2. Analyze</div>
            <div className="mt-1 text-sm text-slate-400">The app classifies the QR payload and scores risk.</div>
          </div>
          <div className="rounded-xl border border-border bg-slate-950/30 p-4 text-left">
            <div className="text-sm font-medium text-white">3. Act</div>
            <div className="mt-1 text-sm text-slate-400">Review findings, recommendations, and report abuse.</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
