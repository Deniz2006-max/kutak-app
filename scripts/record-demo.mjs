import { chromium } from 'playwright'
import path from 'node:path'
import fs from 'node:fs'

const outDir = '/cursor/stores/self/media/kutak-dashboard'
fs.mkdirSync(outDir, { recursive: true })
const videoDir = path.join(outDir, '_video-tmp')
fs.rmSync(videoDir, { recursive: true, force: true })
fs.mkdirSync(videoDir, { recursive: true })

const browser = await chromium.launch({ headless: true })
const context = await browser.newContext({
  viewport: { width: 1280, height: 800 },
  recordVideo: { dir: videoDir, size: { width: 1280, height: 800 } },
})
const page = await context.newPage()

await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' })
await page.waitForTimeout(900)

await page.getByRole('button', { name: 'Sarıyer' }).click()
await page.waitForTimeout(1000)

await page.getByRole('button', { name: 'Clear filters' }).click()
await page.waitForTimeout(700)

const firstCard = page.locator('article').filter({ has: page.getByRole('button', { name: 'Reserve Seat' }) }).first()
await firstCard.getByRole('button', { name: 'Reserve Seat' }).click()
await page.waitForTimeout(900)
await firstCard.getByRole('button', { name: 'Reserve Seat' }).click()
await page.waitForTimeout(900)

await page.getByRole('button', { name: '+ Create Taxi Group' }).click()
await page.waitForTimeout(700)
await page.getByPlaceholder('Your name').fill('Demo Student')
await page.waitForTimeout(400)
await page.getByRole('button', { name: 'Create group' }).click()
await page.waitForTimeout(1100)

await page.getByText('Fully booked').first().scrollIntoViewIfNeeded()
await page.waitForTimeout(1200)

await context.close()
await browser.close()

const videos = fs.readdirSync(videoDir).filter((f) => f.endsWith('.webm'))
if (!videos.length) throw new Error('No video produced')
const dest = path.join(outDir, 'demo-filter-reserve-create.webm')
fs.renameSync(path.join(videoDir, videos[0]), dest)
fs.rmSync(videoDir, { recursive: true, force: true })
console.log(dest)
