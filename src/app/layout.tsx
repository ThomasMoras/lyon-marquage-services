import type { Metadata } from "next";
import "./globals.css";
import Layout from "@/components/shared/Layout";
import { ThemeProvider } from "next-themes";

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
    <html lang="en">
      <body className={`antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Layout>{children}</Layout>
        </ThemeProvider>
      </body>
    </html>
  );
}
