import { defineConfig } from '@solidjs/start/config';
import tailwindcss from '@tailwindcss/vite';

// Load .env into process.env so server-side code using process.env works in dev
try { process.loadEnvFile?.('.env'); } catch { /* .env may not exist */ }

// noinspection JSUnusedGlobalSymbols
export default defineConfig({
  vite: {
    // @ts-ignore
    plugins: [tailwindcss()],
    server: {
      port: Number(process.env.PORT) || 3000,
      headers: {
        'X-Frame-Options': 'DENY',
        'Content-Security-Policy':
          "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline';",
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      },
    },
  },
});
