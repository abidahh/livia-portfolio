import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

const sectionIds = ['beranda', 'tentang', 'proyek', 'keahlian', 'kontak'];
for (const id of sectionIds) {
  assert.match(html, new RegExp(`id="${id}"`), `Bagian #${id} tidak ditemukan.`);
}

const targetIds = [...sectionIds, 'main'];
const navLinks = [...html.matchAll(/href="#([^"]+)"/g)].map((match) => match[1]);
for (const id of navLinks) {
  assert.ok(targetIds.includes(id), `Tautan navigasi #${id} tidak memiliki tujuan.`);
}

const images = [...html.matchAll(/<img[^>]*>/g)].map((match) => match[0]);
assert.equal(images.length, 5, 'Jumlah gambar tidak sesuai.');
for (const img of images) {
  assert.match(img, /alt="[^"]+"/, 'Gambar tanpa atribut alt.');
  assert.match(img, /loading="lazy"/, 'Gambar tanpa loading="lazy".');
}

const projects = [...html.matchAll(/<article class="project">/g)].length;
assert.equal(projects, 4, 'Jumlah proyek harus empat.');

const required = [
  'Livia Betsaida Purba',
  'Digital Marketing Enthusiast',
  'Cakrawala University',
  'https://gisfloristbylivia.netlify.app/',
  'projects/imperium-strategy.html',
  'projects/tari-cookies-ads-analysis.pdf',
  'https://taricookies.pages.dev',
  'https://wa.me/6285380818357',
  'https://instagram.com/liviaprb_',
  'mailto:liviapurba57@gmail.com',
  '80.328 impressions',
  'Rp92.153',
  'Proyek Kelompok',
  'Kembali ke atas'
];
for (const text of required) {
  assert.ok(html.includes(text), `Konten wajib tidak ditemukan: ${text}`);
}

for (const file of [
  'projects/imperium-strategy.html',
  'projects/tari-cookies-ads-analysis.pdf',
  'assets/imperium.jpg',
  'assets/tari-ads.jpg'
]) {
  assert.ok(fs.existsSync(path.join(root, file)), `Berkas tujuan tidak ditemukan: ${file}`);
}

console.log('Pemeriksaan struktur dan konten berhasil.');
