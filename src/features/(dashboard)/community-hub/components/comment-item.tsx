import Image from "next/image";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";

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
                width={1008}
                height={1008}
                className="mr-auto h-[48px] w-[48px] rounded-full object-cover"
              />
            ) : (
              <span className="text-sm font-medium text-white">
                {comment.author
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            )}
          </span>
        </div>
      </div>
      <div className="min-w-0 flex-1 space-y-4">
        {/* Comment Content */}
        <div>
          <div className="mb-1 flex items-center space-x-2">
            <p className="font-sora text-base font-semibold text-[#242424]">
              {comment.author}
            </p>
            {comment.isMentor && (
              <span className="bg-primary-100 text-primary inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium">
                Mentor
              </span>
            )}
            <p className="font-sora text-xs text-gray-500">{comment.time}</p>
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
