"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, MessageSquare, Send, CheckCircle2, X } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { Button } from "@/src/components/ui/button";
import { toast } from "sonner";

interface ReviewModalProps {
  bookingId: string;
  mentorName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function ReviewModal({ bookingId, mentorName, onClose, onSuccess }: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Please select a star rating");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/mentorship/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          rating,
          comment,
        }),
      });

      if (!response.ok) throw new Error("Failed to submit review");

      setIsSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } catch (error) {
      toast.error("Could not submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 sm:p-10">
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 fill-emerald-600" />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight font-sora">
                    Rate your session with {mentorName}
                  </h2>
                  <p className="text-slate-500 mt-2 font-medium">
                    How was your mentorship experience? Your feedback helps the community.
                  </p>
                </div>

                {/* Star Rating */}
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      key={star}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1"
                    >
                      <Star
                        className={cn(
                          "w-10 h-10 transition-colors duration-200",
                          (hoveredRating || rating) >= star
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-200 fill-slate-50"
                        )}
                        strokeWidth={1.5}
                      />
                    </motion.button>
                  ))}
                </div>

                {/* Comment Box */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-slate-700">
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-sm font-bold">Write a review (optional)</span>
                  </div>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="What did you learn? Was the mentor helpful?"
                    className="w-full h-32 p-4 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-emerald-500 focus:bg-white focus:ring-0 transition-all resize-none text-slate-700 font-medium placeholder:text-slate-400"
                  />
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || rating === 0}
                  className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-lg shadow-xl shadow-slate-900/10 group active:scale-95 transition-all"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      Submitting...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      Submit Review
                      <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </div>
                  )}
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 flex flex-col items-center text-center space-y-6"
              >
                <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-inner">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-slate-900 font-sora">Thank You!</h3>
                  <p className="text-slate-500 font-medium mt-2">
                    Your review has been submitted successfully.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
