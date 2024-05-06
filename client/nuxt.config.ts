// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@pinia/nuxt"],
  plugins: [
    { src: '~/plugins/sessionStoragePlugin.js', mode: 'client'}, // Register the plugin
  ]
});
