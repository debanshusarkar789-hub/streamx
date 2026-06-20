import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Geist, Geist_Mono, Cinzel } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import SplashScreen from "@/components/SplashScreen";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "StreamX - Watch Movies & TV Shows",
  description: "Discover trending movies, check streaming availability, and find where to watch your favorite films.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${cinzel.variable}`}>
      <body className="bg-black text-zinc-100 min-h-screen flex flex-col antialiased" suppressHydrationWarning>
        <SplashScreen />
        <Header />
        <main className="flex-1 pb-16 md:pb-0">{children}</main>
        <footer className="border-t border-zinc-900 py-8 px-4 hidden md:block">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
              <Image src="/logo.png" alt="StreamX" width={28} height={28} className="h-6 md:h-7 w-auto" />
              <span className="text-lg font-cinzel font-bold text-red-600 tracking-wide">STREAMX</span>
            </Link>
            <p className="text-xs text-zinc-600 font-bold">&copy; {new Date().getFullYear()} StreamX &mdash; SF Technologies</p>
            <p className="text-[10px] text-zinc-700 font-bold">Powered by SeekForge Technologies &bull; Brought to you by RDX Debanshu</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
