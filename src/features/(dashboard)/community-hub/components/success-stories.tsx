import { SuccessStory } from "../types";
import { SuccessStoryCard } from "./success-story-card";

interface SuccessStoriesProps {
  stories: SuccessStory[];
}

import { TrendingUp, Award, Star } from "lucide-react";

export function SuccessStories({ stories }: SuccessStoriesProps) {
  const trendingTags = [
    { name: "UCAT Prep", count: 128 },
    { name: "Interview Tips", count: 85 },
    { name: "Dental Ethics", count: 64 },
    { name: "NHS Values", count: 42 },
  ];

  return (
    <div className="space-y-8">
      {/* Trending Topics */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-center gap-2 px-1">
          <TrendingUp className="w-5 h-5 text-emerald-600" />
          <h2 className="text-lg font-bold text-gray-900 font-jakarta">Trending Topics</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {trendingTags.map((tag) => (
            <button key={tag.name} className="flex items-center gap-2 bg-gray-50 hover:bg-emerald-50 text-gray-600 hover:text-emerald-700 font-bold text-[10px] uppercase tracking-wider px-3 py-2 rounded-xl transition-all border border-transparent hover:border-emerald-100">
              #{tag.name}
              <span className="opacity-40">{tag.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Success Stories Sidebar */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6">
        <div className="flex items-center gap-2 px-1">
          <Award className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-bold text-gray-900 font-jakarta">Success Spotlights</h2>
        </div>

        <div className="space-y-6">
          {stories.map((story) => (
            <SuccessStoryCard key={story.id} story={story} />
          ))}
        </div>

        <button className="w-full py-3 rounded-2xl bg-blue-50 text-blue-700 text-xs font-bold hover:bg-blue-100 transition-all border border-blue-100 shadow-sm">
          Browse All Stories
        </button>
      </div>

      {/* Community Perks / Ads */}
      <div className="bg-emerald-600 rounded-3xl p-6 text-white relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-2xl rounded-full -mr-10 -mt-10 group-hover:scale-110 transition-transform" />
        <div className="relative z-10 space-y-4">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Star className="w-5 h-5 fill-white" />
          </div>
          <div className="space-y-1">
             <h3 className="font-bold text-lg font-jakarta">Member Perk</h3>
             <p className="text-white/80 text-xs font-medium leading-relaxed">Get 15% off UCAT Mocks when you share your first helpful study insight!</p>
          </div>
          <button className="w-full py-2.5 bg-white text-emerald-600 rounded-xl font-bold text-xs hover:bg-emerald-50 transition-all shadow-sm">
            Claim Discount
          </button>
        </div>
      </div>
    </div>
  );
}
