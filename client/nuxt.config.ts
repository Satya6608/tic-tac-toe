// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  vite: {
    define: {
      "process.env.APP_URL": JSON.stringify(process.env.NUXT_ENV_API_URL),
    },
  },
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt"],
  plugins: [
    { src: '~/plugins/sessionStoragePlugin.js', mode: 'client'}, // Register the plugin
  ]
});
