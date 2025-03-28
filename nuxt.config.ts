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
    }
  },

  css: [
    '~/assets/css/main.css',
  ],

  app: {
    baseURL: '/mtg-collector-front-end', // Replace with your GitHub repository name
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

  compatibilityDate: '2025-03-15'
})