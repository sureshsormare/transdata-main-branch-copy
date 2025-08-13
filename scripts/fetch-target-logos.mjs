#!/usr/bin/env node
// Fetch specific brand SVGs from Wikimedia Commons using targeted queries
// Saves into public/logos/custom to override defaults

import fs from 'node:fs/promises'
import path from 'node:path'

const targets = [
  { name: 'Johnson & Johnson', query: '"Johnson & Johnson" 2023 logo filetype:svg' },
  { name: 'Pfizer', query: 'Pfizer (2021) logo filetype:svg' },
  { name: 'Bayer', query: 'Bayer cross logo filetype:svg' },
  { name: 'Sanofi', query: 'Sanofi 2022 logo filetype:svg' },
  { name: 'Merck', query: '"Merck & Co." logo filetype:svg OR "MSD" logo filetype:svg' },
  { name: 'Novartis', query: 'File:Novartis logo.svg OR Novartis logo vector filetype:svg' },
  { name: 'AstraZeneca', query: 'File:AstraZeneca logo.svg OR AstraZeneca logo vector filetype:svg' },
  { name: 'GSK', query: 'File:GSK logo 2022.svg OR "GSK plc" logo filetype:svg OR GSK logo vector filetype:svg' },
  { name: 'Novo Nordisk', query: 'Novo Nordisk logo filetype:svg' },
  { name: 'Boehringer Ingelheim', query: 'Boehringer Ingelheim logo filetype:svg' },
  { name: 'Gilead Sciences', query: 'Gilead Sciences logo filetype:svg' },
  { name: 'Moderna', query: 'Moderna logo filetype:svg' },
  { name: 'Regeneron', query: 'Regeneron logo filetype:svg' },
  { name: 'Biogen', query: 'Biogen logo filetype:svg' },
  { name: 'Vertex Pharmaceuticals', query: 'Vertex Pharmaceuticals logo filetype:svg' },
  { name: 'Teva', query: 'Teva Pharmaceutical logo filetype:svg' },
  { name: 'Astellas Pharma', query: 'Astellas Pharma logo filetype:svg' },
  { name: 'Daiichi Sankyo', query: 'Daiichi Sankyo logo filetype:svg' },
  { name: 'CSL Behring', query: 'CSL Behring logo filetype:svg' }
]

const outDir = path.resolve(process.cwd(), 'public', 'logos', 'custom')

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true })
}

function toSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

async function searchSvgOnCommons(query) {
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    origin: '*',
    prop: 'imageinfo',
    iiprop: 'url',
    generator: 'search',
    gsrsearch: query,
    gsrnamespace: '6',
    gsrlimit: '20'
  })
  const url = `https://commons.wikimedia.org/w/api.php?${params.toString()}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Commons API error ${res.status}`)
  const data = await res.json()
  if (!data?.query?.pages) return []
  const pages = Object.values(data.query.pages)
  return pages
    .filter(p => p.title?.toLowerCase().endsWith('.svg'))
    .map(p => ({ title: p.title, url: p?.imageinfo?.[0]?.url }))
    .filter(x => !!x.url)
}

async function download(url, dest) {
  const r = await fetch(url)
  if (!r.ok) throw new Error(`Download failed ${r.status}`)
  const buf = Buffer.from(await r.arrayBuffer())
  await fs.writeFile(dest, buf)
}

async function main() {
  await ensureDir(outDir)
  const results = []
  for (const t of targets) {
    try {
      const candidates = await searchSvgOnCommons(t.query)
      const tl = (s) => s.toLowerCase()
      // Brand-specific selection heuristics to avoid wrong pick (e.g., MerckFinck)
      let best = null
      if (t.name === 'Merck') {
        best = candidates.find(c => tl(c.title).includes('merck & co'))
             || candidates.find(c => /^file:msd .*\.svg$/i.test(c.title))
             || candidates.find(c => tl(c.title).includes('msd'))
      } else if (t.name === 'GSK') {
        best = candidates.find(c => /2022/.test(c.title) && tl(c.title).includes('gsk'))
             || candidates.find(c => tl(c.title).includes('gsk'))
      } else if (t.name === 'AstraZeneca') {
        best = candidates.find(c => /2017/.test(c.title) && tl(c.title).includes('astrazeneca'))
             || candidates.find(c => tl(c.title).includes('astrazeneca'))
      } else if (t.name === 'Novartis') {
        best = candidates.find(c => tl(c.title).includes('novartis') && tl(c.title).includes('logo'))
             || candidates.find(c => tl(c.title).includes('novartis'))
      }
      if (!best) {
        best = candidates.find(c => /2023|2022|2021/.test(c.title))
            || candidates.find(c => tl(c.title).includes('logo'))
            || candidates[0]
      }
      if (!best) {
        results.push({ name: t.name, status: 'not_found' })
        continue
      }
      const dest = path.join(outDir, `${toSlug(t.name)}.svg`)
      await download(best.url, dest)
      console.log(`Saved ${t.name} -> ${dest} (${best.title})`)
      results.push({ name: t.name, status: 'ok', title: best.title, file: dest })
    } catch (e) {
      console.warn('Failed', t.name, e.message)
      results.push({ name: t.name, status: 'error', error: String(e) })
    }
  }
  await fs.writeFile(path.join(outDir, '_target-summary.json'), JSON.stringify(results, null, 2))
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})


