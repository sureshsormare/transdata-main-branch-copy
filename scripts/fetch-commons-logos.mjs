#!/usr/bin/env node
// Fetch brand SVG logos from Wikimedia Commons and save to public/logos
// Note: Ensure you have permission to use these assets for your use case.

import fs from 'node:fs/promises'
import path from 'node:path'

const brands = [
  'Amgen',
  'Johnson & Johnson',
  'Pfizer',
  'Bayer',
  'Sanofi',
  'Eli Lilly',
  'Merck',
  'AstraZeneca',
  'Roche',
  'Novartis',
  'GSK',
  'AbbVie',
  'Bristol Myers Squibb',
  'Takeda'
]

const outDir = path.resolve(process.cwd(), 'public', 'logos')

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true })
}

function toSlugFile(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') + '.svg'
}

async function searchSvgOnCommons(query) {
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    origin: '*',
    prop: 'imageinfo',
    iiprop: 'url',
    generator: 'search',
    gsrsearch: `${query} logo filetype:svg`,
    gsrnamespace: '6', // File namespace
    gsrlimit: '10'
  })
  const url = `https://commons.wikimedia.org/w/api.php?${params.toString()}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Commons API error ${res.status}`)
  const data = await res.json()
  if (!data?.query?.pages) return null
  const pages = Object.values(data.query.pages)
  // Prefer titles containing the brand and ending with .svg
  const candidates = pages
    .filter(p => p.title?.toLowerCase().endsWith('.svg'))
    .sort((a, b) => (a.title.includes('logo') ? -1 : 1))
  const chosen = candidates[0]
  const urlFound = chosen?.imageinfo?.[0]?.url
  return urlFound || null
}

async function downloadFile(url, destPath) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to download ${url}: ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  await fs.writeFile(destPath, buf)
}

async function main() {
  await ensureDir(outDir)
  const results = []
  for (const brand of brands) {
    const slugFile = toSlugFile(brand)
    const outPath = path.join(outDir, slugFile)
    try {
      const svgUrl = await searchSvgOnCommons(brand)
      if (!svgUrl) {
        results.push({ brand, status: 'not_found' })
        continue
      }
      await downloadFile(svgUrl, outPath)
      results.push({ brand, status: 'ok', file: `public/logos/${slugFile}` })
      console.log(`Saved ${brand} -> ${outPath}`)
    } catch (err) {
      results.push({ brand, status: 'error', error: String(err) })
      console.warn(`Failed ${brand}:`, err.message)
    }
  }
  const summaryPath = path.join(outDir, '_fetch-summary.json')
  await fs.writeFile(summaryPath, JSON.stringify(results, null, 2))
  console.log('Summary written to', summaryPath)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})


