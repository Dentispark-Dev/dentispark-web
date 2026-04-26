import { useEffect, useState } from "react";
import { Sparkles, Loader2, Send } from "lucide-react";
import { Post } from "../types";
import { PostItem } from "./post-item";
import { Textarea } from "@/src/components/ui/textarea";
import { Button } from "@/src/components/ui/button";
import { useField } from "@/src/providers/field-provider";
import { useAuth } from "@/src/providers/auth-provider";

interface PostsSectionProps {
  initialPosts: Post[];
}

export function PostsSection({ initialPosts }: PostsSectionProps) {
  const { activeField } = useField();
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [newPost, setNewPost] = useState("");
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/community/posts");
        const data = await response.json();
        if (data.posts) setPosts(data.posts);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleSuggestTopic = async () => {
    setIsSuggesting(true);
    try {
      const response = await fetch("/api/ai/community-starter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ field: activeField }),
      });
      const data = await response.json();
      if (data.suggestedQuestion) {
        setNewPost(data.suggestedQuestion);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleSubmitPost = async () => {
    if (!newPost.trim() || !user) return;
    setIsPosting(true);
    try {
      const response = await fetch("/api/community/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorId: user.guid,
          content: newPost,
          category: "General"
        }),
      });
      const data = await response.json();
      if (data.success) {
        setPosts([data.post, ...posts]);
        setNewPost("");
      }
    } catch (error) {
      console.error("Failed to create post:", error);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Modern Create Post Module */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center flex-shrink-0 text-emerald-700 font-bold font-jakarta shadow-inner overflow-hidden uppercase">
            {user?.name?.slice(0, 2) || "JD"}
          </div>
          <div className="flex-1 relative">
            <Textarea
              placeholder="What's on your mind? Ask a question or share an update..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              className="w-full min-h-[120px] rounded-2xl border-gray-100 bg-gray-50/50 px-5 py-4 text-sm placeholder:text-gray-400 focus:bg-white focus:ring-emerald-500/20 transition-all resize-none border shadow-inner"
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t border-gray-50">
          <div className="flex items-center gap-2">
            <Button 
                onClick={handleSuggestTopic}
                disabled={isSuggesting}
                variant="ghost"
                className="rounded-full text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 font-bold text-xs gap-2 transition-all active:scale-95 px-4"
            >
                {isSuggesting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                {isSuggesting ? "Thinking..." : "AI Suggestion"}
            </Button>
          </div>
          
          <Button 
            disabled={!newPost.trim() || isPosting}
            onClick={handleSubmitPost}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 rounded-xl font-bold font-jakarta transition-all shadow-md active:scale-95 gap-2"
          >
            {isPosting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {isPosting ? "Posting..." : "Post Update"}
          </Button>
        </div>
      </div>

      {/* Posts Feed */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-xl font-bold text-gray-900 font-jakarta">Recent Discussions</h2>
          <div className="flex items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
            {isLoading && <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />}
            <span>Latest</span>
            <span className="opacity-40">|</span>
            <span className="text-emerald-600">Trending</span>
          </div>
        </div>

        <div className="space-y-6">
          {posts.map((post) => (
            <PostItem key={post.id} post={post} />
          ))}
          {posts.length === 0 && !isLoading && (
            <div className="py-20 text-center text-gray-400 font-medium bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                No discussions yet. Be the first to start one!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
