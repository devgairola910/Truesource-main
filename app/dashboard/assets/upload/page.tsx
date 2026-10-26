"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FileUploader } from "@/components/upload/file-uploader";
import { UploadFileItem } from "@/lib/upload";
import { getSession, onAuthChange } from "@/lib/auth-client";
import { useSyncExternalStore } from "react";
type UploadStep = "files" | "metadata" | "protection" | "review";
const steps: { id: UploadStep; label: string }[] = [
  { id: "files", label: "Select Files" },
  { id: "metadata", label: "Metadata" },
  { id: "protection", label: "Protection" },
  { id: "review", label: "Review" },
];

export default function UploadPage() {
  const [step, setStep] = useState<UploadStep>("files");
  const [files, setFiles] = useState<UploadFileItem[]>([]);
  const [title, setTitle] = useState("");
  const [owner, setOwner] = useState("");
  const [distribution, setDistribution] = useState("");
  const [watermark, setWatermark] = useState(true);
  const [fingerprint, setFingerprint] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const session = useSyncExternalStore(onAuthChange, getSession, () => null);

  const currentIndex = steps.findIndex((s) => s.id === step);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {

      // Register each file as an asset
      for (const fileItem of files) {
        if (fileItem.status !== "done") continue;

        const res = await fetch("/api/assets", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.idToken || ""}`
          },
          body: JSON.stringify({
            title: title || fileItem.name,
            kind: fileItem.mediaType,
            rightsOwner: owner,
            distributedTo: distribution,
            url: fileItem.url,
            fingerprintId: fileItem.fingerprintId,
            pHash: fileItem.pHash,
          }),
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          const errorMessage = errorData.error || errorData.message || "Failed to register asset";
          throw new Error(errorMessage);
        }
      }

      router.push("/dashboard/assets");
    } catch (err) {
      console.error(err);
      alert("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const allFilesDone = files.length > 0 && files.every(f => f.status === "done");

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/assets" className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--stroke)] text-[var(--text-muted)] hover:bg-[var(--surface-1)] transition">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m15 18-6-6 6-6"/></svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-strong)]">Upload Assets</h1>
          <p className="text-sm text-[var(--text-muted)]">Register official media for protection</p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s.id} className="flex items-center gap-2 flex-1">
            <button
              onClick={() => i <= currentIndex && setStep(s.id)}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition w-full",
                step === s.id ? "bg-[var(--brand-surface)] text-[var(--brand)]" :
                i < currentIndex ? "text-[var(--success)]" : "text-[var(--text-soft)]"
              )}
            >
              <span className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold shrink-0",
                step === s.id ? "bg-[var(--brand)] text-white" :
                i < currentIndex ? "bg-[var(--success)] text-white" : "bg-[var(--surface-3)] text-[var(--text-soft)]"
              )}>
                {i < currentIndex ? "✓" : i + 1}
              </span>
              <span className="hidden sm:inline">{s.label}</span>
            </button>
            {i < steps.length - 1 && <div className={cn("h-px flex-1", i < currentIndex ? "bg-[var(--success)]" : "bg-[var(--stroke)]")} />}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] p-6">
        {step === "files" && (
          <FileUploader onFilesChange={setFiles} />
        )}

        {step === "metadata" && (
          <div className="space-y-5">
            <label className="block space-y-1.5 text-sm font-medium text-[var(--text-muted)]">
              Asset Title
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-xl border border-[var(--stroke)] bg-[var(--surface-1)] px-4 py-3 text-sm text-[var(--text-strong)] input-focus-ring mt-1" />
            </label>
            <label className="block space-y-1.5 text-sm font-medium text-[var(--text-muted)]">
              Rights Owner
              <input type="text" value={owner} onChange={(e) => setOwner(e.target.value)} className="w-full rounded-xl border border-[var(--stroke)] bg-[var(--surface-1)] px-4 py-3 text-sm text-[var(--text-strong)] input-focus-ring mt-1" />
            </label>
            <label className="block space-y-1.5 text-sm font-medium text-[var(--text-muted)]">
              Distribution Channels
              <input type="text" value={distribution} onChange={(e) => setDistribution(e.target.value)} className="w-full rounded-xl border border-[var(--stroke)] bg-[var(--surface-1)] px-4 py-3 text-sm text-[var(--text-strong)] input-focus-ring mt-1" />
            </label>
            <label className="block space-y-1.5 text-sm font-medium text-[var(--text-muted)]">
              Description
              <textarea rows={3} className="w-full rounded-xl border border-[var(--stroke)] bg-[var(--surface-1)] px-4 py-3 text-sm text-[var(--text-strong)] input-focus-ring mt-1 resize-none" />
            </label>
          </div>
        )}

        {step === "protection" && (
          <div className="space-y-4">
            <p className="text-sm text-[var(--text-muted)]">Configure protection settings for these assets.</p>
            {[
              { label: "Perceptual Fingerprinting", desc: "Generate resilient hashes for matching against altered copies", checked: fingerprint, onChange: () => setFingerprint(!fingerprint) },
              { label: "Invisible Watermark", desc: "Embed hidden provenance signals for stronger attribution", checked: watermark, onChange: () => setWatermark(!watermark) },
            ].map((opt) => (
              <label key={opt.label} className="flex items-start gap-3 rounded-xl border border-[var(--stroke)] bg-[var(--surface-1)] p-4 cursor-pointer hover:bg-[var(--surface-2)] transition">
                <input type="checkbox" checked={opt.checked} onChange={opt.onChange} className="mt-0.5 h-4 w-4 rounded border-[var(--stroke)] accent-[var(--brand)]" />
                <div>
                  <p className="text-sm font-semibold text-[var(--text-strong)]">{opt.label}</p>
                  <p className="text-xs text-[var(--text-soft)] mt-0.5">{opt.desc}</p>
                </div>
              </label>
            ))}
          </div>
        )}

        {step === "review" && (
          <div className="space-y-4">
            <div className="rounded-xl bg-[var(--success-surface)] border border-[var(--success)]/20 p-4">
              <p className="text-sm font-semibold text-[var(--success)]">✓ Ready to submit</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">Review your upload details below. Assets will begin processing immediately.</p>
            </div>
            <dl className="grid gap-3 sm:grid-cols-2 text-sm">
              {[
                ["Files", `${files.length} file(s)`],
                ["Title", title || "Untitled"],
                ["Owner", owner],
                ["Distribution", distribution || "Not specified"],
                ["Fingerprinting", fingerprint ? "Enabled" : "Disabled"],
                ["Watermarking", watermark ? "Enabled" : "Disabled"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg bg-[var(--surface-1)] p-3">
                  <dt className="text-xs text-[var(--text-soft)] uppercase tracking-wider">{label}</dt>
                  <dd className="mt-1 font-medium text-[var(--text-strong)]">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between">
        <Button
          variant="secondary"
          onClick={() => setStep(steps[currentIndex - 1]?.id ?? "files")}
          disabled={currentIndex === 0}
        >
          ← Back
        </Button>
        {currentIndex < steps.length - 1 ? (
          <Button 
            onClick={() => setStep(steps[currentIndex + 1].id)}
            disabled={step === "files" && (!files.length || !allFilesDone)}
          >
            Continue →
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : "Submit & Process"}
          </Button>
        )}
      </div>
    </div>
  );
}
