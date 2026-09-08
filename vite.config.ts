import { sites } from '@openai/sites-vite-plugin';
import tailwindcss from '@tailwindcss/postcss';
import tailwindcssVite from '@tailwindcss/vite';
import { nitro } from 'nitro/vite';
import { resolve } from 'node:path';
import vinext from 'vinext';
import { defineConfig } from 'vite';
import hostingConfig from './.openai/hosting.json';

const SITE_CREATOR_PLACEHOLDER_DATABASE_ID =
  '00000000-0000-4000-8000-000000000000';

const { d1, r2 } = hostingConfig;

// macOS Seatbelt blocks FSEvents, so Codex previews need polling for HMR.
const isCodexSeatbeltSandbox = process.env.CODEX_SANDBOX === 'seatbelt';
const isVercel = process.env.VERCEL === '1' || process.env.VERCEL === 'true';

const localBindingConfig = {
  main: 'vinext/server/fetch-handler',
  compatibility_flags: ['nodejs_compat'],
  d1_databases: d1
    ? [
        {
          binding: d1,
          database_name: 'site-creator-d1',
          database_id: SITE_CREATOR_PLACEHOLDER_DATABASE_ID,
        },
      ]
    : [],
  r2_buckets: r2
    ? [
        {
          binding: r2,
          bucket_name: 'site-creator-r2',
        },
      ]
    : [],
};

export default defineConfig(async () => {
  // Keep Wrangler and Miniflare state project-local. These are non-secret tool
  // settings; application environment belongs in ignored `.env*` files.
  process.env.WRANGLER_WRITE_LOGS ??= 'false';
  process.env.WRANGLER_LOG_PATH ??= '.wrangler/logs';
  process.env.MINIFLARE_REGISTRY_PATH ??= '.wrangler/registry';

  // Wrangler snapshots its log path while the Cloudflare plugin is imported.
  // Vercel uses Nitro instead; loading the Cloudflare plugin there would make
  // Vercel emit a Workers bundle that it cannot serve as a Vercel deployment.
  const cloudflare = isVercel
    ? null
    : (await import('@cloudflare/vite-plugin')).cloudflare;

  return {
    // The Cloudflare build uses Tailwind's PostCSS adapter. Nitro's Vercel
    // build uses the official Vite adapter so CSS imports are handled before
    // Nitro's multi-environment build starts.
    css: isVercel ? undefined : { postcss: { plugins: [tailwindcss()] } },
    // The application normally receives this virtual module from Cloudflare.
    // Vercel has no `cloudflare:workers` module, so use a tiny env shim that
    // leaves the optional D1-backed features disabled while keeping the quiz
    // and its SSR entry deployable.
    resolve: isVercel
      ? { alias: { 'cloudflare:workers': resolve(process.cwd(), 'lib/vercel-env.ts') } }
      : undefined,
    server: isCodexSeatbeltSandbox
      ? { watch: { useFsEvents: false, usePolling: true } }
      : undefined,
    plugins: [
      vinext(),
      sites(),
      ...(isVercel
        ? [tailwindcssVite(), nitro()]
        : [
            cloudflare!({
              viteEnvironment: { name: 'rsc', childEnvironments: ['ssr'] },
              config: localBindingConfig,
            }),
          ]),
    ],
  };
});
