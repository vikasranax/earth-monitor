import type { Metadata } from "next";
import type { ReactNode } from "react";
import { fontVariables } from "@/lib/fonts";
import { serverEnv } from "@/lib/env";
import { ErrorBoundary } from "@/components/error-boundary";
import { CopilotButton } from "@/components/copilot/CopilotButton";
import { AlertBanner } from "@/components/alerts/AlertBanner";
import "./global.css";
import "leaflet/dist/leaflet.css"; // ← add this here

export const metadata: Metadata = {
  metadataBase: new URL(serverEnv.SITE_URL),
  title: {
    default: "Earth Monitor (जगत्-मन्थन) — Global Intelligence Terminal",
    template: "%s · Earth Monitor",
  },
  description:
    "जगत्-मन्थन — the churning of the world. Real-time geopolitics, markets, shipping, airspace, disasters, power structure, and space — ingested live, fully open-source.",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Earth Monitor (जगत्-मन्थन)",
    description:
      "Real-time global intelligence terminal — geopolitics, markets, shipping, airspace, disasters, power structure, and space.",
    url: serverEnv.SITE_URL,
    siteName: "Earth Monitor",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Earth Monitor (जगत्-मन्थन)",
    description: "Real-time global intelligence terminal, open-source.",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body className={`${fontVariables} min-h-screen font-body antialiased`}>
        <AlertBanner />
        <ErrorBoundary>{children}</ErrorBoundary>
        <CopilotButton />
      </body>
    </html>
  );
}
