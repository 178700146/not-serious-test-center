const SPECIES_PATTERN = /^[A-Z][a-z]+ [a-z][a-z-]+$/;

function decodeHtml(value: string) {
  return value.replaceAll('&amp;', '&');
}

export async function GET(request: Request) {
  const scientificName = new URL(request.url).searchParams.get('scientificName')?.trim() ?? '';
  if (!SPECIES_PATTERN.test(scientificName)) {
    return Response.json({ error: 'invalid species' }, { status: 400 });
  }

  const speciesUrl = `https://xeno-canto.org/species/${scientificName.replaceAll(' ', '-')}`;
  const pageResponse = await fetch(speciesUrl, {
    headers: { 'User-Agent': 'notatest.cn bird-call quiz' },
    next: { revalidate: 86_400 },
  });
  if (!pageResponse.ok) {
    return Response.json({ error: 'recording page unavailable' }, { status: 502 });
  }

  const page = await pageResponse.text();
  const recordingUrl = page.match(/https:\/\/xeno-canto\.org\/sounds\/uploaded\/[^"'<> ]+\.mp3/i)?.[0];
  if (!recordingUrl) {
    return Response.json({ error: 'recording unavailable' }, { status: 404 });
  }

  const range = request.headers.get('range');
  const audioResponse = await fetch(decodeHtml(recordingUrl), {
    headers: {
      'User-Agent': 'notatest.cn bird-call quiz',
      ...(range ? { Range: range } : {}),
    },
  });
  if (!audioResponse.ok && audioResponse.status !== 206) {
    return Response.json({ error: 'audio unavailable' }, { status: 502 });
  }

  const headers = new Headers({
    'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
    'Content-Type': audioResponse.headers.get('content-type') ?? 'audio/mpeg',
  });
  for (const name of ['accept-ranges', 'content-length', 'content-range']) {
    const value = audioResponse.headers.get(name);
    if (value) headers.set(name, value);
  }

  return new Response(audioResponse.body, { status: audioResponse.status, headers });
}
