import type { Metadata } from "next";
import "./globals.css";
import Layout from "@/components/shared/Layout";
import { ThemeProvider } from "next-themes";
import { inter, robotoMono } from "./fonts";
import { Toaster } from "@/components/ui/toaster";
import { SessionProvider } from "@/components/providers/SessionProvider";

export const metadata: Metadata = {
  title: "Lyon Marquage Service",
  description: "Showcase website of serigraphy compagny, Lyon Marquage Service",
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
        </ThemeProvider>
      </body>
    </html>
  );
}
