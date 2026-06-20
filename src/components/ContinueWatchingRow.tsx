"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const ContinueWatchingRow = dynamic(() => import("./ContinueWatchingRowInner"), {
  ssr: false,
  loading: () => null,
});

export default function ContinueWatchingLazy() {
  return <ContinueWatchingRow />;
}
