"use client";

import { useState, useEffect } from "react";

export default function SplashScreen() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const hasSeen = sessionStorage.getItem("streamx_splash_seen");
    if (hasSeen) {
      setShow(false);
      return;
    }
    const timer = setTimeout(() => {
      setShow(false);
      sessionStorage.setItem("streamx_splash_seen", "1");
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-black">
      <img src="/logo.png" alt="StreamX" className="w-24 h-24 md:w-32 md:h-32 object-contain animate-splash-glow" />
      <div className="mt-8 flex items-center gap-2">
        <svg className="animate-spin h-5 w-5 text-red-600" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <span className="text-zinc-600 text-xs tracking-widest uppercase animate-pulse">Loading</span>
      </div>
    </div>
  );
}
