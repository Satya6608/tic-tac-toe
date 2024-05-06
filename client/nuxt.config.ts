// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt"],
  plugins: [
    { src: '~/plugins/sessionStoragePlugin.js', mode: 'client'}, // Register the plugin
  ]
});
