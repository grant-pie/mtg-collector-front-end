// nuxt.config.ts
export default defineNuxtConfig({
  ssr: true,

  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
  ],

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:3001',
      wsBaseUrl: process.env.WS_BASE_URL || 'http://localhost:3001'
    }
  },

  css: [
    '~/assets/css/main.css',
  ],

  app: {
    baseURL: '/mtg-collector-front-end/', // Replace with your GitHub repository name
    head: {
      title: 'MTG Collector',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: 'Track your Magic: The Gathering cards for tournaments' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  // Add server proxy configuration for websocket connections
  nitro: {
    devProxy: {
      '/socket.io': {
        target: process.env.API_BASE_URL || 'http://localhost:3001',
        ws: true,
        changeOrigin: true
      }
    }
  },

  // Ignore WebSockets routes in routing
  routeRules: {
    '/socket.io/**': { prerender: false }
  },

  compatibilityDate: '2025-03-15'
})