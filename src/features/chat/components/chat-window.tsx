"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Paperclip, Smile, MoreVertical, Phone, Video, Mic, CheckCheck } from "lucide-react";
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
    <div className="flex-1 h-full flex flex-col bg-[#efeae2] relative overflow-hidden font-sora">
      {/* WhatsApp Doodle Background Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 800 800'%3E%3Cg fill='none' stroke='%23000' stroke-width='1'%3E%3Cpath d='M769 229L1037 260.9M927 880L731 737 520 660 309 538 40 599 233 492 442 340 195 516 0 620'/%3E%3Ccircle cx='477' cy='188' r='142'/%3E%3Ccircle cx='219' cy='431' r='100'/%3E%3Ccircle cx='700' cy='600' r='50'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '400px 400px'
        }}
      />

      {/* Header */}
      <div className="bg-[#f0f2f5] p-3 border-b border-gray-200 flex justify-between items-center relative z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-700 border border-emerald-50">
            SC
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 leading-tight">Dr. Sarah Chen</h3>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-medium text-gray-500">online</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <button className="p-2 hover:bg-gray-200 rounded-full transition-all text-[#54656f]"><Video className="w-5 h-5" /></button>
          <button className="p-2 hover:bg-gray-200 rounded-full transition-all text-[#54656f]"><Phone className="w-5 h-5" /></button>
          <button className="p-2 hover:bg-gray-200 rounded-full transition-all text-[#54656f]"><MoreVertical className="w-5 h-5" /></button>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-2 relative z-10 custom-scrollbar">
        {messages.map((msg, i) => {
          const isMe = msg.sender === "student";
          const isFirstFromSender = i === 0 || messages[i-1].sender !== msg.sender;
          
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex flex-col max-w-[85%] lg:max-w-[65%] mb-1",
                isMe ? "ml-auto items-end" : "items-start",
                isFirstFromSender ? "mt-4" : "mt-0.5"
              )}
            >
              <div className={cn(
                "relative px-3 py-1.5 rounded-xl text-[14.5px] font-medium leading-[1.4] shadow-[0_1px_0.5px_rgba(0,0,0,0.13)]",
                isMe 
                  ? "bg-[#d9fdd3] text-[#111b21] rounded-tr-none" 
                  : "bg-white text-[#111b21] rounded-tl-none",
                !isFirstFromSender && (isMe ? "rounded-tr-xl" : "rounded-tl-xl")
              )}>
                {/* Bubble Tail */}
                {isFirstFromSender && (
                  <div className={cn(
                    "absolute top-0 w-2.5 h-3",
                    isMe 
                      ? "-right-2 bg-[#d9fdd3] [clip-path:polygon(0_0,0_100%,100%_0)]" 
                      : "-left-2 bg-white [clip-path:polygon(100%_0,100%_100%,0_0)]"
                  )} />
                )}
                
                <div className="flex items-end gap-2 flex-wrap">
                  <span className="flex-1 whitespace-pre-wrap">{msg.text}</span>
                  <div className="flex items-center gap-1 self-end mb-[-2px]">
                    <span className="text-[10px] text-[#667781] uppercase font-bold">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                    </span>
                    {isMe && <CheckCheck className="w-3.5 h-3.5 text-sky-400" />}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}

        {isTyping && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-gray-400 font-bold text-[11px] uppercase mt-4 mb-2 ml-2"
          >
             <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" />
            </div>
            Dr. Sarah is typing...
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 bg-[#f0f2f5] relative z-10">
        <div className="flex items-center gap-2 max-w-[1200px] mx-auto">
          <div className="flex items-center">
            <button className="p-2.5 hover:bg-gray-200 rounded-full transition-colors text-[#54656f]"><Smile className="w-6 h-6" /></button>
            <button className="p-2.5 hover:bg-gray-200 rounded-full transition-colors text-[#54656f]"><Paperclip className="w-6 h-6" /></button>
          </div>
          
          <div className="flex-1 bg-white rounded-xl shadow-sm px-4 flex items-center">
            <input 
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a message"
              className="w-full bg-transparent py-3 text-[15px] font-normal focus:outline-none placeholder:text-gray-400 text-gray-800"
            />
          </div>
          
          <button 
              onClick={handleSend}
              className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center hover:bg-emerald-700 shadow-md transition-all active:scale-95 flex-shrink-0"
          >
            {inputText.trim() ? <Send className="w-5 h-5 ml-0.5" /> : <Mic className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.1);
          border-radius: 10px;
        }
        .no-scrollbar::-webkit-scrollbar {
            display: none;
        }
      `}</style>
    </div>
  );
}
