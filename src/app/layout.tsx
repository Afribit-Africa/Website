import type { Metadata } from "next";
import { DM_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://afribit.africa';

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Afribit Africa - Empowering Communities Through Bitcoin",
    template: "%s | Afribit Africa",
  },
  description: "Empowering Africa through Bitcoin education, financial inclusion, and community development. Join us in bringing financial freedom to African communities.",
  keywords: [
    "Bitcoin",
    "Africa",
    "Bitcoin education",
    "financial inclusion",
    "cryptocurrency",
    "Uganda",
    "Bitcoin adoption",
    "financial freedom",
    "blockchain",
    "African development",
    "Boda-Boda",
    "waste management",
    "merchant onboarding",
  ],
  authors: [{ name: "Afribit Africa" }],
  creator: "Afribit Africa",
  publisher: "Afribit Africa",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Afribit Africa",
    title: "Afribit Africa - Empowering Communities Through Bitcoin",
    description: "Empowering Africa through Bitcoin education, financial inclusion, and community development.",
    images: [
      {
        url: `${SITE_URL}/images/og-default.jpg`,
        width: 1200,
        height: 630,
        alt: "Afribit Africa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@AfribitAfrica",
    creator: "@AfribitAfrica",
    title: "Afribit Africa - Empowering Communities Through Bitcoin",
    description: "Empowering Africa through Bitcoin education, financial inclusion, and community development.",
    images: [`${SITE_URL}/images/og-default.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${spaceGrotesk.variable} dark`} suppressHydrationWarning>
      <head />
      <body
        className="bg-background font-sans text-foreground antialiased"
        suppressHydrationWarning
      >
        <Header />
        <main>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
