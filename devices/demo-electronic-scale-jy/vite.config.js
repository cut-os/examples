import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import cutosBundle from './cutos.bundle.js'

export default defineConfig({
  base: './',
  publicDir: 'public',
  build: {
    target: ['chrome74','chrome83','chrome65']
  },
  server: {
    proxy: {
      // '/proxy': 'http://192.168.1.30',
    }
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  define: {},
  plugins: [
    vue(),
    AutoImport({
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/, // .vue
        /\.md$/ // .md
      ],
      imports: ['vue'],
      vueTemplate: true,
      cache: true
    }),
    cutosBundle()
  ],
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis'
      },
      target: 'es2015',
      supported: {
        bigint: true
      }
    }
  }
})
