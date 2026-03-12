"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Paperclip, Smile, MoreVertical, Phone, Video } from "lucide-react";
import { useChatSocket } from "../hooks/use-chat-socket";
import { cn } from "@/src/lib/utils";

export function ChatWindow() {
  const { messages, isTyping, isOnline, sendMessage } = useChatSocket("1");
  const [inputText, setInputText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendMessage(inputText);
    setInputText("");
  };

  return (
    <div className="flex-1 h-full flex flex-col bg-greys-50 rounded-tr-[3rem] overflow-hidden">
      {/* Header */}
      <div className="bg-white p-6 border-b border-greys-100 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary-100 flex items-center justify-center font-black text-primary-600">
            SC
          </div>
          <div>
            <h3 className="text-lg font-black text-black-900 tracking-tight">Dr. Sarah Chen</h3>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-[10px] font-black text-black-400 uppercase tracking-widest">Active Now</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="p-3 hover:bg-greys-50 rounded-2xl transition-all text-black-400"><Phone className="w-5 h-5" /></button>
          <button className="p-3 hover:bg-greys-50 rounded-2xl transition-all text-black-400"><Video className="w-5 h-5" /></button>
          <button className="p-3 hover:bg-greys-50 rounded-2xl transition-all text-black-400"><MoreVertical className="w-5 h-5" /></button>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6">
        {messages.map((msg, i) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={cn(
              "flex flex-col max-w-[70%]",
              msg.sender === "student" ? "ml-auto items-end" : "items-start"
            )}
          >
            <div className={cn(
              "px-6 py-4 rounded-[2rem] text-sm font-medium leading-relaxed shadow-sm",
              msg.sender === "student" 
                ? "bg-primary-600 text-white rounded-br-none" 
                : "bg-white text-black-700 border border-greys-100 rounded-bl-none"
            )}>
              {msg.text}
            </div>
            <span className="text-[10px] font-bold text-black-300 uppercase mt-2 px-2">
              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </motion.div>
        ))}

        {isTyping && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-black-300 font-bold text-xs"
          >
            <div className="flex gap-1 animate-pulse">
                <div className="w-1.5 h-1.5 bg-black-300 rounded-full" />
                <div className="w-1.5 h-1.5 bg-black-300 rounded-full" />
                <div className="w-1.5 h-1.5 bg-black-300 rounded-full" />
            </div>
            Dr. Sarah is typing...
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="p-8 bg-white border-t border-greys-100">
        <div className="flex items-center gap-4 bg-greys-50 p-2 pl-6 rounded-[2rem] border border-greys-100 focus-within:border-primary-300 transition-all">
          <input 
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message to Sarah..."
            className="flex-1 bg-transparent py-4 text-sm font-medium focus:outline-none"
          />
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-greys-200 rounded-full transition-colors text-black-400"><Paperclip className="w-5 h-5" /></button>
            <button className="p-2 hover:bg-greys-200 rounded-full transition-colors text-black-400"><Smile className="w-5 h-5" /></button>
            <button 
                onClick={handleSend}
                className="w-12 h-12 bg-primary-600 text-white rounded-2xl flex items-center justify-center hover:bg-primary-700 shadow-lg shadow-primary-200 transition-all"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
