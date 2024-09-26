import type { Metadata } from "next";
import localFont from "next/font/local";
import { Frown } from "lucide-react";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import AppWalletProvider from "@/components/AppWalletProvider";
import ResponsiveLayout from "@/components/ResponsiveLayout";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Solaris Board",
  description: "solana essentials, streamlined",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-screen w-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full w-full`}
      >
        <ResponsiveLayout
          fallback=<div className="flex flex-col items-center justify-center h-screen p-4">
            <Frown className="w-16 h-16 mb-4 text-gray-50" />
            <p className="text-center text-xl font-semibold text-gray-200">
              Mobile screens are not supported yet. Please view on a larger
              screen.
            </p>
          </div>
        >
          <AppWalletProvider>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
              {children}
            </ThemeProvider>
          </AppWalletProvider>
        </ResponsiveLayout>
      </body>
    </html>
  );
}
