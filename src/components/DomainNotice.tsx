"use client";

import { useState, useEffect } from "react";

const DOMAINS: Record<string, string> = {
  "streamx.edgeone.dev": "streamx1.vercel.app",
  "streamx1.vercel.app": "streamx.edgeone.dev",
};

export default function DomainNotice() {
  const [dismissed, setDismissed] = useState(true);
  const [other, setOther] = useState("");

  useEffect(() => {
    const host = window.location.hostname;
    const alt = DOMAINS[host];
    if (alt) {
      setOther(alt);
      setDismissed(false);
    }
  }, []);

  if (dismissed) return null;

  return (
    <div className="bg-yellow-600/90 text-black text-center text-xs py-2 px-4 flex items-center justify-center gap-3">
      <span>
        Having issues? Try{" "}
        <a
          href={`https://${other}`}
          className="font-bold underline hover:text-white"
        >
          {other}
        </a>
      </span>
      <button
        onClick={() => setDismissed(true)}
        className="shrink-0 w-5 h-5 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-xs font-bold"
      >
        &times;
      </button>
    </div>
  );
}
