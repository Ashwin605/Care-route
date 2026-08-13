import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { NetworkStateProvider } from "@/contexts/NetworkStateContext";
import RouteGuard from "@/components/auth/RouteGuard";
import DemoSwitcher from "@/components/demo/DemoSwitcher";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CARE ROUTE — Predictive Healthcare Referral & Capacity Management",
  description:
    "Intelligent healthcare referral orchestration. Don't just find the nearest hospital — find the right hospital at the right time. Capacity-aware, AI-assisted professional decision support.",
  keywords: [
    "healthcare referral",
    "hospital capacity",
    "predictive healthcare",
    "patient transfer",
    "capacity management",
    "hospital coordination",
  ],
  openGraph: {
    title: "CARE ROUTE — The Right Care. At the Right Time.",
    description:
      "Predictive healthcare referral orchestration for faster, capacity-aware hospital coordination.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <NetworkStateProvider>
            <RouteGuard>
              {children}
              <DemoSwitcher />
            </RouteGuard>
          </NetworkStateProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
