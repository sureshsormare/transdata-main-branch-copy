import "./globals.css";
import { Inter } from "next/font/google";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "TransData Nexus - Global Pharmaceutical Trade Intelligence Platform",
    template: "%s | TransData Nexus"
  },
  description: "Comprehensive pharmaceutical trade intelligence platform providing real-time insights into global API, intermediate, and finished formulation trade data across 180+ countries. Access supplier networks, pricing trends, and market analytics.",
  keywords: [
    "pharmaceutical trade data",
    "API trade intelligence",
    "pharma export import",
    "drug trade analytics",
    "pharmaceutical suppliers",
    "medicine trade data",
    "pharma market intelligence",
    "global pharmaceutical trade",
    "drug pricing trends",
    "pharmaceutical buyers",
    "medicine export data",
    "pharma trade insights",
    "pharmaceutical market analysis",
    "drug trade statistics",
    "pharma business intelligence"
  ],
  authors: [{ name: "TransData Nexus" }],
  creator: "TransData Nexus",
  publisher: "TransData Nexus",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://transdatanexus.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://transdatanexus.com',
    siteName: 'TransData Nexus',
    title: 'TransData Nexus - Global Pharmaceutical Trade Intelligence Platform',
    description: 'Comprehensive pharmaceutical trade intelligence platform providing real-time insights into global API, intermediate, and finished formulation trade data across 180+ countries.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'TransData Nexus - Pharmaceutical Trade Intelligence Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TransData Nexus - Global Pharmaceutical Trade Intelligence Platform',
    description: 'Comprehensive pharmaceutical trade intelligence platform providing real-time insights into global API, intermediate, and finished formulation trade data.',
    images: ['/twitter-image.jpg'],
    creator: '@transdatanexus',
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
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Favicon and app icons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Structured Data for Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "TransData Nexus",
              "url": "https://transdatanexus.com",
              "logo": "https://transdatanexus.com/logo.png",
              "description": "Global pharmaceutical trade intelligence platform providing comprehensive insights into API, intermediate, and finished formulation trade data.",
              "foundingDate": "2024",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+91-9595078788",
                "contactType": "customer service",
                "email": "info@transdatanexus.com"
              },
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "IN"
              },
              "sameAs": [
                "https://www.linkedin.com/company/transdatanexus",
                "https://twitter.com/transdatanexus"
              ]
            })
          }}
        />
        
        {/* Structured Data for WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "TransData Nexus",
              "url": "https://transdatanexus.com",
              "description": "Global pharmaceutical trade intelligence platform",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://transdatanexus.com/search-results?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body className={`${inter.className} h-full`}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
