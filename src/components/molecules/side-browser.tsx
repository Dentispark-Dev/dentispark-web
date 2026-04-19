"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, RotateCcw, Maximize2, Loader2, ShieldCheck, AlertCircle } from "lucide-react";
import { useSideBrowserStore } from "@/src/store/side-browser-store";
import { Button } from "@/src/components/ui/button";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export function SideBrowser() {
  const { isOpen, url, title, closeBrowser } = useSideBrowserStore();
  const [mounted, setMounted] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setIsLoading(true);
      setShowFallback(false);
      
      // Auto-show fallback message after 6 seconds as a "just in case"
      const timer = setTimeout(() => {
        setShowFallback(true);
      }, 6000);
      
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = "unset";
      };
    }
  }, [isOpen, url, iframeKey]);

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
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest leading-none mb-1.5 flex items-center gap-1.5">
              <ShieldCheck className="size-3" />
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

        {/* Address Bar Area */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-100 flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <div className="flex-1 w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-400 truncate font-medium flex items-center gap-2">
             <div className={`size-2 rounded-full ${isLoading ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'}`} />
             {url}
          </div>
          <Button 
            onClick={handleOpenExternal}
            className="shrink-0 h-9 px-4 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-black-800 transition-all shadow-sm"
          >
            Open Direct Site
          </Button>
        </div>

        {/* Browser Content */}
        <div className="flex-1 bg-slate-100 relative overflow-hidden group">
          {isLoading && (
            <div className="absolute inset-0 z-20 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
                <Loader2 className="size-10 text-emerald-600 animate-spin mb-4" />
                <p className="text-sm font-bold text-slate-900">Establishing Secure Connection...</p>
                <p className="text-xs text-slate-500 mt-1">Institutional servers may take a moment to respond.</p>
            </div>
          )}

          <iframe
            key={iframeKey}
            src={url}
            className="w-full h-full bg-white"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            onLoad={() => {
              setIsLoading(false);
              console.log("Iframe Loaded");
            }}
          />
          
          {/* Note overlay for X-Frame-Options failures - Now integrated into a smarter notification */}
          <AnimatePresence>
            {showFallback && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-4rem)] z-30"
              >
                <div className="bg-slate-900/95 backdrop-blur text-white p-6 rounded-[2rem] shadow-2xl border border-white/10 text-center">
                    <AlertCircle className="size-8 text-amber-400 mx-auto mb-3" />
                    <p className="text-sm font-bold mb-1">Preview restricted?</p>
                    <p className="text-[11px] text-slate-300 mb-5 leading-relaxed">
                        High-security sites (NHS, UCAS, Government) often block being viewed inside other apps.
                    </p>
                    <Button onClick={handleOpenExternal} className="w-full bg-white text-slate-900 rounded-2xl h-11 text-xs font-bold uppercase tracking-wider">
                       Open in Full Window
                    </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
