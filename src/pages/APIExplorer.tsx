import { useState } from "react";
import { Play, Copy, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const endpoints = [
  {
    method: "GET",
    path: "/api/missions",
    desc: "List all active missions",
    response: {
      missions: [
        { id: 1, title: "Juhu Beach Cleanup", status: "active", volunteers: 12, geofence: { lat: 19.0948, lng: 72.8267, radius: 100 } },
        { id: 2, title: "Aarey Tree Plantation", status: "active", volunteers: 34, geofence: { lat: 19.1547, lng: 72.8625, radius: 100 } },
      ],
      total: 247,
    },
  },
  {
    method: "POST",
    path: "/api/verify-impact",
    desc: "Submit proof for AI verification",
    response: {
      pipeline: { vision: { class: "waste_cleared", confidence: 0.94 }, geo: { within_geofence: true, distance_m: 42 }, exif: { authentic: true, timestamp: "2024-01-15T10:30:00Z" }, esg: { co2_offset_kg: 420, sdgs: ["SDG 11", "SDG 14"] } },
      result: "VERIFIED",
      sbt_tx: "0x7a3b...d4e1",
    },
  },
  {
    method: "GET",
    path: "/api/leaderboard",
    desc: "Get volunteer rankings",
    response: {
      leaderboard: [
        { rank: 1, name: "Priya Sharma", sbt_count: 24, co2_offset: "12.4 tons" },
        { rank: 2, name: "Arjun Mehta", sbt_count: 19, co2_offset: "9.8 tons" },
      ],
    },
  },
  {
    method: "GET",
    path: "/api/escrow/:missionId",
    desc: "Check escrow status",
    response: {
      mission_id: 1,
      amount: "25000",
      currency: "INR",
      status: "locked",
      timelock_remaining: "5d 12h",
      tx_hash: "0x7a3b...d4e1",
    },
  },
];

const methodColors: Record<string, string> = {
  GET: "bg-primary/20 text-primary",
  POST: "bg-chart-3/20 text-chart-3",
  PUT: "bg-chart-2/20 text-chart-2",
  DELETE: "bg-destructive/20 text-destructive",
};

export default function APIExplorer() {
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(JSON.stringify(endpoints[active].response, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">API Explorer</h1>
        <p className="text-sm text-muted-foreground mt-1">Test CivicLens API endpoints with live responses.</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-4">
        {/* Endpoint List */}
        <div className="lg:col-span-2 space-y-2">
          {endpoints.map((ep, i) => (
            <button
              key={ep.path}
              onClick={() => setActive(i)}
              className={`w-full text-left rounded-xl border p-3 transition-all ${
                active === i ? "border-primary/30 bg-card glow-primary" : "border-border bg-card hover:border-primary/20"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-heading ${methodColors[ep.method]}`}>{ep.method}</span>
                <span className="text-xs font-mono text-foreground">{ep.path}</span>
              </div>
              <p className="text-xs text-muted-foreground">{ep.desc}</p>
            </button>
          ))}
        </div>

        {/* Response */}
        <div className="lg:col-span-3 rounded-xl border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-secondary/30">
            <div className="flex items-center gap-2">
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-heading ${methodColors[endpoints[active].method]}`}>
                {endpoints[active].method}
              </span>
              <span className="text-xs font-mono text-muted-foreground">{endpoints[active].path}</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={copy} className="text-muted-foreground hover:text-foreground">
                {copied ? <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>
          <div className="p-4 overflow-auto max-h-[500px]">
            <pre className="text-xs font-mono text-foreground whitespace-pre-wrap leading-relaxed">
              {JSON.stringify(endpoints[active].response, null, 2)}
            </pre>
          </div>
          <div className="px-4 py-2 border-t border-border bg-secondary/30 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-xs text-muted-foreground">200 OK · 42ms</span>
          </div>
        </div>
      </div>
    </div>
  );
}
