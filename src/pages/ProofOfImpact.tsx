import { useState, useEffect, useRef } from "react";
import { Upload, CheckCircle2, Loader2, Eye, ShieldCheck, Globe, Coins, Award, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const pipelineSteps = [
  { label: "VisionNode", desc: "CLIP zero-shot classification", icon: Eye },
  { label: "GeoNode", desc: "Haversine geofence check", icon: Globe },
  { label: "ExifNode", desc: "Metadata authenticity", icon: ShieldCheck },
  { label: "ESGQuantifier", desc: "CO₂ + SDG mapping", icon: Coins },
];

type Mission = { id: string; title: string; latitude: number; longitude: number; geofence_radius: number | null };

export default function ProofOfImpact() {
  const [step, setStep] = useState(-1);
  const [running, setRunning] = useState(false);
  const [beforePhoto, setBeforePhoto] = useState<{ file: File; preview: string } | null>(null);
  const [afterPhoto, setAfterPhoto] = useState<{ file: File; preview: string } | null>(null);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [selectedMission, setSelectedMission] = useState("");
  const [result, setResult] = useState<any>(null);
  const [stepResults, setStepResults] = useState<Record<number, string>>({});
  const [location, setLocation] = useState<{ lat: number; lng: number }>({ lat: 19.076, lng: 72.8777 });
  const beforeRef = useRef<HTMLInputElement>(null);
  const afterRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    supabase.from("missions").select("id, title, latitude, longitude, geofence_radius").then(({ data }) => {
      if (data) setMissions(data);
    });
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {}
    );
  }, []);

  const handleFileSelect = (type: "before" | "after") => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const data = { file, preview: URL.createObjectURL(file) };
    if (type === "before") setBeforePhoto(data);
    else setAfterPhoto(data);
  };

  const runPipeline = async () => {
    if (!beforePhoto || !afterPhoto) { toast.error("Upload both before and after photos"); return; }
    if (!selectedMission) { toast.error("Select a mission"); return; }

    setRunning(true);
    setStep(0);
    setResult(null);
    setStepResults({});

    const mission = missions.find(m => m.id === selectedMission);
    if (!mission) return;

    try {
      // Upload photos
      const uploadPhoto = async (photo: { file: File; preview: string }, prefix: string) => {
        const ext = photo.file.name.split(".").pop();
        const path = `proofs/${prefix}-${Date.now()}.${ext}`;
        await supabase.storage.from("photos").upload(path, photo.file);
        return supabase.storage.from("photos").getPublicUrl(path).data.publicUrl;
      };

      // Step 0: VisionNode - upload and analyze
      const beforeUrl = await uploadPhoto(beforePhoto, "before");
      const afterUrl = await uploadPhoto(afterPhoto, "after");

      // Simulate step progression while AI processes
      setStepResults(prev => ({ ...prev, 0: "Analyzing..." }));

      const { data: verifyData, error } = await supabase.functions.invoke("verify-impact", {
        body: {
          before_photo_url: beforeUrl,
          after_photo_url: afterUrl,
          latitude: location.lat,
          longitude: location.lng,
          mission_lat: mission.latitude,
          mission_lng: mission.longitude,
          geofence_radius: mission.geofence_radius || 100,
        },
      });

      if (error) throw error;

      // Animate through steps with real data
      setStepResults(prev => ({ ...prev, 0: `${verifyData.vision.class} (${(verifyData.vision.confidence * 100).toFixed(0)}%)` }));
      setStep(1);
      await new Promise(r => setTimeout(r, 800));
      setStepResults(prev => ({ ...prev, 1: verifyData.geo.within_geofence ? `✓ Within ${verifyData.geo.distance_m}m` : `✗ ${verifyData.geo.distance_m}m away` }));
      setStep(2);
      await new Promise(r => setTimeout(r, 800));
      setStepResults(prev => ({ ...prev, 2: verifyData.exif.authentic ? "✓ Authentic" : "✗ Suspicious" }));
      setStep(3);
      await new Promise(r => setTimeout(r, 800));
      setStepResults(prev => ({ ...prev, 3: `${verifyData.esg.co2_offset_kg}kg CO₂ · ${verifyData.esg.sdgs.join(", ")}` }));
      setStep(4);

      // Save to DB
      await supabase.from("impact_proofs").insert({
        mission_id: selectedMission,
        before_photo_url: beforeUrl,
        after_photo_url: afterUrl,
        vision_class: verifyData.vision.class,
        vision_confidence: verifyData.vision.confidence,
        geo_within_geofence: verifyData.geo.within_geofence,
        geo_distance_m: verifyData.geo.distance_m,
        exif_authentic: verifyData.exif.authentic,
        co2_offset_kg: verifyData.esg.co2_offset_kg,
        sdgs: verifyData.esg.sdgs,
        verification_status: verifyData.verified ? "verified" : "failed",
        volunteer_name: "Demo User",
      });

      setResult(verifyData);
      if (verifyData.verified) toast.success("Impact verified! SBT minting initiated 🎉");
      else toast.error("Verification failed — check results");
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Pipeline error");
      setStep(-1);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Proof of Impact</h1>
        <p className="text-sm text-muted-foreground mt-1">Upload before/after photos. Our AI pipeline verifies your work on-chain.</p>
      </div>

      {/* Mission selector */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="font-heading text-sm text-foreground mb-3">Select Mission</h3>
        <select
          value={selectedMission}
          onChange={(e) => setSelectedMission(e.target.value)}
          className="w-full bg-secondary/50 text-sm text-foreground rounded-lg px-3 py-2.5 outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="">Choose a mission...</option>
          {missions.map(m => (
            <option key={m.id} value={m.id}>{m.title}</option>
          ))}
        </select>
      </div>

      {/* Upload */}
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
                  <button onClick={(e) => { e.stopPropagation(); clear(); }} className="absolute top-2 right-2 h-6 w-6 bg-background/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
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

      {/* Pipeline Visualization */}
      {step >= 0 && (
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
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    state === "done" ? "bg-primary" : state === "active" ? "bg-primary/20" : "bg-muted"
                  }`}>
                    {state === "done" ? <CheckCircle2 className="h-4 w-4 text-primary-foreground" /> :
                     state === "active" ? <Loader2 className="h-4 w-4 text-primary animate-spin" /> :
                     <Icon className="h-4 w-4 text-muted-foreground" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-heading ${state === "pending" ? "text-muted-foreground" : "text-foreground"}`}>{label}</p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                  {stepResults[i] && <span className="text-xs text-primary font-heading text-right max-w-[200px] truncate">{stepResults[i]}</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SBT Result Card */}
      {result?.verified && (
        <div className="rounded-xl border border-primary/30 bg-card p-6 glow-primary-strong animate-slide-up">
          <div className="flex items-center gap-3 mb-4">
            <Award className="h-6 w-6 text-primary" />
            <h3 className="font-heading text-lg text-foreground">Soulbound Token Minted!</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground text-xs">Classification</p>
              <p className="text-foreground">{result.vision.class.replace("_", " ")}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">CO₂ Offset</p>
              <p className="text-primary font-heading">{(result.esg.co2_offset_kg / 1000).toFixed(2)} tons</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">UN SDGs</p>
              <p className="text-foreground">{result.esg.sdgs.join(", ")}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Confidence</p>
              <p className="text-foreground">{(result.vision.confidence * 100).toFixed(0)}%</p>
            </div>
          </div>
          <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/10">
            <p className="text-xs text-muted-foreground font-heading">TX HASH (Simulated)</p>
            <p className="text-xs text-primary font-mono break-all">0x{Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}</p>
          </div>
        </div>
      )}
    </div>
  );
}
