<template>
  <div>
    <nav class="border-gray-200 bg-gray-900">
      <div
        class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4"
      >
        <nuxt-link
          to="/tictactoe"
          class="flex items-center space-x-3 rtl:space-x-reverse text-white"
        >
          Tic Tac Toe App
        </nuxt-link>
        <div class="flex gap-x-4" v-if="user">
          <button
          to="/profile"
          class="text-white"
          @click="logout()"
        >
          Logout
          </button>
        <nuxt-link
          to="/profile"
          class="flex items-center space-x-3 rtl:space-x-reverse text-white"
        >
          Profile
        </nuxt-link>
        </div>
      </div>
    </nav>
  </div>
</template>
<script setup>
import { useAuthStore } from "~/store/auth.js"
import { storeToRefs } from "pinia"
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
import { useRouter } from 'vue-router';

const router = useRouter();



const logout = () => {
  // socket.emit("logout");
  router.push('/');
  authStore.logout();
}
</script>

<style>
</style>