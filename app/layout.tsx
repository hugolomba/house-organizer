import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "@/app/_components/navbar";
import Footer from "@/app/_components/footer";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Analytics } from "@vercel/analytics/next";

const sfPro = localFont({
  src: [{ path: "../public/fonts/SF-Pro.ttf" }],
  variable: "--font-sfpro",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HouseMates - Manage Your Home Efficiently",
  description:
    "A comprehensive app to manage chores, bills, and members in your household seamlessly.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${sfPro.variable} antialiased`}
      >
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Navbar session={session} />

            <main className="flex-1">
              {children} <Analytics />
            </main>

            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
