import { useMemo, useRef, useState } from "react";
import { AlertTriangle, CheckCircle2, Loader2, ShieldCheck, Sparkles, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { aiSignals, campaigns, type VerificationStatus } from "@/data/platformData";

export default function ProofOfImpact() {
  const [running, setRunning] = useState(false);
  const [beforePhoto, setBeforePhoto] = useState<{ file: File; preview: string } | null>(null);
  const [afterPhoto, setAfterPhoto] = useState<{ file: File; preview: string } | null>(null);
  const [selectedMission, setSelectedMission] = useState("");
  const [status, setStatus] = useState<VerificationStatus>("pending");
  const [confidence, setConfidence] = useState(0);
  const [impactDelta, setImpactDelta] = useState(0);
  const [signalStatuses, setSignalStatuses] = useState<Record<string, "pass" | "warn">>({});
  const beforeRef = useRef<HTMLInputElement>(null);
  const afterRef = useRef<HTMLInputElement>(null);

  const selected = useMemo(() => campaigns.find((campaign) => campaign.id === selectedMission), [selectedMission]);

  const handleFileSelect = (type: "before" | "after") => (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const payload = { file, preview: URL.createObjectURL(file) };
    if (type === "before") setBeforePhoto(payload);
    else setAfterPhoto(payload);
  };

  const runPipeline = async () => {
    if (!beforePhoto || !afterPhoto) {
      toast.error("Upload both before and after photos");
      return;
    }
    if (!selectedMission) {
      toast.error("Select a mission");
      return;
    }

    setRunning(true);
    setStatus("pending");
    setConfidence(0);
    setImpactDelta(0);

    const sizeSimilarity = 1 - Math.abs(beforePhoto.file.size - afterPhoto.file.size) / Math.max(beforePhoto.file.size, afterPhoto.file.size, 1);
    const metadataSignal = Math.min(1, (beforePhoto.file.lastModified + afterPhoto.file.lastModified) / (Date.now() * 2));
    const simulatedDelta = Math.max(25, Math.round(52 + sizeSimilarity * 28 + Math.random() * 12));
    const simulatedConfidence = Math.max(61, Math.round(68 + sizeSimilarity * 22 + metadataSignal * 8));

    try {
      await new Promise((resolve) => setTimeout(resolve, 1100));
      const statuses: Record<string, "pass" | "warn"> = {};
      aiSignals.forEach((signal) => {
        statuses[signal] = Math.random() > 0.18 ? "pass" : "warn";
      });

      const warnings = Object.values(statuses).filter((state) => state === "warn").length;
      const finalConfidence = Math.max(0, simulatedConfidence - warnings * 9);
      const finalStatus: VerificationStatus = finalConfidence > 78 ? "verified" : finalConfidence > 64 ? "pending" : "rejected";

      setSignalStatuses(statuses);
      setImpactDelta(simulatedDelta);
      setConfidence(finalConfidence);
      setStatus(finalStatus);

      if (finalStatus === "verified") toast.success("Impact verified and ready for certificate generation");
      if (finalStatus === "rejected") toast.error("Submission flagged. Please recapture clearer after evidence.");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Verification pipeline failed";
      toast.error(message);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">AI Verification Engine</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Side-by-side before and after analysis with fraud detection, authenticity checks, and confidence scoring.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="font-heading text-sm text-foreground mb-3">Select Mission</h3>
        <select
          value={selectedMission}
          onChange={(event) => setSelectedMission(event.target.value)}
          className="w-full bg-secondary/50 text-sm text-foreground rounded-lg px-3 py-2.5 outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="">Choose a mission...</option>
          {campaigns.map((mission) => (
            <option key={mission.id} value={mission.id}>
              {mission.title}
            </option>
          ))}
        </select>
        {selected && (
          <p className="text-xs text-muted-foreground mt-2">
            Target zone: {selected.locationName} · {selected.impactType} impact
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "Before", photo: beforePhoto, ref: beforeRef, handler: handleFileSelect("before"), clear: () => setBeforePhoto(null) },
          { label: "After", photo: afterPhoto, ref: afterRef, handler: handleFileSelect("after"), clear: () => setAfterPhoto(null) },
        ].map(({ label, photo, ref, handler, clear }) => (
          <div key={label} className="rounded-xl border border-border bg-card overflow-hidden">
            <input ref={ref} type="file" accept="image/*" onChange={handler} className="hidden" />
            <div
              className="aspect-video bg-secondary/50 flex items-center justify-center cursor-pointer relative group"
              onClick={() => ref.current?.click()}
            >
              {photo ? (
                <>
                  <img src={photo.preview} alt={label} className="w-full h-full object-cover" />
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      clear();
                    }}
                    className="absolute top-2 right-2 h-6 w-6 bg-background/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3 text-foreground" />
                  </button>
                </>
              ) : (
                <div className="text-center">
                  <Upload className="h-6 w-6 text-muted-foreground mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">{label} Photo</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <Button onClick={runPipeline} disabled={running} className="w-full font-heading gap-2">
        {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
        {running ? "Verifying..." : "Run AI Verification Pipeline"}
      </Button>

      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="font-heading text-sm text-foreground mb-3">Fraud Detection and Authenticity Signals</h3>
        <div className="space-y-2">
          {aiSignals.map((signal) => {
            const signalState = signalStatuses[signal];
            return (
              <div key={signal} className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 p-3">
                <p className="text-xs text-foreground">{signal}</p>
                {!signalState && <span className="text-[11px] text-muted-foreground">Not processed</span>}
                {signalState === "pass" && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-primary">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Pass
                  </span>
                )}
                {signalState === "warn" && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-amber-500">
                    <AlertTriangle className="h-3.5 w-3.5" /> Warning
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="font-heading text-sm text-foreground mb-3">Verification Status</h3>
        <div className="grid md:grid-cols-3 gap-3">
          <div className="rounded-lg border border-border bg-secondary/50 p-3">
            <p className="text-[11px] text-muted-foreground">Current status</p>
            <p className="text-base font-heading text-foreground capitalize">{status}</p>
          </div>
          <div className="rounded-lg border border-border bg-secondary/50 p-3">
            <p className="text-[11px] text-muted-foreground">Confidence score</p>
            <p className="text-base font-heading text-primary">{confidence}%</p>
          </div>
          <div className="rounded-lg border border-border bg-secondary/50 p-3">
            <p className="text-[11px] text-muted-foreground">Impact delta</p>
            <p className="text-base font-heading text-foreground">{impactDelta}% visual improvement</p>
          </div>
        </div>
      </div>

      {status === "verified" && (
        <div className="rounded-xl border border-primary/30 bg-card p-6 glow-primary-strong animate-slide-up">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="h-6 w-6 text-primary" />
            <h3 className="font-heading text-lg text-foreground">Verification successful</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Your proof package is now ready for digital impact certification and social sharing.
          </p>
          <Link
            to="/certificates"
            className="inline-flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground"
          >
            Open Certificate Center
          </Link>
          <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/10">
            <p className="text-xs text-muted-foreground font-heading">Verification trace (simulated)</p>
            <p className="text-xs text-primary">VIS-{Date.now().toString().slice(-8)} · {selected?.id ?? "NO-MISSION"}</p>
          </div>
        </div>
      )}
    </div>
  );
}
