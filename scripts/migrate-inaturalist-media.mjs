import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const allowedLicenses = new Set(['cc0', 'cc-by', 'cc-by-sa']);
const alternateTaxonNames = {
  'Ganoderma lingzhi': ['Ganoderma lucidum'],
  'Pholiota nameko': ['Pholiota microspora'],
};
const manualFallbacks = {
  'Termitomyces albuminosus': {
    photoUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/2011-06-10%20Termitomyces%20albuminosa%20150361.jpg?width=1200',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:2011-06-10_Termitomyces_albuminosa_150361.jpg',
    attribution: 'Josef Papi (Mushroom Observer user kabutiphilippines)',
    license: 'CC-BY-SA-3.0',
    observationId: null,
  },
};
const groups = [
  { key: 'mushrooms', file: 'components/quizzes/mushroom-quiz.tsx', pattern: /\{ name: '([^']+)', scientificName: '([^']+)'[^}]*\}/g, directory: 'mushrooms' },
  { key: 'birds', file: 'components/quizzes/bird-quiz.tsx', pattern: /\{ name: '([^']+)', scientificName: '([^']+)'[^}]*\}/g, directory: 'birds' },
  { key: 'insects', file: 'components/quizzes/strange-skill-quiz.tsx', pattern: /\['([^']+)', '([^']+)'\]/g, directory: 'insects' },
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const slug = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

async function readSpecies(group) {
  const source = await readFile(join(root, group.file), 'utf8');
  const matches = [...source.matchAll(group.pattern)].map((match) => ({ name: match[1], scientificName: match[2] }));
  if (group.key !== 'insects') return matches;
  const start = source.indexOf('const insects: Species[] = [');
  const end = source.indexOf('const birdCalls: Species[] = [');
  return matches.filter((item) => source.slice(start, end).includes(`['${item.name}', '${item.scientificName}']`));
}

async function fetchJson(url, attempt = 0) {
  try {
    const response = await fetch(url, { headers: { 'user-agent': 'not-serious-test-center-media-migration/1.0' } });
    if (response.status === 429) {
      const retryAfter = Number(response.headers.get('retry-after'));
      await sleep(Number.isFinite(retryAfter) ? Math.max(1, retryAfter) * 1000 : 3_000);
      throw new Error('HTTP 429');
    }
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    if (attempt >= 6) throw error;
    await sleep(1_200 * (attempt + 1));
    return fetchJson(url, attempt + 1);
  }
}

async function findPhoto(scientificName) {
  for (const taxonName of [scientificName, ...(alternateTaxonNames[scientificName] ?? [])]) {
    const params = new URLSearchParams({
      taxon_name: taxonName,
      quality_grade: 'research',
      photo_license: 'cc0,cc-by,cc-by-sa',
      photos: 'true',
      order_by: 'votes',
      order: 'desc',
      per_page: '30',
    });
    const data = await fetchJson(`https://api.inaturalist.org/v1/observations?${params}`);
    for (const observation of data.results ?? []) {
      for (const photo of observation.photos ?? []) {
        if (photo.url && allowedLicenses.has(photo.license_code)) {
          return {
            photoUrl: photo.url.replace('/square.', '/large.'),
            sourceUrl: observation.uri ?? `https://www.inaturalist.org/observations/${observation.id}`,
            attribution: photo.attribution ?? 'iNaturalist contributor',
            license: photo.license_code.toUpperCase(),
            observationId: observation.id,
          };
        }
      }
    }
  }
  return manualFallbacks[scientificName] ?? null;
}

async function downloadPhoto(photoUrl) {
  const response = await fetch(photoUrl, { headers: { 'user-agent': 'not-serious-test-center-media-migration/1.0' } });
  if (!response.ok) throw new Error(`photo HTTP ${response.status}`);
  const buffer = Buffer.from(await response.arrayBuffer());
  return sharp(buffer)
    .rotate()
    .resize({ width: 1200, height: 900, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 80, effort: 5, smartSubsample: true })
    .toBuffer();
}

async function mapWithConcurrency(items, limit, worker) {
  const results = Array.from({ length: items.length });
  let cursor = 0;
  async function run() {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await worker(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, run));
  return results;
}

let manifest;
try {
  manifest = JSON.parse(await readFile(join(root, 'lib', 'natural-media.json'), 'utf8'));
} catch {
  manifest = { generatedAt: new Date().toISOString(), licenses: [...allowedLicenses], mushrooms: {}, birds: {}, insects: {} };
}
manifest.generatedAt = new Date().toISOString();
const failures = [];

for (const group of groups) {
  const species = await readSpecies(group);
  const outputDirectory = join(root, 'public', 'media', 'natural', group.directory);
  await mkdir(outputDirectory, { recursive: true });
  console.log(`${group.key}: ${species.length} species`);
  await mapWithConcurrency(species, 1, async (item, index) => {
    if (manifest[group.key][item.scientificName]) {
      console.log(`  [${index + 1}/${species.length}] already saved ${item.scientificName}`);
      return;
    }
    try {
      await sleep(1_100);
      const photo = await findPhoto(item.scientificName);
      if (!photo) throw new Error('no CC0/CC BY/CC BY-SA photo');
      const outputName = `${slug(item.scientificName)}.webp`;
      const outputPath = join(outputDirectory, outputName);
      const image = await downloadPhoto(photo.photoUrl);
      await writeFile(outputPath, image);
      manifest[group.key][item.scientificName] = {
        path: `/media/natural/${group.directory}/${outputName}`,
        sourceUrl: photo.sourceUrl,
        attribution: photo.attribution,
        license: photo.license,
        observationId: photo.observationId,
      };
      console.log(`  [${index + 1}/${species.length}] ${item.scientificName}`);
    } catch (error) {
      failures.push({ group: group.key, ...item, error: error instanceof Error ? error.message : String(error) });
      console.error(`  [${index + 1}/${species.length}] FAILED ${item.scientificName}: ${failures.at(-1).error}`);
    }
  });
}

await writeFile(join(root, 'lib', 'natural-media.json'), `${JSON.stringify(manifest, null, 2)}\n`);
await writeFile(join(root, 'lib', 'natural-media-failures.json'), `${JSON.stringify(failures, null, 2)}\n`);
const savedCount = groups.reduce((sum, group) => sum + Object.keys(manifest[group.key]).length, 0);
console.log(`Saved ${savedCount} media records.`);
if (failures.length) {
  console.error(`${failures.length} species still need a verified image; runtime fallback must remain enabled.`);
  process.exitCode = 1;
}
