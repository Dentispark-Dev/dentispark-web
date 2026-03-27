"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Comment } from "../types";

interface CommentItemProps {
  comment: Comment;
}

export function CommentItem({ comment }: CommentItemProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex gap-4 group/comment"
    >
      <div className="flex-shrink-0">
        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 overflow-hidden shadow-sm">
          {comment.avatar ? (
              <Image
                src={comment.avatar}
                alt={comment.author}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-emerald-50 text-emerald-600 font-bold text-[10px] uppercase">
                {comment.author
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
            )}
        </div>
      </div>
      <div className="min-w-0 flex-1 space-y-4">
        {/* Comment Content */}
        <div>
          <div className="mb-1 flex items-center space-x-2">
            <p className="font-sora text-sm font-bold text-gray-900">
              {comment.author}
            </p>
            {comment.isMentor && (
              <span className="bg-emerald-50 text-emerald-700 inline-flex items-center rounded-md px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border border-emerald-100">
                Expert
              </span>
            )}
            <p className="font-sora text-[10px] font-bold text-gray-400 uppercase tracking-tight">{comment.time}</p>
          </div>
          {comment.content && (
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm group-hover/comment:border-emerald-100 transition-all">
              <p className="font-sora text-sm leading-relaxed text-gray-600 font-medium">
                {comment.content}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
