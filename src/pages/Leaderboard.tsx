import { Trophy, Award, Flame, Star } from "lucide-react";

const volunteers = [
  { rank: 1, name: "Priya Sharma", sbt: 24, impact: "12.4 tons CO₂", badge: "Eco Champion", avatar: "PS" },
  { rank: 2, name: "Arjun Mehta", sbt: 19, impact: "9.8 tons CO₂", badge: "Tree Guardian", avatar: "AM" },
  { rank: 3, name: "Neha Patel", sbt: 17, impact: "8.2 tons CO₂", badge: "Water Warrior", avatar: "NP" },
  { rank: 4, name: "Rohan Singh", sbt: 14, impact: "6.5 tons CO₂", badge: "Road Fixer", avatar: "RS" },
  { rank: 5, name: "Kavita Desai", sbt: 12, impact: "5.1 tons CO₂", badge: "Clean Scout", avatar: "KD" },
  { rank: 6, name: "Amit Kumar", sbt: 10, impact: "4.3 tons CO₂", badge: "First Responder", avatar: "AK" },
  { rank: 7, name: "Sunita Rao", sbt: 8, impact: "3.7 tons CO₂", badge: "Civic Hero", avatar: "SR" },
  { rank: 8, name: "Vikram Joshi", sbt: 6, impact: "2.9 tons CO₂", badge: "Green Starter", avatar: "VJ" },
];

const rankColors = ["", "text-chart-3", "text-muted-foreground", "text-chart-3/70"];
const rankIcons = [null, Trophy, Award, Star];

export default function Leaderboard() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Leaderboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Top volunteers ranked by verified impact.</p>
      </div>

      {/* Top 3 */}
      <div className="grid grid-cols-3 gap-3">
        {volunteers.slice(0, 3).map((v, i) => {
          const order = [1, 0, 2];
          const vol = volunteers[order[i]];
          const isFirst = order[i] === 0;
          return (
            <div
              key={vol.rank}
              className={`rounded-xl border bg-card p-4 text-center animate-slide-up ${
                isFirst ? "border-primary/30 glow-primary" : "border-border"
              }`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className={`h-12 w-12 rounded-full mx-auto flex items-center justify-center text-sm font-heading font-bold ${
                isFirst ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
              }`}>
                {vol.avatar}
              </div>
              <p className="text-sm font-medium text-foreground mt-2">{vol.name}</p>
              <p className="text-xs text-muted-foreground">{vol.badge}</p>
              <div className="mt-2 flex items-center justify-center gap-1">
                <Flame className="h-3 w-3 text-primary" />
                <span className="text-xs font-heading text-primary">{vol.sbt} SBTs</span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">{vol.impact}</p>
            </div>
          );
        })}
      </div>

      {/* Rest */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {volunteers.slice(3).map((v) => (
          <div key={v.rank} className="flex items-center gap-4 p-4 border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
            <span className="text-sm font-heading text-muted-foreground w-6 text-center">#{v.rank}</span>
            <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-xs font-heading text-secondary-foreground">
              {v.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{v.name}</p>
              <p className="text-xs text-muted-foreground">{v.badge}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-heading text-primary">{v.sbt} SBTs</p>
              <p className="text-xs text-muted-foreground">{v.impact}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
