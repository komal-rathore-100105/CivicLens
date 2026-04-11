import { useState } from "react";
import { MessageCircle, ThumbsUp, Send, MapPin } from "lucide-react";

const posts = [
  {
    id: 1, author: "Priya S.", avatar: "PS", location: "Juhu, Mumbai", time: "15 min ago",
    content: "Just finished the beach cleanup! 3 bags of plastic collected. The before/after is incredible 🌊",
    likes: 24, replies: 5, tag: "waste_cleared",
  },
  {
    id: 2, author: "Arjun M.", avatar: "AM", location: "Aarey Colony", time: "1 hr ago",
    content: "Planted 50 saplings today with the team. We need more volunteers for next weekend's session!",
    likes: 18, replies: 8, tag: "tree_planted",
  },
  {
    id: 3, author: "Neha P.", avatar: "NP", location: "Andheri East", time: "3 hr ago",
    content: "The pothole on Link Road has been reported for weeks. Anyone know the status of Mission #103?",
    likes: 31, replies: 12, tag: "road_repaired",
  },
  {
    id: 4, author: "Rohan S.", avatar: "RS", location: "Bandra West", time: "5 hr ago",
    content: "Priority Alpha blood drive was a success! Thanks to everyone who showed up on short notice. 🩸",
    likes: 45, replies: 15, tag: "priority_alpha",
  },
];

const tagColors: Record<string, string> = {
  waste_cleared: "bg-primary/20 text-primary",
  tree_planted: "bg-chart-1/20 text-chart-1",
  road_repaired: "bg-chart-3/20 text-chart-3",
  priority_alpha: "bg-destructive/20 text-destructive",
};

export default function CommunityHive() {
  const [newPost, setNewPost] = useState("");

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Community Hive</h1>
        <p className="text-sm text-muted-foreground mt-1">Hyperlocal discussions about civic missions.</p>
      </div>

      {/* New Post */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-xs font-heading text-primary-foreground flex-shrink-0">
            YO
          </div>
          <div className="flex-1">
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Share an update with your community..."
              className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none resize-none min-h-[60px]"
            />
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>Mumbai, MH</span>
              </div>
              <button className="h-8 w-8 rounded-full bg-primary flex items-center justify-center hover:bg-primary/80 transition-colors">
                <Send className="h-3.5 w-3.5 text-primary-foreground" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className="space-y-3">
        {posts.map((post) => (
          <div key={post.id} className="rounded-xl border border-border bg-card p-4 animate-slide-up hover:border-primary/20 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-xs font-heading text-secondary-foreground">
                {post.avatar}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{post.author}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{post.location}</span>
                  <span>·</span>
                  <span>{post.time}</span>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-heading ${tagColors[post.tag]}`}>
                {post.tag.replace("_", " ")}
              </span>
            </div>
            <p className="text-sm text-foreground leading-relaxed">{post.content}</p>
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
              <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
                <ThumbsUp className="h-3.5 w-3.5" />
                {post.likes}
              </button>
              <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
                <MessageCircle className="h-3.5 w-3.5" />
                {post.replies} replies
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
