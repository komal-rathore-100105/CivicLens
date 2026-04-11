import { useState, useEffect } from "react";
import { MessageCircle, ThumbsUp, Send, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Post = {
  id: string;
  author_name: string;
  author_avatar: string;
  location: string | null;
  content: string;
  tag: string | null;
  likes: number | null;
  replies: number | null;
  created_at: string;
};

const tagColors: Record<string, string> = {
  waste_cleared: "bg-primary/20 text-primary",
  tree_planted: "bg-chart-1/20 text-chart-1",
  road_repaired: "bg-chart-3/20 text-chart-3",
  priority_alpha: "bg-destructive/20 text-destructive",
  general: "bg-secondary text-secondary-foreground",
};

export default function CommunityHive() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState("");
  const [posting, setPosting] = useState(false);

  const fetchPosts = async () => {
    const { data } = await supabase.from("community_posts").select("*").order("created_at", { ascending: false });
    if (data) setPosts(data);
  };

  useEffect(() => {
    fetchPosts();
    // Real-time subscription
    const channel = supabase.channel("posts").on("postgres_changes", { event: "*", schema: "public", table: "community_posts" }, () => {
      fetchPosts();
    }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const handlePost = async () => {
    if (!newPost.trim()) return;
    setPosting(true);
    const { error } = await supabase.from("community_posts").insert({
      content: newPost,
      author_name: "You",
      author_avatar: "YO",
      location: "Mumbai, MH",
      tag: "general",
    });
    if (error) toast.error("Failed to post");
    else { setNewPost(""); toast.success("Posted!"); }
    setPosting(false);
  };

  const handleLike = async (post: Post) => {
    await supabase.from("community_posts").update({ likes: (post.likes || 0) + 1 }).eq("id", post.id);
    fetchPosts();
  };

  const timeAgo = (date: string) => {
    const mins = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins} min ago`;
    if (mins < 1440) return `${Math.floor(mins / 60)} hr ago`;
    return `${Math.floor(mins / 1440)}d ago`;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Community Hive</h1>
        <p className="text-sm text-muted-foreground mt-1">Hyperlocal discussions about civic missions.</p>
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-xs font-heading text-primary-foreground flex-shrink-0">YO</div>
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
              <button
                onClick={handlePost}
                disabled={posting || !newPost.trim()}
                className="h-8 w-8 rounded-full bg-primary flex items-center justify-center hover:bg-primary/80 transition-colors disabled:opacity-50"
              >
                <Send className="h-3.5 w-3.5 text-primary-foreground" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {posts.map((post) => (
          <div key={post.id} className="rounded-xl border border-border bg-card p-4 animate-slide-up hover:border-primary/20 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-xs font-heading text-secondary-foreground">
                {post.author_avatar}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{post.author_name}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{post.location}</span>
                  <span>·</span>
                  <span>{timeAgo(post.created_at)}</span>
                </div>
              </div>
              {post.tag && (
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-heading ${tagColors[post.tag] || tagColors.general}`}>
                  {post.tag.replace("_", " ")}
                </span>
              )}
            </div>
            <p className="text-sm text-foreground leading-relaxed">{post.content}</p>
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
              <button onClick={() => handleLike(post)} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
                <ThumbsUp className="h-3.5 w-3.5" />
                {post.likes || 0}
              </button>
              <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
                <MessageCircle className="h-3.5 w-3.5" />
                {post.replies || 0} replies
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
