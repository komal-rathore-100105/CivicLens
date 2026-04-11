import { useState, useRef, useEffect } from "react";
import { Mic, Camera, MapPin, DollarSign, Send, Square, Circle, CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const categories = ["waste_cleanup", "road_repair", "tree_plantation", "water_body", "public_health", "priority_alpha"];
const categoryLabels: Record<string, string> = {
  waste_cleanup: "Waste Cleanup",
  road_repair: "Road Repair",
  tree_plantation: "Tree Plantation",
  water_body: "Water Body",
  public_health: "Public Health",
  priority_alpha: "Priority Alpha",
};

export default function Report() {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [photos, setPhotos] = useState<{ file: File; preview: string }[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fundGoal, setFundGoal] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationName, setLocationName] = useState("Detecting...");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationName(`${pos.coords.latitude.toFixed(4)}° N, ${pos.coords.longitude.toFixed(4)}° E`);
      },
      () => {
        setLocation({ lat: 19.076, lng: 72.8777 });
        setLocationName("19.0760° N, 72.8777° E (default)");
      }
    );
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach(t => t.stop());
      };
      mediaRecorder.start();
      setRecording(true);
    } catch {
      toast.error("Microphone access denied");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const handlePhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newPhotos = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setPhotos(prev => [...prev, ...newPhotos].slice(0, 4));
  };

  const removePhoto = (idx: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async () => {
    if (!title || !selectedCategory) {
      toast.error("Please fill in title and category");
      return;
    }
    setSubmitting(true);

    try {
      // Upload photos
      const photoUrls: string[] = [];
      for (const photo of photos) {
        const ext = photo.file.name.split(".").pop();
        const path = `missions/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error } = await supabase.storage.from("photos").upload(path, photo.file);
        if (!error) {
          const { data: urlData } = supabase.storage.from("photos").getPublicUrl(path);
          photoUrls.push(urlData.publicUrl);
        }
      }

      const { error } = await supabase.from("missions").insert({
        title,
        description: description || undefined,
        category: selectedCategory,
        urgency: selectedCategory === "priority_alpha" ? "critical" : "medium",
        latitude: location?.lat || 19.076,
        longitude: location?.lng || 72.8777,
        location_name: locationName,
        fund_goal: fundGoal ? parseInt(fundGoal) : 0,
      });

      if (error) throw error;
      toast.success("Mission reported successfully!");
      setTitle("");
      setDescription("");
      setSelectedCategory("");
      setPhotos([]);
      setFundGoal("");
      setAudioUrl(null);
    } catch (e: any) {
      toast.error(e.message || "Failed to submit report");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Report an Issue</h1>
        <p className="text-sm text-muted-foreground mt-1">Submit civic issues with voice, photos, and location data.</p>
      </div>

      {/* Title */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="font-heading text-sm text-foreground mb-3">Mission Title</h3>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Beach cleanup at Juhu"
          className="w-full bg-secondary/50 text-sm text-foreground placeholder:text-muted-foreground outline-none rounded-lg px-3 py-2.5 focus:ring-1 focus:ring-primary transition-all"
        />
      </div>

      {/* Voice Recording */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="font-heading text-sm text-foreground mb-3">Voice Description</h3>
        <div className="flex items-center gap-4">
          <button
            onClick={recording ? stopRecording : startRecording}
            className={`h-14 w-14 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${
              recording ? "bg-destructive glow-primary-strong" : "bg-primary/10 hover:bg-primary/20"
            }`}
          >
            {recording ? <Square className="h-5 w-5 text-destructive-foreground" /> : <Mic className="h-5 w-5 text-primary" />}
          </button>
          <div className="flex-1">
            {recording ? (
              <div className="flex items-center gap-2">
                <Circle className="h-2 w-2 text-destructive animate-pulse" />
                <span className="text-sm text-foreground">Recording...</span>
                <div className="flex-1 h-8 flex items-center gap-0.5">
                  {Array.from({ length: 30 }).map((_, i) => (
                    <div key={i} className="w-1 bg-primary rounded-full animate-pulse" style={{ height: `${Math.random() * 24 + 4}px`, animationDelay: `${i * 80}ms` }} />
                  ))}
                </div>
              </div>
            ) : audioUrl ? (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <audio src={audioUrl} controls className="h-8 flex-1" />
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Tap to start recording your report</p>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="font-heading text-sm text-foreground mb-3">Description</h3>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the issue in detail..."
          rows={3}
          className="w-full bg-secondary/50 text-sm text-foreground placeholder:text-muted-foreground outline-none rounded-lg px-3 py-2.5 resize-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* Photo Upload */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="font-heading text-sm text-foreground mb-3">Photos</h3>
        <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handlePhotos} className="hidden" />
        <div className="grid grid-cols-4 gap-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center gap-1 transition-colors"
          >
            <Camera className="h-5 w-5 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground">Add Photo</span>
          </button>
          {photos.map((photo, i) => (
            <div key={i} className="aspect-square rounded-lg overflow-hidden relative group">
              <img src={photo.preview} alt="" className="w-full h-full object-cover" />
              <button onClick={() => removePhoto(i)} className="absolute top-1 right-1 h-5 w-5 bg-background/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <X className="h-3 w-3 text-foreground" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Category */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="font-heading text-sm text-foreground mb-3">Category</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === cat ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {categoryLabels[cat]}
            </button>
          ))}
        </div>
      </div>

      {/* Location */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="font-heading text-sm text-foreground mb-3">Location (Auto-detected)</h3>
        <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
          <MapPin className="h-4 w-4 text-primary" />
          <div>
            <p className="text-sm text-foreground">{locationName}</p>
            {location && <p className="text-xs text-muted-foreground">GPS coordinates captured</p>}
          </div>
        </div>
      </div>

      {/* Fund Goal */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="font-heading text-sm text-foreground mb-3">Fund Goal (Optional)</h3>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          <input
            type="number"
            value={fundGoal}
            onChange={(e) => setFundGoal(e.target.value)}
            placeholder="25000"
            className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none flex-1"
          />
        </div>
      </div>

      <Button onClick={handleSubmit} disabled={submitting} className="w-full gap-2 font-heading">
        <Send className="h-4 w-4" />
        {submitting ? "Submitting..." : "Submit Report"}
      </Button>
    </div>
  );
}
