import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { PuikResolver } from '@prestashopcorp/puik-resolver'

export default defineNuxtConfig({

  modules: ['@nuxt/eslint', '@nuxt/image', '@nuxt/test-utils'],

  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],
  devtools: { enabled: true },

  app: {
    head: {
      title: 'PrestaShop Top Contributors',
      htmlAttrs: {
        lang: 'en',
      },
      meta: [
        {
          name: 'description',
          content: 'A list of PrestaShop contributors',
        },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },
  css: ['~/assets/css/main.css'],
  compatibilityDate: '2025-07-15',
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/'],
    },
  },
  vite: {
    plugins: [
      tailwindcss(),
      Components({
        resolvers: [PuikResolver()],
      }),
      AutoImport({
        resolvers: [PuikResolver()],
      }),
    ],
  },
  hooks: {
    'nitro:config'(nitroConfig) {
      const publicDir = resolve(__dirname, 'public')
      const contribPath = `${publicDir}/contributors_prs.json`
      const compPath = `${publicDir}/topcompanies_prs.json`
      const routes: string[] = []

      if (existsSync(contribPath)) {
        try {
          const data = JSON.parse(readFileSync(contribPath, 'utf-8'))
          for (const login of Object.keys(data)) {
            if (login === 'updatedAt') continue
            routes.push(`/contributor/${encodeURIComponent(login)}`)
            routes.push(`/card/${encodeURIComponent(login)}.svg`)
          }
        }
        catch (err) {
          console.warn('[prerender] failed to read contributors_prs.json:', (err as Error).message)
        }
      }
      else {
        console.warn('[prerender] contributors_prs.json missing — skipping contributor detail routes')
      }

      if (existsSync(compPath)) {
        try {
          const data = JSON.parse(readFileSync(compPath, 'utf-8'))
          for (const c of data.companies ?? []) {
            if (c.slug) routes.push(`/company/${c.slug}`)
          }
        }
        catch (err) {
          console.warn('[prerender] failed to read topcompanies_prs.json:', (err as Error).message)
        }
      }
      else {
        console.warn('[prerender] topcompanies_prs.json missing — skipping company detail routes')
      }

      nitroConfig.prerender = nitroConfig.prerender ?? {}
      nitroConfig.prerender.routes = [
        ...(nitroConfig.prerender.routes ?? []),
        ...routes,
      ]
    },
  },
  eslint: {
    config: {
      stylistic: true,
    },
  },
})
