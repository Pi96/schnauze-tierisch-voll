import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://www.schnauze-tierisch-voll.de',
  integrations: [
    tailwind({ applyBaseStyles: true }),
    react(), // <-- hier React wirklich aktivieren
  ],
  output: 'static',
});
