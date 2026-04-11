import { useState } from "react";
import { Mic, Camera, MapPin, DollarSign, Send, Square, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";

const categories = ["Waste Cleanup", "Road Repair", "Tree Plantation", "Water Body", "Public Health", "Priority Alpha"];

export default function Report() {
  const [recording, setRecording] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Report an Issue</h1>
        <p className="text-sm text-muted-foreground mt-1">Submit civic issues with voice, photos, and location data.</p>
      </div>

      {/* Voice Recording */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="font-heading text-sm text-foreground mb-3">Voice Description</h3>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setRecording(!recording)}
            className={`h-14 w-14 rounded-full flex items-center justify-center transition-all ${
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
                    <div
                      key={i}
                      className="w-1 bg-primary rounded-full"
                      style={{ height: `${Math.random() * 24 + 4}px`, animationDelay: `${i * 50}ms` }}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Tap to start recording your report</p>
            )}
          </div>
        </div>
      </div>

      {/* Photo Upload */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="font-heading text-sm text-foreground mb-3">Photos</h3>
        <div className="grid grid-cols-3 gap-3">
          <button className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center gap-1 transition-colors">
            <Camera className="h-5 w-5 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground">Add Photo</span>
          </button>
          {[1, 2].map((i) => (
            <div key={i} className="aspect-square rounded-lg bg-secondary/50 flex items-center justify-center">
              <span className="text-xs text-muted-foreground">Photo {i}</span>
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
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Location */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="font-heading text-sm text-foreground mb-3">Location</h3>
        <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
          <MapPin className="h-4 w-4 text-primary" />
          <div>
            <p className="text-sm text-foreground">19.0760° N, 72.8777° E</p>
            <p className="text-xs text-muted-foreground">Juhu Beach, Mumbai, MH</p>
          </div>
        </div>
      </div>

      {/* Fund Goal */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="font-heading text-sm text-foreground mb-3">Fund Goal (Optional)</h3>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="₹25,000"
            className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none flex-1"
          />
        </div>
      </div>

      <Button className="w-full gap-2 font-heading">
        <Send className="h-4 w-4" />
        Submit Report
      </Button>
    </div>
  );
}
