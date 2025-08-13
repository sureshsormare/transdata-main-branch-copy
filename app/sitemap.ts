import { MetadataRoute } from 'next'
import { blogs } from './blog/_data'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'

  const blogIndexLastMod = mostRecentDate(blogs.map(b => b.date))
  const siteIndexLastMod = blogIndexLastMod

  return [
    { url: `${base}/`, changefreq: 'weekly', priority: 1.0, lastModified: siteIndexLastMod },
    { url: `${base}/blog`, changefreq: 'daily', priority: 0.6, lastModified: blogIndexLastMod },
    ...blogs.map(p => ({ url: `${base}/blog/${p.slug}`, lastModified: new Date(p.date) })),
  ]
}

function mostRecentDate(dates: string[]): Date {
  if (!dates || dates.length === 0) return new Date()
  const mostRecent = dates
    .map(d => new Date(d).getTime())
    .filter(n => !Number.isNaN(n))
    .reduce((a, b) => Math.max(a, b), 0)
  return new Date(mostRecent || Date.now())
}


