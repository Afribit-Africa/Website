import type { Metadata } from "next";
import { Inter, Space_Grotesk, Orbitron, Rajdhani } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import AppPreloader from "@/components/AppPreloader";
import PageTransition from "@/components/PageTransition";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// Body text - clean and readable
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

// Headings - modern fintech style
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

// Titles/Display - futuristic tech
const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

// Numbers/Stats - technical display
const rajdhani = Rajdhani({
  subsets: ["latin"],
  variable: "--font-rajdhani",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Afribit Africa - Empowering Communities Through Bitcoin",
  description: "Building a sustainable future with Bitcoin education, merchant onboarding, and community development initiatives in Kenya.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      lang="en" 
      className={`${inter.variable} ${spaceGrotesk.variable} ${orbitron.variable} ${rajdhani.variable}`} 
      suppressHydrationWarning
    >
      <body className="font-sans antialiased" suppressHydrationWarning>
        <ErrorBoundary>
          <AppPreloader />
          <Header />
          <main className="min-h-screen">
            <PageTransition>
              {children}
            </PageTransition>
          </main>
          <Footer />
        </ErrorBoundary>
      </body>
    </html>
  );
}
