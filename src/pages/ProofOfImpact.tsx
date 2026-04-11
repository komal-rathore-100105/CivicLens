import { useState, useEffect } from "react";
import { Upload, CheckCircle2, Loader2, Eye, ShieldCheck, Globe, Coins, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

const pipelineSteps = [
  { label: "VisionNode", desc: "CLIP zero-shot classification", icon: Eye },
  { label: "GeoNode", desc: "Haversine geofence check", icon: Globe },
  { label: "ExifNode", desc: "Metadata authenticity", icon: ShieldCheck },
  { label: "ESGQuantifier", desc: "CO₂ + SDG mapping", icon: Coins },
];

export default function ProofOfImpact() {
  const [step, setStep] = useState(-1);
  const [running, setRunning] = useState(false);

  const runPipeline = () => {
    setRunning(true);
    setStep(0);
  };

  useEffect(() => {
    if (step >= 0 && step < 4) {
      const timer = setTimeout(() => setStep(s => s + 1), 1500);
      return () => clearTimeout(timer);
    }
    if (step === 4) setRunning(false);
  }, [step]);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Proof of Impact</h1>
        <p className="text-sm text-muted-foreground mt-1">Upload before/after photos. Our AI pipeline verifies your work on-chain.</p>
      </div>

      {/* Upload */}
      <div className="grid grid-cols-2 gap-4">
        {["Before", "After"].map((label) => (
          <div key={label} className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="aspect-video bg-secondary/50 flex items-center justify-center">
              <div className="text-center">
                <Upload className="h-6 w-6 text-muted-foreground mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">{label} Photo</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button onClick={runPipeline} disabled={running} className="w-full font-heading gap-2">
        {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
        {running ? "Verifying..." : "Run AI Verification Pipeline"}
      </Button>

      {/* Pipeline Visualization */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="font-heading text-sm text-foreground mb-4">Verification Pipeline</h3>
        <div className="space-y-3">
          {pipelineSteps.map(({ label, desc, icon: Icon }, i) => {
            const state = step > i ? "done" : step === i ? "active" : "pending";
            return (
              <div
                key={label}
                className={`flex items-center gap-4 p-3 rounded-lg transition-all ${
                  state === "done" ? "bg-primary/10 border border-primary/20" :
                  state === "active" ? "bg-secondary border border-primary/40 glow-primary" :
                  "bg-secondary/30 border border-transparent"
                }`}
              >
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                  state === "done" ? "bg-primary" : state === "active" ? "bg-primary/20" : "bg-muted"
                }`}>
                  {state === "done" ? <CheckCircle2 className="h-4 w-4 text-primary-foreground" /> :
                   state === "active" ? <Loader2 className="h-4 w-4 text-primary animate-spin" /> :
                   <Icon className="h-4 w-4 text-muted-foreground" />}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-heading ${state === "pending" ? "text-muted-foreground" : "text-foreground"}`}>{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
                {state === "done" && <span className="text-xs text-primary font-heading">PASS</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* SBT Result Card */}
      {step === 4 && (
        <div className="rounded-xl border border-primary/30 bg-card p-6 glow-primary-strong animate-slide-up">
          <div className="flex items-center gap-3 mb-4">
            <Award className="h-6 w-6 text-primary" />
            <h3 className="font-heading text-lg text-foreground">Soulbound Token Minted!</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground text-xs">Mission</p>
              <p className="text-foreground">Juhu Beach Cleanup</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">CO₂ Offset</p>
              <p className="text-primary font-heading">0.42 tons</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">UN SDGs</p>
              <p className="text-foreground">SDG 11, SDG 13, SDG 14</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">IPFS CID</p>
              <p className="text-foreground font-mono text-xs">Qm3x...k9f2</p>
            </div>
          </div>
          <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/10">
            <p className="text-xs text-muted-foreground font-heading">TX HASH</p>
            <p className="text-xs text-primary font-mono break-all">0x7a3b...d4e1f8c2</p>
          </div>
        </div>
      )}
    </div>
  );
}
