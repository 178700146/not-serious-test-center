/**
 * Vercel build/runtime shim for the Cloudflare virtual module.
 *
 * The quiz UI does not require a database to render: it already ships with
 * the default question bank and treats content API failures as optional. The
 * Cloudflare deployment still uses the real `cloudflare:workers` module; this
 * file only supplies the shape needed when the same source is built by Nitro
 * for Vercel.
 */
export const env = {
  ADMIN_PIN: typeof process !== 'undefined' ? process.env.ADMIN_PIN : undefined,
};
