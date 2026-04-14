import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vishesh Chawan — AI & Backend Developer",
  description:
    "AI & Backend Developer from Hyderabad. LLM engineer, RAG architect, full-stack builder. Skilled in Python, FastAPI, Docker, and GCP.",
  keywords: [
    "Vishesh Chawan",
    "AI Developer",
    "Backend Developer",
    "LLM Engineer",
    "RAG Architect",
    "Python",
    "FastAPI",
    "Docker",
    "GCP",
    "Hyderabad",
  ],
  authors: [{ name: "Vishesh Chawan", url: "https://github.com/visheshchawan" }],
  openGraph: {
    title: "Vishesh Chawan — AI & Backend Developer",
    description:
      "AI & Backend Developer from Hyderabad. LLM engineer, RAG architect, full-stack builder.",
    type: "website",
    locale: "en_IN",
    siteName: "Vishesh Chawan Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vishesh Chawan — AI & Backend Developer",
    description:
      "AI & Backend Developer from Hyderabad. LLM engineer, RAG architect, full-stack builder.",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

import ThemeSyncer from "@/components/admin/ThemeSyncer";
import MetaSyncer from "@/components/admin/MetaSyncer";
import AdminTrigger from "@/components/admin/AdminTrigger";
import ScrollObserver from "@/components/ScrollObserver";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <ThemeSyncer />
        <MetaSyncer />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full flex flex-col">
        <ScrollObserver />
        <AdminTrigger />
        {children}
      </body>
    </html>
  );
}
