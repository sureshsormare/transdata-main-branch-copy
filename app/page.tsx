import { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "Global Pharmaceutical Trade Intelligence Platform | TransData Nexus",
  description: "Search and analyze pharmaceutical trade data across 180+ countries. Access real-time insights into API, intermediate, and finished formulation trade with comprehensive market intelligence, supplier networks, and pricing trends.",
  keywords: [
    "pharmaceutical trade data",
    "global pharma trade",
    "API trade intelligence",
    "pharma export import data",
    "drug trade analytics",
    "pharmaceutical market intelligence",
    "medicine trade statistics",
    "pharma suppliers database",
    "drug pricing trends",
    "pharmaceutical buyers network",
    "medicine export import",
    "pharma trade insights",
    "global pharmaceutical market",
    "drug trade data platform",
    "pharmaceutical business intelligence"
  ],
  openGraph: {
    title: "Global Pharmaceutical Trade Intelligence Platform | TransData Nexus",
    description: "Search and analyze pharmaceutical trade data across 180+ countries with real-time insights and comprehensive market intelligence.",
    url: "https://transdatanexus.com",
    siteName: "TransData Nexus",
    images: [
      {
        url: "/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "TransData Nexus - Global Pharmaceutical Trade Intelligence Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Global Pharmaceutical Trade Intelligence Platform | TransData Nexus",
    description: "Search and analyze pharmaceutical trade data across 180+ countries with real-time insights and comprehensive market intelligence.",
    images: ["/twitter-home.jpg"],
  },
  alternates: {
    canonical: "/",
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
};

export default function Home() {
  return (
    <>
      {/* Structured Data for Homepage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Global Pharmaceutical Trade Intelligence Platform",
            "description": "Search and analyze pharmaceutical trade data across 180+ countries with real-time insights and comprehensive market intelligence.",
            "url": "https://transdatanexus.com",
            "mainEntity": {
              "@type": "SoftwareApplication",
              "name": "TransData Nexus",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web Browser",
              "description": "Global pharmaceutical trade intelligence platform providing comprehensive insights into API, intermediate, and finished formulation trade data.",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "description": "Free trial available"
              }
            },
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://transdatanexus.com"
                }
              ]
            }
          })
        }}
      />
      
      <HomeClient />
    </>
  );
}
