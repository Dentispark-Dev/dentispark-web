"use client";

import { useOffline } from "@/src/hooks/use-offline";
import { WifiOff, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export function OfflineBanner() {
  const { isOffline } = useOffline();
  const [showReconnected, setShowReconnected] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    if (isOffline) {
      setWasOffline(true);
    } else if (wasOffline && !isOffline) {
      setShowReconnected(true);
      const timer = setTimeout(() => {
        setShowReconnected(false);
        setWasOffline(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOffline, wasOffline]);

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          key="offline"
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-0 left-0 right-0 z-[200] flex items-center justify-center py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold shadow-lg"
        >
          <WifiOff className="w-4 h-4 mr-2 shrink-0" />
          <span>You&apos;re offline. Showing cached data — changes will sync when you reconnect.</span>
        </motion.div>
      )}
      {!isOffline && showReconnected && (
        <motion.div
          key="reconnected"
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-0 left-0 right-0 z-[200] flex items-center justify-center py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold shadow-lg"
        >
          <CheckCircle2 className="w-4 h-4 mr-2 shrink-0" />
          <span>Back online! Syncing your data now…</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
