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
  metadataBase: new URL('https://afribit.africa'),
  title: {
    default: "Afribit Africa - Bitcoin Education & Empowerment in Kenya",
    template: "%s | Afribit Africa"
  },
  description: "Empowering communities in Kibera, Nairobi through Bitcoin education, merchant adoption, and financial literacy. Join us in building Africa's Bitcoin economy.",
  keywords: ["Bitcoin Kenya", "Bitcoin Africa", "Kibera Bitcoin", "Bitcoin education", "cryptocurrency Kenya", "Bitcoin merchants", "financial literacy Africa", "Bitcoin adoption", "Nairobi Bitcoin"],
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
    url: "https://afribit.africa",
    title: "Afribit Africa - Bitcoin Education & Empowerment in Kenya",
    description: "Empowering communities in Kibera, Nairobi through Bitcoin education, merchant adoption, and financial literacy.",
    siteName: "Afribit Africa",
    images: [
      {
        url: "/Media/Logo/Full logo png transparent.png",
        width: 1200,
        height: 630,
        alt: "Afribit Africa Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Afribit Africa - Bitcoin Education & Empowerment in Kenya",
    description: "Empowering communities in Kibera, Nairobi through Bitcoin education, merchant adoption, and financial literacy.",
    images: ["/Media/Logo/Full logo png transparent.png"],
    creator: "@AfribitAfrica",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
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
