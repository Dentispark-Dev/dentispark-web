import { SuccessStory } from "../types";
import Image from "next/image";
import { Quote } from "lucide-react";

interface SuccessStoryCardProps {
  story: SuccessStory;
}

export function SuccessStoryCard({ story }: SuccessStoryCardProps) {
  return (
    <div className="group cursor-pointer">
      <div className="space-y-4">
        <div className="relative">
          <div className="absolute -left-2 -top-2 text-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity">
            <Quote className="w-8 h-8 fill-blue-500/10" />
          </div>
          <p className="text-sm font-medium text-gray-600 leading-relaxed font-jakarta line-clamp-3 italic">
            &quot;{story.title}&quot;
          </p>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <div className="w-10 h-10 rounded-xl bg-gray-100 overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
             {story.avatar ? (
                <Image
                  width={40}
                  height={40}
                  src={story.avatar}
                  className="object-cover w-full h-full"
                  alt={story.author}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-600 font-bold text-xs uppercase">
                    {story.author.split(" ").map(n => n[0]).join("")}
                </div>
              )}
          </div>
          <div>
            <p className="text-xs font-bold text-gray-900 font-jakarta uppercase tracking-wider">
              {story.author}
            </p>
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-tight">
              {story.location}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
