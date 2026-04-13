import { useState, useEffect, useRef, useCallback } from "react";
import { ChatMessage, ConversationParticipant } from "@/src/connection/api-types";
import { chatService } from "@/src/connection/chat-service";
import { MessageBubble } from "./MessageBubble";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { toast } from "sonner";

interface ChatWindowProps {
  selectedConversation: ConversationParticipant;
  currentUserEmail: string;
}

export function ChatWindow({ selectedConversation, currentUserEmail }: ChatWindowProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchMessages = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await chatService.getConversationMessages(selectedConversation.conversationId);
      if (response.responseData && response.responseData.content) {
        setMessages(response.responseData.content.reverse()); // Show oldest first for chat flow
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load messages");
    } finally {
      setIsLoading(false);
    }
  }, [selectedConversation.conversationId]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages();
    }
  }, [selectedConversation, fetchMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageContent = newMessage.trim();
    setNewMessage("");

    // Optimistic UI Update
    const temporaryId = `temp-${Date.now()}`;
    const optimisticMessage: ChatMessage = {
      id: temporaryId,
      conversationId: selectedConversation.conversationId,
      senderEmail: currentUserEmail,
      senderName: "Me", // Will be replaced by real data on fetch
      senderType: "USER",
      message: messageContent,
      attachmentUrls: [],
      createdAt: new Date().toISOString(),
    };

    setMessages(prev => [...prev, optimisticMessage]);

    try {
      await chatService.sendMessage({
        conversationId: selectedConversation.conversationId,
        message: messageContent,
      });
      // Optionally re-fetch to get the real ID and server timestamp
      fetchMessages();
    } catch (error) {
      console.error(error);
      toast.error("Failed to send message. Please try again.");
      // Rollback optimistic update
      setMessages(prev => prev.filter(msg => msg.id !== temporaryId));
      setNewMessage(messageContent); // Restore input
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold">
          {selectedConversation.participantName.substring(0, 2).toUpperCase()}
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-900">
            {selectedConversation.participantName}
          </h4>
          <p className="text-[10px] text-green-500 font-medium uppercase tracking-wider">
            Online
          </p>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50/50"
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-6 w-6 text-primary-600 animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <p className="text-sm text-center px-8">
              Start a conversation with {selectedConversation.participantName}
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble 
              key={msg.id} 
              message={msg} 
              isOwnMessage={msg.senderEmail === currentUserEmail} 
            />
          ))
        )}
      </div>

      {/* Input */}
      <form 
        onSubmit={handleSendMessage}
        className="p-4 border-t border-gray-100 bg-white flex gap-2"
      >
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="bg-gray-50 border-gray-200"
        />
        <Button 
          type="submit" 
          disabled={!newMessage.trim()}
          className="bg-primary-600 hover:bg-primary-700 text-white"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
