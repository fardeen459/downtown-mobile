import { chromium } from 'playwright'
const url = 'http://localhost:4173/'
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] })
const shot = async (page, name) => { await page.waitForTimeout(1800); await page.screenshot({ path: `screenshots/${name}.png` }) }
const scrollTo = async (page, sel, extra = 0) => {
  await page.evaluate(([s, e]) => { const el = document.querySelector(s); window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY + e) }, [sel, extra])
}
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
page.on('console', m => { if (m.type() === 'error') console.log('ERR', m.text()) })
await page.goto(url, { waitUntil: 'networkidle' })
await page.waitForTimeout(3500)
await shot(page, 'desktop-01-hero')
await scrollTo(page, '#devices', 60); await shot(page, 'desktop-02-devices')
await scrollTo(page, '#studio', 1600); await shot(page, 'desktop-03-studio-pinned')
await scrollTo(page, '#why', 40); await shot(page, 'desktop-04-why')
await scrollTo(page, '#process', 60); await shot(page, 'desktop-05-how')
await scrollTo(page, '.gallery-sec', 100); await shot(page, 'desktop-06-gallery')
await scrollTo(page, '#book', 60); await shot(page, 'desktop-07-book')
await scrollTo(page, '#visit', 40); await shot(page, 'desktop-08-location')
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); await shot(page, 'desktop-09-footer')
const m = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
await m.goto(url, { waitUntil: 'networkidle' }); await m.waitForTimeout(3500)
await shot(m, 'mobile-01-hero')
await browser.close()
