"use client";

import { useState, useEffect, useCallback } from "react";
import { cacheRead, cacheWrite, STORES } from "@/src/lib/offline-cache";

/**
 * useOffline — react hook that tracks network status and exposes
 * helpers for reading data from IndexedDB when offline.
 */
export function useOffline() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const update = () => setIsOffline(!navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  const readFromCache = useCallback(
    <T>(store: keyof typeof STORES, id: string): Promise<T | null> =>
      cacheRead<T>(store, id),
    []
  );

  const writeToCache = useCallback(
    <T extends { id: string }>(store: keyof typeof STORES, data: T) =>
      cacheWrite<T>(store, data),
    []
  );

  return { isOffline, readFromCache, writeToCache };
}
