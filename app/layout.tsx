import type { Metadata } from "next";
import { Big_Shoulders_Display, Archivo, JetBrains_Mono } from "next/font/google";
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

const TITLE = "College Flag Showcase Series | Girls Flag Football Recruiting Tour";
const DESCRIPTION =
  "The College Flag Showcase Series pairs a verified combine with a college showcase tournament — girls flag football athletes tested, seen, and recruited at premier venues nationwide.";

export const metadata: Metadata = {
  metadataBase: new URL("https://collegeflagshowcase.com"),
  title: TITLE,
  description: DESCRIPTION,
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/",
    siteName: "College Flag Showcase Series",
    type: "website",
    images: [{ url: "/logo.png", width: 192, height: 192 }],
  },
  twitter: {
    card: "summary",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
