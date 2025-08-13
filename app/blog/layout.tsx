import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'TransDataNexus Blog – Pharma Trade Insights',
  description: 'Expert analysis on pharma trade: APIs, vaccines, compliance, finance, cold chain, and more—data-backed insights and practical playbooks.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'}/blog`,
  },
  openGraph: {
    type: 'website',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'}/blog`,
    title: 'TransDataNexus Blog – Pharma Trade Insights',
    description: 'Expert analysis on pharma trade: APIs, vaccines, compliance, finance, cold chain, and more—data-backed insights and practical playbooks.'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TransDataNexus Blog – Pharma Trade Insights',
    description: 'Expert analysis on pharma trade: APIs, vaccines, compliance, finance, cold chain, and more—data-backed insights and practical playbooks.'
  }
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children
}


