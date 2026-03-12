"use client";

import { useState, useEffect, useCallback } from "react";

export interface Message {
  id: string;
  text: string;
  sender: "student" | "mentor";
  timestamp: string;
}

export function useChatSocket(mentorId: string) {
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", text: "Hi! How can I help you with your application today?", sender: "mentor", timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
    { id: "2", text: "I'm struggling with my MMI reflection for my work experience.", sender: "student", timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline] = useState(true);

  const sendMessage = useCallback((text: string) => {
    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      text,
      sender: "student",
      timestamp: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, newMessage]);

    // Simulate Mentor Auto-Response
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const response: Message = {
          id: Math.random().toString(36).substr(2, 9),
          text: "That's a common challenge. Focus on what you observed about the dentist's communication with the patient rather than just the procedure itself.",
          sender: "mentor",
          timestamp: new Date().toISOString(),
        };
        setMessages(prev => [...prev, response]);
      }, 2500);
    }, 1000);
  }, []);

  return { messages, isTyping, isOnline, sendMessage };
}
