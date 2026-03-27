"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Post } from "../types";
import { PostItem } from "./post-item";
import { Textarea } from "@/src/components/ui/textarea";
import { Button } from "@/src/components/ui/button";
import { useField } from "@/src/providers/field-provider";

interface PostsSectionProps {
  posts: Post[];
}

export function PostsSection({ posts }: PostsSectionProps) {
  const { activeField } = useField();
  const [newPost, setNewPost] = useState("");
  const [isSuggesting, setIsSuggesting] = useState(false);

  const handleSuggestTopic = async () => {
    setIsSuggesting(true);
    try {
      const response = await fetch("/api/ai/community-starter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ field: activeField }),
      });
      const data = await response.json();
      setNewPost(data.suggestedQuestion);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSuggesting(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Modern Create Post Module */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center flex-shrink-0 text-emerald-700 font-bold font-sora shadow-inner">
            JD
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
            disabled={!newPost.trim()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 rounded-xl font-bold font-sora transition-all shadow-md active:scale-95"
          >
            Post Update
          </Button>
        </div>
      </div>

      {/* Posts Feed */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-xl font-bold text-gray-900 font-sora">Recent Discussions</h2>
          <div className="flex items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
            <span>Latest</span>
            <span className="opacity-40">|</span>
            <span className="text-emerald-600">Trending</span>
          </div>
        </div>

        <div className="space-y-6">
          {posts.map((post) => (
            <PostItem key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
