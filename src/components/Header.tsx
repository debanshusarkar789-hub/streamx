"use client";

import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const SearchDropdown = dynamic(() => import("./SearchDropdown"), {
  loading: () => <div className="w-56 md:w-80 h-9 bg-zinc-900 rounded-lg animate-pulse" />,
});

const navItems = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/favorites", label: "Favorites", icon: "heart" },
  { href: "/?category=tv", label: "Web Series", icon: "tv" },
  { href: "/live-tv", label: "Live TV", icon: "live" },
];

function NavIcon({ icon, active }: { icon: string; active: boolean }) {
  const cls = active ? "text-red-500" : "text-zinc-500 group-hover:text-white";
  switch (icon) {
    case "home":
      return (
        <svg className={`w-5 h-5 md:w-4 md:h-4 ${cls} transition`} fill={active ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 0 : 2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      );
    case "heart":
      return (
        <svg className={`w-5 h-5 md:w-4 md:h-4 ${cls} transition`} fill={active ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 0 : 2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      );
    case "tv":
      return (
        <svg className={`w-5 h-5 md:w-4 md:h-4 ${cls} transition`} fill={active ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 0 : 2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      );
    case "live":
      return (
        <svg className={`w-5 h-5 md:w-4 md:h-4 ${cls} transition`} fill={active ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 0 : 1.5} d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchParams, setSearchParams] = useState("");
  const sentinelRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isWatchPage = pathname.startsWith("/watch/");

  useEffect(() => {
    setSearchParams(window.location.search);
  }, []);

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

  if (isWatchPage) return null;

  return (
    <>
      <div ref={sentinelRef} className="h-px w-px" />

      {/* Desktop top nav */}
      <header className={`fixed top-0 left-0 right-0 z-50 hidden md:block transition-all duration-300 ${scrolled ? "bg-black/95 shadow-lg shadow-black/50 backdrop-blur-sm" : "bg-gradient-to-b from-black/90 via-black/50 to-transparent"}`}>
        <div className="px-8 h-16 flex items-center gap-8 max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-2 shrink-0 hover:opacity-80 transition">
            <Image src="/logo.png" alt="StreamX" width={32} height={32} className="h-8 w-auto" />
            <span className="text-xl font-cinzel font-bold text-red-600 tracking-wider">STREAMX</span>
          </Link>

          <nav className="flex items-center gap-1 ml-4">
            {navItems.map((item) => {
              const isHome = item.href === "/";
              const isWebSeries = item.href === "/?category=tv";
              const webSeriesActive = isWebSeries && pathname === "/" && searchParams === "?category=tv";
              const normalActive = pathname === item.href || (!isHome && !isWebSeries && pathname.startsWith(item.href));
              const active = isHome ? pathname === "/" : isWebSeries ? webSeriesActive : normalActive;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 group ${
                    active ? "bg-red-600/15 text-red-400" : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <NavIcon icon={item.icon} active={active} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-3">
            {searchOpen ? (
              <div className="flex items-center gap-2">
                <SearchDropdown onClose={() => setSearchOpen(false)} />
                <button onClick={() => setSearchOpen(false)} className="text-zinc-400 hover:text-white transition p-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            ) : (
              <button onClick={() => setSearchOpen(true)} className="text-zinc-400 hover:text-white transition p-2 rounded-lg hover:bg-white/5">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-black/95 backdrop-blur-lg border-t border-zinc-900/80 safe-area-bottom">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map((item) => {
              const isHome = item.href === "/";
              const isWebSeries = item.href === "/?category=tv";
              const webSeriesActive = isWebSeries && pathname === "/" && searchParams === "?category=tv";
              const normalActive = pathname === item.href || (!isHome && !isWebSeries && pathname.startsWith(item.href));
              const active = isHome ? pathname === "/" : isWebSeries ? webSeriesActive : normalActive;
              return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 group ${
                  active ? "text-red-500" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <NavIcon icon={item.icon} active={active} />
                <span className={`text-[10px] font-medium ${active ? "text-red-500" : "text-zinc-500 group-hover:text-zinc-300"}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
          {/* Search button */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-zinc-500 hover:text-zinc-300 transition-all group"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-[10px] font-medium">Search</span>
          </button>
        </div>
      </nav>

      {/* Mobile search modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-[999] md:hidden">
          <div className="absolute inset-0 bg-black/80" onClick={() => setSearchOpen(false)} />
          <div className="relative mt-16 mx-4">
            <SearchDropdown onClose={() => setSearchOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
