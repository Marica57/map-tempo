// Generira PNG ikone iz SVG izvora (Android maskable + iOS apple-touch + "any").
// Pokretanje: npm run gen:icons
import sharp from 'sharp';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const pub = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');
const rounded = readFileSync(join(pub, 'icon.svg'));
const square = readFileSync(join(pub, 'icon-square.svg'));

const out = (name) => join(pub, name);

async function gen() {
  // "any" ikone (zaobljena podloga) — Android/desktop
  await sharp(rounded).resize(192, 192).png().toFile(out('pwa-192x192.png'));
  await sharp(rounded).resize(512, 512).png().toFile(out('pwa-512x512.png'));
  // maskable (puna kvadratna podloga) — Android adaptivne ikone
  await sharp(square).resize(512, 512).png().toFile(out('maskable-icon-512x512.png'));
  // iOS home-screen (bez prozirnosti, iOS sam zaokružuje)
  await sharp(square)
    .resize(180, 180)
    .flatten({ background: '#2B717F' })
    .png()
    .toFile(out('apple-touch-icon-180x180.png'));
  console.log('Ikone generirane u public/.');
}

gen().catch((e) => {
  console.error(e);
  process.exit(1);
});
