"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function SplashScreen() {
  const [show, setShow] = useState(true);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const hasSeen = sessionStorage.getItem("streamx_splash_seen");
    if (hasSeen) {
      setShow(false);
      return;
    }
    const timer1 = setTimeout(() => setFade(true), 2000);
    const timer2 = setTimeout(() => {
      setShow(false);
      sessionStorage.setItem("streamx_splash_seen", "1");
    }, 2500);
    return () => { clearTimeout(timer1); clearTimeout(timer2); };
  }, []);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-black transition-opacity duration-500 ${fade ? "opacity-0 pointer-events-none" : "opacity-100"}`}
    >
      <Image src="/logo.png" alt="StreamX" width={128} height={128} className="w-24 h-24 md:w-32 md:h-32 object-contain animate-pulse" priority />
    </div>
  );
}
