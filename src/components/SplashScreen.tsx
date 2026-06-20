"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

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
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black splash-anim">
      <style jsx>{`
        .splash-anim {
          animation: splashFade 5s ease-in-out forwards;
        }
        .splash-anim img {
          animation: glowPulse 5s ease-in-out forwards;
        }
        @keyframes glowPulse {
          0% { filter: drop-shadow(0 0 10px rgba(255,0,0,0.6)) drop-shadow(0 0 30px rgba(255,0,0,0.4)); opacity: 1; transform: scale(1); }
          30% { filter: drop-shadow(0 0 20px rgba(255,0,0,0.9)) drop-shadow(0 0 50px rgba(255,0,0,0.6)); opacity: 1; transform: scale(1.05); }
          50% { filter: drop-shadow(0 0 15px rgba(255,0,0,0.5)) drop-shadow(0 0 40px rgba(255,0,0,0.3)); opacity: 0.9; transform: scale(0.98); }
          70% { filter: drop-shadow(0 0 8px rgba(255,0,0,0.3)) drop-shadow(0 0 20px rgba(255,0,0,0.2)); opacity: 0.7; }
          100% { filter: drop-shadow(0 0 0px rgba(255,0,0,0)) drop-shadow(0 0 0px rgba(255,0,0,0)); opacity: 0; transform: scale(0.9); }
        }
      `}</style>
      <Image src="/logo.png" alt="StreamX" width={128} height={128} className="w-24 h-24 md:w-32 md:h-32 object-contain" priority />
    </div>
  );
}
