import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';


export default defineConfig({
site: 'https://www.schnauze-tierisch-voll.de',
integrations: [tailwind({ applyBaseStyles: true })],
output: 'static'
});
