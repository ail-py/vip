
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        // Vitest configuration options
        globals: true,
        environment: 'miniflare', // Use miniflare for testing Cloudflare Workers
        environmentOptions: {
            // Miniflare-specific options
            modules: true,
            scriptPath: 'src/index.tsx',
        },
    },
});
