import type { Metadata } from "next";
import { Big_Shoulders_Display, Archivo, JetBrains_Mono } from "next/font/google";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import "./globals.css";

const display = Big_Shoulders_Display({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
});

const body = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-mono",
});

// Kept under SEO truncation limits: title ≤60 chars, description ≤155.
const TITLE = "College Flag Showcase | Girls Flag Football Recruiting Tour";
const DESCRIPTION =
  "A verified combine and college showcase tournament for girls flag football — get tested, get seen, and get recruited at premier venues nationwide.";

export const metadata: Metadata = {
  metadataBase: new URL("https://collegeflagshowcase.com"),
  title: TITLE,
  description: DESCRIPTION,
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  verification: {
    google: "3F9FMqcfUW-_997NluSEBwdB9nMGwc07_LzNNmu5FhM",
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/",
    siteName: "College Flag Showcase Series",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        {children}
        <GoogleAnalytics />
      </body>
    </html>
  );
}
