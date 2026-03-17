"use client";

import React, { useState, useEffect, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import { Message } from "ai";
import { 
  Sparkles, 
  Send, 
  User, 
  Bot, 
  X, 
  ChevronRight, 
  MessageSquare,
  Loader2,
  BrainCircuit
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useField } from "@/src/providers/field-provider";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";

export function AIGuidanceAssistant() {
  const { activeField } = useField();
  const [isOpen, setIsOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [input, setInput] = useState("");
  const { messages, sendMessage, status, clearError } = useChat({
    api: "/api/ai/guide-assistance",
    body: { field: activeField },
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        parts: [{ type: "text", text: `Hi! I'm your DentiSpark Guidance Assistant. I can help you with UCAS deadlines, prerequisite checks, or explaining any of our expert guides. What's on your mind?` }]
      }
    ]
  });

  const isLoading = status === "submitted" || status === "streaming";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput("");
    
    try {
      await sendMessage({ text: userMessage });
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      {/* Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-8 right-8 z-50 w-16 h-16 rounded-3xl bg-black-900 text-white shadow-2xl flex items-center justify-center group overflow-hidden transition-all",
          isOpen && "scale-0 opacity-0"
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-primary-600 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <MessageSquare className="w-6 h-6 relative z-10" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary-500 rounded-full border-2 border-white animate-pulse" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-8 right-8 z-50 w-[400px] max-w-[calc(100vw-2rem)] h-[600px] max-h-[calc(100vh-6rem)] bg-white rounded-[2.5rem] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.3)] border border-greys-100 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 bg-black-900 text-white flex items-center justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <BrainCircuit className="w-24 h-24" />
                </div>
                <div className="flex items-center gap-3 relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm">Guidance Assistant</h3>
                        <p className="text-[10px] text-primary-300 font-bold uppercase tracking-widest">Powered by AI</p>
                    </div>
                </div>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:bg-white/10 rounded-xl"
                >
                    <X className="w-5 h-5" />
                </Button>
            </div>

            {/* Messages */}
            <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-6 bg-greys-50/50"
            >
                {messages.map((m: Message) => (
                    <motion.div
                        key={m.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                            "flex gap-3",
                            m.role === "user" ? "flex-row-reverse" : ""
                        )}
                    >
                        <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm",
                            m.role === "user" ? "bg-primary-600 text-white" : "bg-white text-black-600 border border-greys-100"
                        )}>
                            {m.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                        </div>
                        <div className={cn(
                            "p-4 rounded-2xl text-sm leading-relaxed max-w-[85%] shadow-sm",
                            m.role === "user" 
                                ? "bg-black-800 text-white rounded-tr-none" 
                                : "bg-white text-black-700 border border-primary-50 rounded-tl-none"
                        )}>
                            {m.parts ? m.parts.map((part, i) => part.type === "text" ? part.text : null) : (m as any).content}
                        </div>
                    </motion.div>
                ))}
                {isLoading && (
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white border border-greys-100 flex items-center justify-center">
                            <Bot className="w-4 h-4 text-black-600" />
                        </div>
                        <div className="bg-white border border-primary-50 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin text-primary-500" />
                            <span className="text-xs font-bold text-black-400">Thinking...</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Input */}
            <form 
                onSubmit={handleSubmit}
                className="p-6 bg-white border-t border-greys-100"
            >
                <div className="relative">
                    <input 
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Ask anything..."
                        className="w-full h-14 pl-6 pr-14 rounded-2xl bg-greys-50 border-transparent focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-50 transition-all outline-none text-sm font-medium"
                    />
                    <button 
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="absolute right-2 top-2 w-10 h-10 rounded-xl bg-black-900 text-white flex items-center justify-center disabled:opacity-50 disabled:translate-y-0 hover:translate-y-[-2px] transition-all shadow-lg active:scale-95"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
                <p className="mt-3 text-[10px] text-center text-black-400 font-medium">
                    Insightful guidance tailored to your <span className="text-primary-600 font-bold uppercase">{activeField}</span> goals.
                </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
