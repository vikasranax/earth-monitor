import type { Metadata } from "next";
import type { ReactNode } from "react";
import { fontVariables } from "@/lib/fonts";
import { serverEnv } from "@/lib/env";
import { ErrorBoundary } from "@/components/error-boundary";
import { CopilotButton } from "@/components/copilot/CopilotButton";
import "./global.css";
import "leaflet/dist/leaflet.css"; // ← add this here

export const metadata: Metadata = {
  metadataBase: new URL(serverEnv.SITE_URL),
  title: {
    default: "JAGAT-MANTHAN — Global Intelligence Terminal",
    template: "%s · JAGAT-MANTHAN",
  },
  description:
    "जगत्-मन्थन — the churning of the world. Geopolitics, markets, shipping, airspace, disasters, cyber and space, ingested live and analysed by AI.",
  robots: { index: false, follow: false }, // public indexing switches on at M13 launch
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body className={`${fontVariables} min-h-screen font-body antialiased`}>
        <ErrorBoundary>{children}</ErrorBoundary>
        <CopilotButton />
      </body>
    </html>
  );
}
