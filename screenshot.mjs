import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const url   = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] || '';
const dir   = './temporary screenshots';

if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

// Auto-increment — never overwrite
const existing = fs.readdirSync(dir).filter(f => f.endsWith('.png'));
const nums = existing.map(f => parseInt(f.match(/^screenshot-(\d+)/)?.[1] || '0')).filter(Boolean);
const next = nums.length ? Math.max(...nums) + 1 : 1;
const filename = label ? `screenshot-${next}-${label}.png` : `screenshot-${next}.png`;
const filepath = path.join(dir, filename);

const browser = await puppeteer.launch({ headless: 'new' });
const page    = await browser.newPage();

await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

// Scroll through page to trigger observers, then force all animated elements visible
await page.evaluate(async () => {
  const totalHeight = document.body.scrollHeight;
  const step = 300;
  for (let y = 0; y < totalHeight; y += step) {
    window.scrollTo(0, y);
    await new Promise(r => setTimeout(r, 80));
  }
  // Force all fade-up elements visible regardless of observer state
  document.querySelectorAll('.fade-up').forEach(el => el.classList.add('visible'));
  window.scrollTo(0, 0);
});

await new Promise(r => setTimeout(r, 1500)); // let animations settle
await page.screenshot({ path: filepath, fullPage: true });

await browser.close();
console.log(`Saved: ${filepath}`);
