import { readdir, stat } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';
import sharp from 'sharp';

const publicDirectory = join(process.cwd(), 'public');
const imageExtensions = new Set(['.png', '.jpg', '.jpeg']);

async function filesUnder(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const fullPath = join(directory, entry.name);
    return entry.isDirectory() ? filesUnder(fullPath) : [fullPath];
  }));
  return nested.flat();
}

const images = (await filesUnder(publicDirectory)).filter((file) => imageExtensions.has(extname(file).toLowerCase()));
let originalBytes = 0;
let webpBytes = 0;

for (const input of images) {
  const output = input.replace(/\.(png|jpe?g)$/i, '.webp');
  const before = await stat(input);
  await sharp(input)
    .rotate()
    .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82, effort: 5, smartSubsample: true })
    .toFile(output);
  const after = await stat(output);
  originalBytes += before.size;
  webpBytes += after.size;
  console.log(`${relative(publicDirectory, input)} -> ${relative(publicDirectory, output)} (${(before.size / 1024 / 1024).toFixed(2)} MB -> ${(after.size / 1024 / 1024).toFixed(2)} MB)`);
}

console.log(`Total: ${(originalBytes / 1024 / 1024).toFixed(2)} MB -> ${(webpBytes / 1024 / 1024).toFixed(2)} MB`);
