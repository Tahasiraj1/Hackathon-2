import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import CartProvider from "@/lib/CartContext";
import NetworkStatus from "@/components/layout/NetworkListener";
import { ClerkProvider } from "@clerk/nextjs";
import { GoogleAnalytics } from '@next/third-parties/google'
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ParallaxLayout from "@/components/layout/ParallaxEffect";

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
  title: "Avion",
  description: "E-commerce Website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <CartProvider>
              <NetworkStatus />
            <Header />
            <ParallaxLayout>
              {children}
            </ParallaxLayout>
            <Toaster />
            <Footer />
          </CartProvider>
          <GoogleAnalytics gaId="G-2FD2N2NPM3" />
        </body>
      </html>
    </ClerkProvider>
  );
}
