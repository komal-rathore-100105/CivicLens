import { MapPin, Zap, Users, Coins, TrendingUp, ArrowUpRight } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const stats = [
  { label: "Active Missions", value: "247", change: "+12%", icon: MapPin },
  { label: "Volunteers", value: "1,892", change: "+8%", icon: Users },
  { label: "CO₂ Offset (tons)", value: "45.3", change: "+23%", icon: TrendingUp },
  { label: "Funds Deployed", value: "₹12.4L", change: "+15%", icon: Coins },
];

const chartData = [
  { month: "Jan", missions: 30, impact: 4.2 },
  { month: "Feb", missions: 45, impact: 6.1 },
  { month: "Mar", missions: 62, impact: 9.3 },
  { month: "Apr", missions: 78, impact: 12.5 },
  { month: "May", missions: 120, impact: 18.7 },
  { month: "Jun", missions: 165, impact: 28.4 },
  { month: "Jul", missions: 247, impact: 45.3 },
];

const missions = [
  { id: 1, title: "Plastic Cleanup — Juhu Beach", category: "waste_cleared", status: "active", volunteers: 12, fund: "₹25,000", urgency: "high" },
  { id: 2, title: "Tree Plantation — Aarey Colony", category: "tree_planted", status: "active", volunteers: 34, fund: "₹50,000", urgency: "medium" },
  { id: 3, title: "Road Repair — Andheri East", category: "road_repaired", status: "verified", volunteers: 8, fund: "₹1,20,000", urgency: "low" },
  { id: 4, title: "Blood Drive — Priority Alpha", category: "priority_alpha", status: "urgent", volunteers: 3, fund: "₹0", urgency: "critical" },
];

const urgencyColors: Record<string, string> = {
  critical: "bg-destructive/20 text-destructive border-destructive/30",
  high: "bg-chart-3/20 text-chart-3 border-chart-3/30",
  medium: "bg-primary/20 text-primary border-primary/30",
  low: "bg-muted text-muted-foreground border-border",
};

export default function Index() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Priority Alpha Banner */}
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 flex items-center gap-3 animate-pulse-glow">
        <Zap className="h-5 w-5 text-destructive" />
        <div>
          <p className="text-sm font-heading text-destructive">PRIORITY ALPHA — Blood Drive Active</p>
          <p className="text-xs text-muted-foreground mt-0.5">3 volunteers matched within 5km. WhatsApp alerts sent.</p>
        </div>
      </div>

      {/* Stats Grid */}
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

      {/* Chart + Map placeholder */}
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
          <h3 className="font-heading text-sm text-foreground mb-4">Mission Map</h3>
          <div className="flex-1 rounded-lg bg-secondary/50 flex items-center justify-center min-h-[220px] relative overflow-hidden">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 30% 40%, hsl(155 100% 38% / 0.3), transparent 50%), radial-gradient(circle at 70% 60%, hsl(200 80% 50% / 0.2), transparent 40%)" }} />
            {/* Mock map pins */}
            {[
              { top: "25%", left: "30%", color: "bg-primary" },
              { top: "45%", left: "55%", color: "bg-chart-3" },
              { top: "60%", left: "40%", color: "bg-destructive" },
              { top: "35%", left: "70%", color: "bg-chart-2" },
            ].map((pin, i) => (
              <div key={i} className={`absolute w-3 h-3 rounded-full ${pin.color} animate-pulse`} style={{ top: pin.top, left: pin.left }} />
            ))}
            <p className="text-xs text-muted-foreground z-10">Mapbox integration ready</p>
          </div>
        </div>
      </div>

      {/* Mission Feed */}
      <div>
        <h3 className="font-heading text-sm text-foreground mb-3">Mission Feed</h3>
        <div className="space-y-2">
          {missions.map((m) => (
            <div key={m.id} className="rounded-xl border border-border bg-card p-4 flex items-center gap-4 hover:border-primary/30 transition-colors cursor-pointer">
              <div className={`px-2 py-1 rounded-md text-[10px] font-heading border ${urgencyColors[m.urgency]}`}>
                {m.urgency.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{m.title}</p>
                <p className="text-xs text-muted-foreground">{m.volunteers} volunteers · {m.fund}</p>
              </div>
              <span className="text-xs text-muted-foreground font-heading">{m.category.replace("_", " ")}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
