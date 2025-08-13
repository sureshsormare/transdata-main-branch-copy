#!/usr/bin/env node
// Fetch specific SVGs from Wikimedia Commons by exact File: title(s)
// Saves to public/logos/custom/{slug}.svg

import fs from 'node:fs/promises'
import path from 'node:path'

const targets = {
  Novartis: [
    'File:Novartis logo.svg',
    'File:Novartis Logo.svg',
    'File:Novartis.svg'
  ],
  AstraZeneca: [
    'File:AstraZeneca logo.svg',
    'File:AstraZeneca Logo.svg',
    'File:AstraZeneca.svg',
    'File:AstraZeneca logo 2017.svg'
  ],
  GSK: [
    'File:GSK logo 2022.svg',
    'File:GSK logo.svg',
    'File:GSK plc logo.svg',
    'File:GlaxoSmithKline logo.svg'
  ]
}

const outDir = path.resolve(process.cwd(), 'public', 'logos', 'custom')

async function ensureDir(dir) { await fs.mkdir(dir, { recursive: true }) }

function slug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

async function fetchByTitle(title) {
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    origin: '*',
    prop: 'imageinfo',
    iiprop: 'url',
    titles: title
  })
  const url = `https://commons.wikimedia.org/w/api.php?${params.toString()}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Commons API error ${res.status}`)
  const data = await res.json()
  const pages = data?.query?.pages || {}
  const page = Object.values(pages)[0]
  const info = page?.imageinfo?.[0]
  return info?.url || null
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
  for (const [brand, titles] of Object.entries(targets)) {
    let downloaded = false
    for (const t of titles) {
      try {
        const url = await fetchByTitle(t)
        if (!url) continue
        const dest = path.join(outDir, `${slug(brand)}.svg`)
        await download(url, dest)
        console.log(`Saved ${brand} -> ${dest} (${t})`)
        results.push({ brand, status: 'ok', title: t, file: dest })
        downloaded = true
        break
      } catch (e) {
        // try next title
      }
    }
    if (!downloaded) results.push({ brand, status: 'not_found' })
  }
  await fs.writeFile(path.join(outDir, '_by-title-summary.json'), JSON.stringify(results, null, 2))
}

main().catch(e => { console.error(e); process.exit(1) })


