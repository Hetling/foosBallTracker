// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  modules: ['@nuxtjs/supabase'],
  supabase: {
  url: process.env.SUPABASE_URL,
  key: process.env.SUPABASE_KEY,
  redirectOptions: { login: '/login', callback: '/confirm', exclude: ['/emailotp*'], }
  },
  css: ['@/assets/main.css'],
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true }
})
