import type { Metadata, Viewport } from "next";
import { Archivo, Inter } from "next/font/google";
import { site } from "@/data/site";
import { en } from "@/lib/i18n/en";
import { bootScript } from "@/lib/i18n/store";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: en.meta.title,
  description: en.meta.description,
  applicationName: site.name,
  creator: site.studio,
  icons: {
    icon: [
      { url: "/icons/favicon-32.png?v=crest-20261113", sizes: "32x32", type: "image/png" },
      { url: "/icons/favicon-16.png?v=crest-20261113", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/favicon.ico?v=crest-20261113",
    apple: [{ url: "/icons/apple-touch-icon.png?v=crest-20261113", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: site.name,
    title: en.meta.title,
    description: en.meta.description,
    locale: "en_US",
    alternateLocale: ["pt_BR"],
    images: [
      { url: "/og.png", width: 1200, height: 630, alt: "911 GT3 RS — concept experience by Aklio Studio" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: en.meta.title,
    description: en.meta.description,
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${archivo.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        {/* JS flag, saved language and repeat-visit flag — applied before first paint. */}
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
