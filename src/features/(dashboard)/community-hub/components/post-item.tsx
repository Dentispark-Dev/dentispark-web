"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Share2, MoreHorizontal, Zap } from "lucide-react";
import { Post } from "../types";
import { CommentItem } from "./comment-item";
import { Input } from "@/src/components/ui/input";

interface PostItemProps {
  post: Post;
}

export function PostItem({ post }: PostItemProps) {
  const [showAllComments, setShowAllComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      setNewComment("");
      return {};
    }
  };

  const displayedComments = showAllComments
    ? post.comments
    : post.comments.slice(0, 2);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all group"
    >
      <div className="p-6 space-y-4">
        {/* Post Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gray-900 overflow-hidden flex items-center justify-center border-2 border-white shadow-sm transition-transform group-hover:scale-105">
                {post.avatar ? (
                  <Image
                    src={post.avatar}
                    alt={post.author}
                    width={100}
                    height={100}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <span className="text-sm font-bold text-white font-jakarta">
                    {post.author.split(" ").map((n) => n[0]).join("")}
                  </span>
                )}
              </div>
              {post.isMentor && (
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-lg p-0.5 border-2 border-white shadow-sm">
                  <Zap className="w-2.5 h-2.5 text-white fill-white" />
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-jakarta font-bold text-gray-900 decoration-emerald-500/30 hover:underline cursor-pointer">
                  {post.author}
                </span>
                {post.isMentor && (
                  <span className="bg-emerald-50 text-emerald-700 text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider border border-emerald-100">
                    Expert
                  </span>
                )}
              </div>
              <span className="text-[11px] font-bold text-gray-400 font-jakarta uppercase tracking-tight">
                {post.time} • Admissions Strategy
              </span>
            </div>
          </div>
          <button className="text-gray-400 hover:text-gray-900 p-2 hover:bg-gray-50 rounded-xl transition-all font-bold">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* Post Content */}
        <div className="space-y-4">
          <p className="text-gray-600 font-medium leading-relaxed font-jakarta text-[15px]">
            {post.content}
          </p>
          
          <div className="rounded-2xl overflow-hidden border border-gray-50 bg-gray-50/30">
             {/* Dynamic media placeholder */}
          </div>
        </div>

        {/* Interaction Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsLiked(!isLiked)}
              className={`flex items-center gap-2 text-sm font-bold font-jakarta transition-all active:scale-90 ${isLiked ? 'text-rose-500' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-rose-500' : ''}`} />
              <span>{isLiked ? 25 : 24}</span>
            </button>
            <button className="flex items-center gap-2 text-sm font-bold font-jakarta text-gray-400 hover:text-gray-600 transition-all active:scale-90">
              <MessageCircle className="w-5 h-5" />
              <span>{post.totalComments}</span>
            </button>
            <button className="flex items-center gap-2 text-sm font-bold font-jakarta text-gray-400 hover:text-gray-600 transition-all active:scale-90">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex -space-x-2">
            {[1,2,3].map(i => (
              <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center overflow-hidden">
                <div className="w-full h-full bg-emerald-100 opacity-50" />
              </div>
            ))}
            <div className="text-[10px] pl-4 font-bold text-gray-400 self-center">+12 others active</div>
          </div>
        </div>
      </div>

      {/* Internal Comments Feed */}
      {(post.comments.length > 0) && (
        <div className="bg-gray-50/50 p-6 space-y-6 border-t border-gray-50">
          <div className="space-y-4">
            {displayedComments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </div>

          {post.comments.length > 2 && !showAllComments && (
            <button
              onClick={() => setShowAllComments(true)}
              className="w-full py-3 rounded-2xl bg-white border border-gray-100 text-xs font-bold text-gray-500 hover:text-emerald-600 hover:border-emerald-100 transition-all shadow-sm"
            >
              View all {post.totalComments} insights
            </button>
          )}

          {/* Quick Reply Input */}
          <div className="flex items-center gap-3 pt-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-white">JD</div>
            <div className="flex-1 relative">
              <Input
                placeholder="Add to the conversation..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full rounded-xl border-gray-100 bg-white px-4 py-3 text-sm placeholder:text-gray-400 focus:ring-emerald-500/10 shadow-sm min-h-[44px]"
              />
              <button 
                onClick={handleSubmitComment}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-600 hover:text-emerald-700 font-bold text-xs"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
