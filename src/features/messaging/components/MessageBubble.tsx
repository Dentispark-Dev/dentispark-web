import { ChatMessage } from "@/src/connection/api-types";
import { cn } from "@/src/lib/utils";
import { format } from "date-fns";

interface MessageBubbleProps {
  message: ChatMessage;
  isOwnMessage: boolean;
}

export function MessageBubble({ message, isOwnMessage }: MessageBubbleProps) {
  return (
    <div
      className={cn(
        "flex w-full mb-4",
        isOwnMessage ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[70%] rounded-2xl px-4 py-2 shadow-sm",
          isOwnMessage
            ? "bg-primary-600 text-white rounded-tr-none"
            : "bg-gray-100 text-gray-900 rounded-tl-none"
        )}
      >
        {!isOwnMessage && (
          <p className="text-[10px] font-bold opacity-70 mb-1 uppercase tracking-wider">
            {message.senderName}
          </p>
        )}
        <p className="text-sm whitespace-pre-wrap break-words">
          {message.message}
        </p>
        <div
          className={cn(
            "text-[10px] mt-1 opacity-70 flex justify-end",
            isOwnMessage ? "text-primary-100" : "text-gray-500"
          )}
        >
          {format(new Date(message.createdAt), "HH:mm")}
        </div>
      </div>
    </div>
  );
}
