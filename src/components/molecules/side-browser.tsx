"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, RotateCcw, Maximize2 } from "lucide-react";
import { useSideBrowserStore } from "@/src/store/side-browser-store";
import { Button } from "@/src/components/ui/button";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export function SideBrowser() {
  const { isOpen, url, title, closeBrowser } = useSideBrowserStore();
  const [mounted, setMounted] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleRefresh = () => {
    setIframeKey(prev => prev + 1);
  };

  const handleOpenExternal = () => {
    window.open(url, "_blank");
  };

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex justify-end font-jakarta">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeBrowser}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />

      {/* Side Panel */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="relative h-full w-full md:w-1/2 bg-white shadow-2xl flex flex-col border-l border-slate-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white z-10 shrink-0">
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest leading-none mb-1.5">
              Secure Preview Node
            </span>
            <h3 className="text-sm font-extrabold text-slate-900 truncate">
              {title}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              className="h-9 w-9 rounded-xl text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
              title="Refresh Frame"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleOpenExternal}
              className="h-9 w-9 rounded-xl text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-all"
              title="Open in New Tab"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
            <div className="w-px h-6 bg-slate-100 mx-1" />
            <Button
              variant="ghost"
              size="icon"
              onClick={closeBrowser}
              className="h-9 w-9 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Address Bar (Static/Read-only for context) */}
        <div className="px-6 py-2 bg-slate-50 border-b border-slate-100 flex items-center gap-3 shrink-0">
          <div className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-400 truncate font-medium flex items-center gap-2">
             <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
             {url}
          </div>
        </div>

        {/* Browser Content */}
        <div className="flex-1 bg-slate-100 relative overflow-hidden">
          <iframe
            key={iframeKey}
            src={url}
            className="w-full h-full bg-white"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            onLoad={() => console.log("Iframe Loaded")}
          />
          
          {/* Note overlay for X-Frame-Options failures */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-12 text-center opacity-0 hover:opacity-100 transition-opacity">
            <div className="bg-white/90 backdrop-blur p-8 rounded-3xl shadow-xl border border-slate-200 max-w-sm pointer-events-auto">
                <Maximize2 className="size-12 text-slate-300 mx-auto mb-4" />
                <p className="text-sm font-bold text-slate-900 mb-2">Can't see the content?</p>
                <p className="text-xs text-slate-500 mb-6 leading-relaxed">Some high-security websites (like UCAS or Banking portals) block being viewed in side-panels.</p>
                <Button onClick={handleOpenExternal} className="w-full bg-slate-900 text-white rounded-2xl h-12">
                   Open Direct Site
                </Button>
            </div>
          </div>
        </div>

        {/* Footer / Status Bar */}
        <div className="px-6 py-3 border-t border-slate-100 bg-white flex items-center justify-between shrink-0">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <div className="size-1.5 rounded-full bg-emerald-500" />
                Preview Mode Active
            </p>
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                DENTISPARK SECURE HUB
            </p>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}
