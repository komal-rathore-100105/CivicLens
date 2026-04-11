import { useEffect, useState } from "react";
import { MapPin, Zap, Users, Coins, TrendingUp, ArrowUpRight } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import MissionMap from "@/components/MissionMap";

const chartData = [
  { month: "Jan", impact: 4.2 },
  { month: "Feb", impact: 6.1 },
  { month: "Mar", impact: 9.3 },
  { month: "Apr", impact: 12.5 },
  { month: "May", impact: 18.7 },
  { month: "Jun", impact: 28.4 },
  { month: "Jul", impact: 45.3 },
];

const urgencyColors: Record<string, string> = {
  critical: "bg-destructive/20 text-destructive border-destructive/30",
  high: "bg-chart-3/20 text-chart-3 border-chart-3/30",
  medium: "bg-primary/20 text-primary border-primary/30",
  low: "bg-muted text-muted-foreground border-border",
};

type Mission = {
  id: string;
  title: string;
  category: string;
  status: string;
  urgency: string;
  volunteer_count: number | null;
  fund_goal: number | null;
  fund_raised: number | null;
};

export default function Index() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [volunteerCount, setVolunteerCount] = useState(0);
  const [totalCo2, setTotalCo2] = useState(0);

  useEffect(() => {
    supabase.from("missions").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      if (data) setMissions(data);
    });
    supabase.from("volunteers").select("co2_offset").then(({ data }) => {
      if (data) {
        setVolunteerCount(data.length);
        setTotalCo2(data.reduce((sum, v) => sum + (v.co2_offset || 0), 0));
      }
    });
  }, []);

  const totalFunds = missions.reduce((s, m) => s + (m.fund_raised || 0), 0);
  const hasPriorityAlpha = missions.some(m => m.urgency === "critical");

  const stats = [
    { label: "Active Missions", value: String(missions.length), change: "+12%", icon: MapPin },
    { label: "Volunteers", value: String(volunteerCount), change: "+8%", icon: Users },
    { label: "CO₂ Offset (tons)", value: totalCo2.toFixed(1), change: "+23%", icon: TrendingUp },
    { label: "Funds Deployed", value: `₹${(totalFunds / 1000).toFixed(0)}K`, change: "+15%", icon: Coins },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {hasPriorityAlpha && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 flex items-center gap-3 animate-pulse-glow">
          <Zap className="h-5 w-5 text-destructive" />
          <div>
            <p className="text-sm font-heading text-destructive">PRIORITY ALPHA — Blood Drive Active</p>
            <p className="text-xs text-muted-foreground mt-0.5">3 volunteers matched within 5km. WhatsApp alerts sent.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map(({ label, value, change, icon: Icon }, i) => (
          <div key={label} className="rounded-xl border border-border bg-card p-4 animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
            <div className="flex items-center justify-between mb-2">
              <Icon className="h-4 w-4 text-primary" />
              <span className="text-xs text-primary font-medium flex items-center gap-0.5">
                {change} <ArrowUpRight className="h-3 w-3" />
              </span>
            </div>
            <p className="text-2xl font-heading font-bold text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-heading text-sm text-foreground mb-4">Impact Growth</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="emeraldGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(155 100% 38%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(155 100% 38%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(140 12% 14%)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(140 8% 55%)" }} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(140 8% 55%)" }} axisLine={false} />
              <Tooltip contentStyle={{ background: "hsl(140 20% 6%)", border: "1px solid hsl(140 12% 14%)", borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="impact" stroke="hsl(155 100% 38%)" fill="url(#emeraldGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 flex flex-col">
          <h3 className="font-heading text-sm text-foreground mb-4">Mission Map — Live</h3>
          <MissionMap />
        </div>
      </div>

      <div>
        <h3 className="font-heading text-sm text-foreground mb-3">Mission Feed</h3>
        <div className="space-y-2">
          {missions.map((m) => (
            <div key={m.id} className="rounded-xl border border-border bg-card p-4 flex items-center gap-4 hover:border-primary/30 transition-colors cursor-pointer">
              <div className={`px-2 py-1 rounded-md text-[10px] font-heading border ${urgencyColors[m.urgency] || urgencyColors.low}`}>
                {m.urgency.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{m.title}</p>
                <p className="text-xs text-muted-foreground">{m.volunteer_count || 0} volunteers · ₹{(m.fund_raised || 0).toLocaleString()}</p>
              </div>
              <span className="text-xs text-muted-foreground font-heading">{m.category.replace("_", " ")}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
