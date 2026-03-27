"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Send, Paperclip, Smile, MoreVertical, Phone, Video, Mic, CheckCheck } from "lucide-react";

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
      <div className="bg-white p-4 border-b border-gray-100 flex justify-between items-center relative z-10 shadow-sm">
        <Link href="/mentor/sarah-chen" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-700 border border-emerald-50">
            SC
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 leading-tight">Dr. Sarah Chen</h3>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-medium text-emerald-600 font-bold uppercase tracking-wider">online</span>
            </div>
          </div>
        </Link>
        
        <div className="flex items-center gap-1">
          <button className="p-2.5 hover:bg-gray-50 rounded-xl transition-all text-gray-400 hover:text-gray-900"><MoreVertical className="w-5 h-5" /></button>
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
                "relative px-4 py-2 rounded-2xl text-[14px] font-medium leading-[1.5] shadow-sm",
                isMe 
                  ? "bg-emerald-600 text-white rounded-tr-none" 
                  : "bg-white text-gray-800 rounded-tl-none border border-gray-100",
                !isFirstFromSender && (isMe ? "rounded-tr-2xl" : "rounded-tl-2xl")
              )}>
                {/* Bubble Tail */}
                {isFirstFromSender && (
                  <div className={cn(
                    "absolute top-0 w-2.5 h-3",
                    isMe 
                      ? "-right-2 bg-emerald-600 [clip-path:polygon(0_0,0_100%,100%_0)]" 
                      : "-left-2 bg-white border-gray-100 [clip-path:polygon(100%_0,100%_100%,0_0)]"
                  )} />
                )}
                
                <div className="flex items-end gap-3 flex-wrap">
                  <span className="flex-1 whitespace-pre-wrap">{msg.text}</span>
                  <div className="flex items-center gap-1 self-end mb-[-4px]">
                    <span className={cn(
                        "text-[9px] uppercase font-bold tracking-wider",
                        isMe ? "text-emerald-100" : "text-gray-400"
                    )}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                    </span>
                    {isMe && <CheckCheck className="w-3.5 h-3.5 text-emerald-200" />}
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
            className="flex items-center gap-2 text-emerald-600/60 font-bold text-[10px] uppercase mt-4 mb-2 ml-2"
          >
             <div className="flex gap-1">
                <div className="w-1 h-1 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-1 h-1 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-1 h-1 bg-emerald-400 rounded-full animate-bounce" />
            </div>
            Dr. Sarah is typing...
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-50 relative z-10">
        <div className="flex items-center gap-3 max-w-[1200px] mx-auto">
          <div className="flex items-center gap-1">
            <button className="p-2 hover:bg-gray-50 rounded-xl transition-colors text-gray-400"><Smile className="w-6 h-6" /></button>
            <button className="p-2 hover:bg-gray-50 rounded-xl transition-colors text-gray-400"><Paperclip className="w-6 h-6" /></button>
          </div>
          
          <div className="flex-1 bg-gray-50 rounded-2xl px-5 flex items-center border border-gray-100 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/5 transition-all">
            <input 
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              className="w-full bg-transparent py-3.5 text-[14px] font-medium focus:outline-none placeholder:text-gray-400 text-gray-700"
            />
          </div>
          
          <button 
              onClick={handleSend}
              className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center hover:bg-emerald-700 shadow-md shadow-emerald-200/50 transition-all active:scale-95 flex-shrink-0"
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
