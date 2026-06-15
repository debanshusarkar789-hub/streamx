"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import SearchDropdown from "./SearchDropdown";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={sentinelRef} className="h-px w-px" />
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-black shadow-lg shadow-black/50" : "bg-gradient-to-b from-black/90 via-black/50 to-transparent"
        }`}
      >
        <div className="px-4 md:px-12 h-16 flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-2 shrink-0 hover:opacity-80 transition"
          >
            <img src="/logo.png" alt="StreamX" className="h-8 md:h-9 w-auto" />
            <span className="text-xl md:text-2xl font-cinzel font-bold text-red-600 tracking-wider">STREAMX</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium">
            <Link href="/" className="text-white hover:text-zinc-300 transition">Home</Link>
            <Link href="/?category=popular" className="text-zinc-400 hover:text-white transition">Popular</Link>
            <Link href="/?category=top_rated" className="text-zinc-400 hover:text-white transition">Top Rated</Link>
            <Link href="/?category=upcoming" className="text-zinc-400 hover:text-white transition">Upcoming</Link>
          </nav>

          <div className="ml-auto flex items-center gap-4">
            {searchOpen ? (
              <div className="flex items-center gap-2">
                <SearchDropdown onClose={() => setSearchOpen(false)} />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="text-zinc-400 hover:text-white transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="text-zinc-400 hover:text-white transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
