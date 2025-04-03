import type { Metadata } from "next";
import "./globals.css";
import Layout from "@/components/shared/Layout";
import { ThemeProvider } from "next-themes";
import { inter, robotoMono } from "./fonts";
import { Toaster } from "@/components/ui/toaster";
import { SessionProvider } from "@/components/providers/SessionProvider";
import CookieBanner from "@/components/cookie/CookieBanner";
import GoogleAnalytics from "@/components/shared/GoogleAnalytics";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || "";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.lyonmarquage.fr"),
  title: {
    default: "Lyon Marquage Service | Spécialiste en marquage textile et objets publicitaires",
    template: "%s | Lyon Marquage Service",
  },
  description:
    "Entreprise lyonnaise spécialisée en sérigraphie, broderie, impression textile, flocage et objets publicitaires pour professionnels. Service local, prix compétitifs.",
  keywords: [
    "marquage textile lyon",
    "sérigraphie lyon",
    "broderie professionnelle",
    "vêtements personnalisés",
    "objets publicitaires lyon",
    "flocage",
  ],
  authors: [{ name: "Lyon Marquage Service" }],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://lyonmarquageservice.fr",
    siteName: "Lyon Marquage Service",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Lyon Marquage Service",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
    other: [
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        url: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        url: "/favicon-16x16.png",
      },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        url: "/apple-touch-icon.png",
      },
      {
        rel: "manifest",
        url: "/site.webmanifest",
      },
    ],
  },
  alternates: {
    canonical: "https://lyonmarquageservice.fr",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${robotoMono.className} ${inter.className} antialiased min-h-screen bg-background font-sans`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          enableColorScheme
        >
          <Layout>
            <SessionProvider>{children}</SessionProvider>
          </Layout>
          <Toaster />
          <CookieBanner />
          {GA_MEASUREMENT_ID && <GoogleAnalytics GA_MEASUREMENT_ID={GA_MEASUREMENT_ID} />}
        </ThemeProvider>
      </body>
    </html>
  );
}
