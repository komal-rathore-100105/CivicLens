import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis } from "recharts";

const envData = [
  { category: "Waste Cleared", tons: 18.4 },
  { category: "Trees Planted", tons: 12.1 },
  { category: "Roads Repaired", tons: 8.7 },
  { category: "Water Cleaned", tons: 6.1 },
];

const sdgData = [
  { name: "SDG 11", value: 35 },
  { name: "SDG 13", value: 28 },
  { name: "SDG 14", value: 18 },
  { name: "SDG 15", value: 12 },
  { name: "SDG 6", value: 7 },
];

const radarData = [
  { subject: "Carbon", A: 85 },
  { subject: "Waste", A: 92 },
  { subject: "Water", A: 65 },
  { subject: "Biodiversity", A: 70 },
  { subject: "Community", A: 88 },
  { subject: "Governance", A: 75 },
];

const COLORS = ["hsl(155,100%,38%)", "hsl(200,80%,50%)", "hsl(45,90%,55%)", "hsl(280,70%,55%)", "hsl(0,72%,51%)"];

export default function ESGReport() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">ESG Report</h1>
        <p className="text-sm text-muted-foreground mt-1">Environmental, Social & Governance impact dashboard.</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Environmental Score", value: "87/100", sub: "↑ 12 pts this quarter" },
          { label: "Social Score", value: "92/100", sub: "1,892 volunteers engaged" },
          { label: "Governance Score", value: "78/100", sub: "100% on-chain verified" },
        ].map((s, i) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-4 animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="text-2xl font-heading text-primary mt-1">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* CO2 by Category */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-heading text-sm text-foreground mb-4">CO₂ Offset by Category</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={envData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(140,12%,14%)" />
              <XAxis dataKey="category" tick={{ fontSize: 10, fill: "hsl(140,8%,55%)" }} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(140,8%,55%)" }} axisLine={false} />
              <Tooltip contentStyle={{ background: "hsl(140,20%,6%)", border: "1px solid hsl(140,12%,14%)", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="tons" fill="hsl(155,100%,38%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* SDG Pie */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-heading text-sm text-foreground mb-4">UN SDG Alignment</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={sdgData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                {sdgData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(140,20%,6%)", border: "1px solid hsl(140,12%,14%)", borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 mt-2 justify-center">
            {sdgData.map((s, i) => (
              <div key={s.name} className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full" style={{ background: COLORS[i] }} />
                <span className="text-[10px] text-muted-foreground">{s.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Radar */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="font-heading text-sm text-foreground mb-4">Impact Radar</h3>
        <ResponsiveContainer width="100%" height={280}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="hsl(140,12%,14%)" />
            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "hsl(140,8%,55%)" }} />
            <Radar dataKey="A" stroke="hsl(155,100%,38%)" fill="hsl(155,100%,38%)" fillOpacity={0.15} strokeWidth={2} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
