import { chromium } from 'playwright'
import path from 'node:path'
import fs from 'node:fs'

const outDir = '/cursor/stores/self/media/kutak-dashboard'
fs.mkdirSync(outDir, { recursive: true })

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
const errors = []
page.on('pageerror', (e) => errors.push(String(e)))
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(msg.text())
})

await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' })
await page.waitForSelector('text=Kutak')
await page.screenshot({ path: path.join(outDir, '07-desktop-hero.png'), fullPage: false })

// Filter chip
await page.getByRole('button', { name: 'Sarıyer' }).click()
await page.waitForTimeout(400)
const countText = await page.locator('section p').first().textContent()
const clearVisible = await page.getByRole('button', { name: 'Clear filters' }).isVisible()
await page.screenshot({ path: path.join(outDir, '08-filter-sariyer.png'), fullPage: false })

// Reserve seat on first open card
await page.getByRole('button', { name: 'Clear filters' }).click()
await page.waitForTimeout(200)
const firstCard = page.locator('article').filter({ has: page.getByRole('button', { name: 'Reserve Seat' }) }).first()
const before = await firstCard.locator('span.tabular-nums, span.ml-1').last().textContent()
await firstCard.getByRole('button', { name: 'Reserve Seat' }).click()
await page.waitForTimeout(350)
const after = await firstCard.locator('span.tabular-nums, span.ml-1').last().textContent()
await page.screenshot({ path: path.join(outDir, '09-after-reserve.png'), fullPage: false })

// Locked card present
const locked = await page.getByText('Locked').first().isVisible()
await page.getByText('Fully booked').first().scrollIntoViewIfNeeded()
await page.screenshot({ path: path.join(outDir, '10-locked-card.png'), fullPage: false })

// Create modal
await page.getByRole('button', { name: '+ Create Taxi Group' }).click()
await page.waitForSelector('text=Create Taxi Group')
await page.screenshot({ path: path.join(outDir, '11-create-modal.png'), fullPage: false })
await page.getByPlaceholder('Your name').fill('Test Host')
await page.getByRole('button', { name: 'Create group' }).click()
await page.waitForTimeout(400)
const created = await page.getByText('Test Host').first().isVisible()
await page.screenshot({ path: path.join(outDir, '12-after-create.png'), fullPage: false })

// Mobile
await page.setViewportSize({ width: 390, height: 844 })
await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' })
await page.screenshot({ path: path.join(outDir, '13-mobile.png'), fullPage: false })

console.log(JSON.stringify({
  countText,
  clearVisible,
  seatsBefore: before,
  seatsAfter: after,
  locked,
  created,
  errors,
}, null, 2))

await browser.close()
