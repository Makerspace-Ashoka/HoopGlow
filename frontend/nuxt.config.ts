// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  modules: [
    '@nuxtjs/google-fonts',
  ],
  googleFonts: {
    families: {
      Nunito: true
    }
  },
  devtools: { enabled: true },
  css: [
    'assets/css/main.css',
  ]
})
