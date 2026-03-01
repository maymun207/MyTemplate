import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { TimeThemeProvider } from "@/components/providers/TimeThemeProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#8B5CF6",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "AstroYou | Personal Insight & Energy System",
  description:
    "Three ancient wisdoms, one AI-powered oracle. Daily guidance synthesized from Western, Vedic & Chinese astrology.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "AstroYou",
  },
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${playfair.variable} ${inter.variable}`}>
      <body>
        <TimeThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </TimeThemeProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
