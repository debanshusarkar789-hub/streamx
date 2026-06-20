"use client";

import { useEffect } from "react";

export function useLandscapeLock() {
  useEffect(() => {
    const lock = async () => {
      try {
        if (typeof window !== "undefined" && "orientation" in screen && "lock" in screen.orientation) {
          await (screen.orientation as any).lock("landscape");
        }
      } catch {}
    };
    lock();
    return () => {
      try {
        if (typeof window !== "undefined" && "orientation" in screen && "unlock" in screen.orientation) {
          (screen.orientation as any).unlock();
        }
      } catch {}
    };
  }, []);
}
