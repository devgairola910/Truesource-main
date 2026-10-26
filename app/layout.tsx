import type { Metadata } from "next";
import { LastVisitedTracker } from "@/components/auth/last-visited-tracker";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import { LayoutShell } from "@/components/layout/layout-shell";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TrueSource | Protect Media Integrity",
  description:
    "A multi-page website for content integrity services, workflows, and insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <LastVisitedTracker />
        <LayoutShell>{children}</LayoutShell>
        <Analytics />
      </body>
    </html>
  );
}

