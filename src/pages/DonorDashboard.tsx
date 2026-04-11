import { Wallet, ArrowUpRight, Clock, CheckCircle2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const escrowMissions = [
  { id: 1, title: "Juhu Beach Cleanup", funded: "₹25,000", status: "escrow_locked", timelock: "5d 12h", tx: "0x7a3b...d4e1" },
  { id: 2, title: "Aarey Tree Plantation", funded: "₹50,000", status: "impact_verified", timelock: "Released", tx: "0x9c2f...b8a3" },
  { id: 3, title: "Andheri Road Repair", funded: "₹1,20,000", status: "pending_verification", timelock: "7d 0h", tx: "0x4e1d...c7f5" },
];

const statusStyles: Record<string, { label: string; className: string }> = {
  escrow_locked: { label: "Escrow Locked", className: "bg-chart-3/20 text-chart-3" },
  impact_verified: { label: "Impact Verified", className: "bg-primary/20 text-primary" },
  pending_verification: { label: "Pending", className: "bg-chart-2/20 text-chart-2" },
};

const impactFeed = [
  { time: "2 min ago", text: "SBT #247 minted for Priya Sharma — Juhu Cleanup", type: "sbt" },
  { time: "15 min ago", text: "₹25,000 escrow released — Mission #42 verified", type: "escrow" },
  { time: "1 hr ago", text: "New mission funded: Road repair Andheri East", type: "fund" },
  { time: "3 hr ago", text: "AI Pipeline verified waste_cleared at 94% confidence", type: "ai" },
];

export default function DonorDashboard() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Donor Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Fund missions, track escrow, and see your impact.</p>
      </div>

      {/* Wallet */}
      <div className="rounded-xl border border-primary/20 bg-card p-5 glow-primary">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            <span className="font-heading text-sm text-foreground">Connected Wallet</span>
          </div>
          <span className="text-xs text-muted-foreground font-mono">0x1a2b...9f8e</span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Total Funded</p>
            <p className="text-lg font-heading text-foreground">₹1,95,000</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">In Escrow</p>
            <p className="text-lg font-heading text-chart-3">₹1,45,000</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Released</p>
            <p className="text-lg font-heading text-primary">₹50,000</p>
          </div>
        </div>
      </div>

      {/* Escrow */}
      <div>
        <h3 className="font-heading text-sm text-foreground mb-3">Escrow Status</h3>
        <div className="space-y-2">
          {escrowMissions.map((m) => {
            const st = statusStyles[m.status];
            return (
              <div key={m.id} className="rounded-xl border border-border bg-card p-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{m.title}</p>
                  <p className="text-xs text-muted-foreground">{m.funded}</p>
                </div>
                <div className={`px-2 py-1 rounded-md text-[10px] font-heading ${st.className}`}>{st.label}</div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {m.timelock}
                  </div>
                  <p className="text-[10px] text-primary font-mono mt-0.5">{m.tx}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Impact Feed */}
      <div>
        <h3 className="font-heading text-sm text-foreground mb-3">Impact Feed</h3>
        <div className="rounded-xl border border-border bg-card divide-y divide-border">
          {impactFeed.map((item, i) => (
            <div key={i} className="p-3 flex items-start gap-3">
              <div className="h-2 w-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-foreground">{item.text}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Button className="w-full font-heading gap-2">
        <ArrowUpRight className="h-4 w-4" /> Fund a New Mission
      </Button>
    </div>
  );
}
