"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const steps = [
  { id: "workspace", label: "Create Workspace" },
  { id: "organization", label: "Organization" },
  { id: "goals", label: "Monitoring Goals" },
  { id: "upload", label: "First Upload" },
  { id: "invite", label: "Invite Team" },
];

const goals = [
  { id: "broadcast", label: "Broadcast Content", desc: "Monitor TV and streaming reuse of official footage" },
  { id: "social", label: "Social Media", desc: "Track unauthorized sharing on social platforms" },
  { id: "merchandise", label: "Merchandise & Branding", desc: "Detect unauthorized use of logos and brand assets" },
  { id: "news", label: "News & Press", desc: "Monitor news outlets for unlicensed media usage" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [workspaceName, setWorkspaceName] = useState("");
  const [orgName, setOrgName] = useState("");
  const [industry, setIndustry] = useState("sports");
  const [selectedGoals, setSelectedGoals] = useState<Set<string>>(new Set(["broadcast", "social"]));
  const [inviteEmails, setInviteEmails] = useState("");

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const toggleGoal = (id: string) => {
    setSelectedGoals((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const finish = () => {
    router.push("/dashboard");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[var(--text-strong)]">Set up your workspace</h1>
          <span className="text-sm text-[var(--text-soft)]">Step {currentStep + 1} of {steps.length}</span>
        </div>
        <Progress value={progress} />
        <div className="flex gap-1">
          {steps.map((s, i) => (
            <button key={s.id} onClick={() => i <= currentStep && setCurrentStep(i)} className={cn("flex-1 text-center py-1 text-[10px] font-medium uppercase tracking-wider rounded transition",
              i === currentStep ? "text-[var(--brand)] bg-[var(--brand-surface)]" :
              i < currentStep ? "text-[var(--success)]" : "text-[var(--text-soft)]"
            )}>{s.label}</button>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] p-6">
        {step.id === "workspace" && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-[var(--text-strong)]">Name your workspace</h2>
              <p className="text-sm text-[var(--text-muted)] mt-1">This is where your team will manage assets and review incidents.</p>
            </div>
            <label className="block space-y-1.5 text-sm font-medium text-[var(--text-muted)]">
              Workspace Name
              <input type="text" value={workspaceName} onChange={(e) => setWorkspaceName(e.target.value)} placeholder="e.g. Apex Media Protection" className="w-full rounded-xl border border-[var(--stroke)] bg-[var(--surface-1)] px-4 py-3 text-sm text-[var(--text-strong)] input-focus-ring mt-1" />
            </label>
          </div>
        )}

        {step.id === "organization" && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-[var(--text-strong)]">Organization details</h2>
              <p className="text-sm text-[var(--text-muted)] mt-1">Tell us about your organization to customize your experience.</p>
            </div>
            <label className="block space-y-1.5 text-sm font-medium text-[var(--text-muted)]">
              Organization Name
              <input type="text" value={orgName} onChange={(e) => setOrgName(e.target.value)} placeholder="Your organization" className="w-full rounded-xl border border-[var(--stroke)] bg-[var(--surface-1)] px-4 py-3 text-sm text-[var(--text-strong)] input-focus-ring mt-1" />
            </label>
            <label className="block space-y-1.5 text-sm font-medium text-[var(--text-muted)]">
              Industry
              <select value={industry} onChange={(e) => setIndustry(e.target.value)} className="w-full rounded-xl border border-[var(--stroke)] bg-[var(--surface-1)] px-4 py-3 text-sm text-[var(--text-strong)] input-focus-ring mt-1">
                <option value="sports">Sports & Athletics</option>
                <option value="broadcasting">Broadcasting & Media</option>
                <option value="entertainment">Entertainment</option>
                <option value="other">Other</option>
              </select>
            </label>
          </div>
        )}

        {step.id === "goals" && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-[var(--text-strong)]">What do you want to monitor?</h2>
              <p className="text-sm text-[var(--text-muted)] mt-1">Select the types of content protection that matter most.</p>
            </div>
            <div className="space-y-2">
              {goals.map((g) => (
                <label key={g.id} onClick={() => toggleGoal(g.id)} className={cn(
                  "flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition",
                  selectedGoals.has(g.id) ? "border-[var(--brand)] bg-[var(--brand-surface)]" : "border-[var(--stroke)] bg-[var(--surface-1)] hover:bg-[var(--surface-2)]"
                )}>
                  <div className={cn("mt-0.5 h-5 w-5 rounded-md border-2 flex items-center justify-center shrink-0",
                    selectedGoals.has(g.id) ? "bg-[var(--brand)] border-[var(--brand)]" : "border-[var(--stroke)]"
                  )}>
                    {selectedGoals.has(g.id) && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-strong)]">{g.label}</p>
                    <p className="text-xs text-[var(--text-soft)] mt-0.5">{g.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {step.id === "upload" && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-[var(--text-strong)]">Upload your first asset</h2>
              <p className="text-sm text-[var(--text-muted)] mt-1">Get started by registering an official media file for protection.</p>
            </div>
            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[var(--stroke)] py-16 px-6 cursor-pointer hover:border-[var(--brand)] hover:bg-[var(--brand-surface)] transition">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--text-soft)] mb-4"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              <p className="text-sm font-semibold text-[var(--text-strong)]">Drop a file or click to browse</p>
              <p className="text-xs text-[var(--text-soft)] mt-1">You can always upload more later</p>
            </div>
            <button className="text-sm text-[var(--brand)] font-medium hover:underline">Skip for now →</button>
          </div>
        )}

        {step.id === "invite" && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-[var(--text-strong)]">Invite your team</h2>
              <p className="text-sm text-[var(--text-muted)] mt-1">Add colleagues to help review incidents and manage assets.</p>
            </div>
            <label className="block space-y-1.5 text-sm font-medium text-[var(--text-muted)]">
              Email Addresses
              <textarea value={inviteEmails} onChange={(e) => setInviteEmails(e.target.value)} placeholder="Enter emails, one per line" rows={4} className="w-full rounded-xl border border-[var(--stroke)] bg-[var(--surface-1)] px-4 py-3 text-sm text-[var(--text-strong)] input-focus-ring mt-1 resize-none" />
            </label>
            <p className="text-xs text-[var(--text-soft)]">Invitations will be sent as Reviewer role. You can change roles later.</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="secondary" onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} disabled={currentStep === 0}>← Back</Button>
        {currentStep < steps.length - 1 ? (
          <Button onClick={() => setCurrentStep(currentStep + 1)}>Continue →</Button>
        ) : (
          <Button onClick={finish}>Launch Dashboard 🚀</Button>
        )}
      </div>
    </div>
  );
}
