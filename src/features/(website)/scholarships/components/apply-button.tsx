"use client";

import { Button } from "@/src/components/ui/button";
import { ExternalLink } from "lucide-react";
import { useSideBrowserStore } from "@/src/store/side-browser-store";

interface ScholarshipApplyButtonProps {
  url: string;
  scholarshipTitle: string;
  className?: string;
}

export function ScholarshipApplyButton({ url, scholarshipTitle, className }: ScholarshipApplyButtonProps) {
  const { openBrowser } = useSideBrowserStore();

  return (
    <Button 
      size="lg" 
      className={className || "h-16 px-10 rounded-2xl shadow-2xl shadow-primary-600/30 text-lg font-extrabold bg-primary-600 hover:bg-primary-700 transition-all hover:scale-[1.02]"}
      onClick={() => openBrowser(url, `${scholarshipTitle} Application`)}
    >
      <div className="flex items-center justify-center gap-3">
        Apply on Official Website
        <ExternalLink className="h-5 w-5" />
      </div>
    </Button>
  );
}
