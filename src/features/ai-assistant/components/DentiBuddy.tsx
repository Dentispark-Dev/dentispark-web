"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Send, Bot, Loader2, Zap, MessageSquare } from "lucide-react";
import { Input } from "@/src/components/ui/input";
import { useChat } from "@ai-sdk/react";
import { useField } from "@/src/providers/field-provider";

export function DentiBuddy() {
  const [isOpen, setIsOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Get the active field from our global multi-field provider
  const { activeField, activeFieldLabel, activeFieldIcon } = useField();

  const [input, setInput] = useState("");
  const { messages, sendMessage, status, clearError } = useChat({
    api: "/api/chat",
    body: { field: activeField },
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        parts: [{ type: "text", text: `Hi! I'm your AI Admission Assistant. How can I help you supercharge your ${activeFieldLabel} application today?` }],
      },
    ],
  });

  const isLoading = status === "submitted" || status === "streaming";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
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

  const quickActions = [
    { label: "MMI Tips", icon: Zap },
    { label: "Personal Statement Review", icon: MessageSquare },
    { label: "Application Strategy", icon: Sparkles },
  ];

  return (
    <>
      {/* Floating Trigger */}
      <motion.button
        whileHover={{ scale: 1.05, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 h-16 w-16 bg-gradient-to-br from-indigo-600 via-primary-600 to-emerald-500 rounded-full shadow-2xl z-[9999] flex items-center justify-center text-white border-2 border-white/20 backdrop-blur-sm"
      >
        {isOpen ? <X className="h-8 w-8" /> : <Bot className="h-8 w-8" />}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute -top-1 -right-1 h-4 w-4 bg-emerald-400 rounded-full border-2 border-white"
        />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-[380px] h-[550px] bg-white/80 backdrop-blur-2xl border border-white/40 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-[9998] overflow-hidden flex flex-col font-sans"
          >
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-indigo-600/10 to-primary-600/10 border-b border-white/40 flex items-center gap-4">
              <div className="h-12 w-12 bg-gradient-to-br from-indigo-500 to-primary-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary-200 text-xl">
                {activeFieldIcon}
              </div>
              <div>
                <h3 className="text-gray-900 font-bold tracking-tight">AI {activeFieldLabel} Hub</h3>
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Powered by Groq</span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth"
            >
              {messages.map((msg, idx) => (
                <motion.div
                  initial={{ opacity: 0, x: msg.role === "user" ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={msg.id || idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] p-4 rounded-2xl ${
                      msg.role === "user"
                        ? "bg-primary-600 text-white shadow-lg shadow-primary-100 rounded-tr-none"
                        : "bg-white text-gray-700 shadow-sm border border-gray-100 rounded-tl-none"
                    }`}
                  >
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">
                      {msg.parts ? msg.parts.map((part) => part.type === "text" ? (part as { text: string }).text : null) : msg.content}
                    </div>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 rounded-tl-none flex items-center gap-2">
                    <Loader2 className="h-4 w-4 text-primary-500 animate-spin" />
                    <span className="text-xs font-medium text-gray-400">Thinking...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="px-6 pb-2 flex gap-2 overflow-x-auto no-scrollbar">
              {quickActions.map((action, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage({ text: `Can you help me with: ${action.label}` })}
                  className="flex items-center gap-2 px-4 py-2 bg-white/60 hover:bg-white border border-gray-100 rounded-full text-xs font-bold text-gray-600 transition-all hover:shadow-md hover:text-primary-600 shrink-0"
                >
                  <action.icon className="h-3 w-3" />
                  {action.label}
                </button>
              ))}
            </div>

            {/* Input Footer */}
            <form onSubmit={handleSubmit} className="p-6 pt-2">
              <div className="relative flex items-center">
                <Input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ask anything about admissions..."
                  className="bg-white border-gray-100 h-14 pl-5 pr-14 rounded-2xl shadow-inner border-0 ring-1 ring-gray-100 focus-visible:ring-primary-400 transition-all placeholder:text-gray-300 font-medium"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 h-10 w-10 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-xl flex items-center justify-center transition-all shadow-lg shadow-primary-100"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

