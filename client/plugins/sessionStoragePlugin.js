import { useAuthStore } from "~/store/auth.js"
import { useGameStore } from "~/store/gameStore.js"


export default defineNuxtPlugin(nuxtApp => {
    const authStore = useAuthStore()
    const gameStore = useGameStore()
  // Get data from sessionStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  const oppPlayer = localStorage.getItem('openentPlayer');
  if(token && user){
    authStore.login(token, user);
    gameStore.setOponentPlayer(oppPlayer);
  }
});