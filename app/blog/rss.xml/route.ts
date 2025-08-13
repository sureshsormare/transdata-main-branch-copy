import { blogs } from '../../blog/_data'

export const revalidate = 3600

export async function GET() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'
  const items = blogs.map(p => `
    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>${base}/blog/${p.slug}</link>
      <description><![CDATA[${p.summary}]]></description>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <guid>${base}/blog/${p.slug}</guid>
    </item>`).join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0">
    <channel>
      <title>TransDataNexus Blog</title>
      <link>${base}/blog</link>
      <description>Latest pharmaceutical trade insights</description>
      ${items}
    </channel>
  </rss>`

  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } })
}


