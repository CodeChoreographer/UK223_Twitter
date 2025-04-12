import { defineConfig } from 'vite';
import { VitePluginNode } from 'vite-plugin-node';
import { builtinModules } from 'module';

export default defineConfig({
  root: '.',
  optimizeDeps: {
    exclude: ['fsevents'],
  },
  server: {
    port: 3000,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 24678,
    },
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      external: [
        ...builtinModules,
      ],
    },
  },
  plugins: [
    ...VitePluginNode({
      adapter: 'express',
      appPath: './server/index.ts',
      exportName: 'viteNodeApp',
      tsCompiler: 'esbuild',
    }),
  ],
});
