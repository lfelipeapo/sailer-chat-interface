// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
  ],
  css: ['~/assets/css/main.css'],
  typescript: {
    strict: true
  },
  ssr: false, // SPA mode for better WebSocket handling
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE || 'http://localhost:8000',
      wsBase: process.env.WS_BASE || 'ws://localhost:8000'
    }
  }
})

