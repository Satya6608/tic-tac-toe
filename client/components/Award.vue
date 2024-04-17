<template>
  <div class="outer__wraper" v-if="winner">
    <div class="content">
    <div class="trophy">
      <img src="https://i.ibb.co/kVZ3CN6/trophy.png" alt="trophy" />
    </div>
    <div class="text">
      <h1>Winner {{winner}}</h1>
    </div>
  </div>
  </div>
</template>

<script setup>
import { useGameStore } from "~/store/gameStore.js"
import { storeToRefs } from "pinia"
const gameStore = useGameStore()
const { winner } = storeToRefs(gameStore)



</script>

<style scoped>
.outer__wraper{
  position: fixed;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100dvw;
  height: 100dvh;
  background: #ffffff;
  padding: 25px 0;
}
.content .trophy img {
  display: block;
  margin: auto;
  max-width: 128px;
  filter: drop-shadow(0 0 4px #000);
  transition: 0.5s;
  animation: animate 2s linear infinite;
}

@keyframes animate {
  0% {
    transform: scale(1);
  }

  25% {
    transform: scale(1.1);
  }

  50% {
    transform: scale(1);
  }

  75% {
    transform: scale(1.2);
  }

  100% {
    transform: scale(1.1);
  }
}

.content .text h1 {
  font-weight: 900;
  font-size: 8rem;
  color: #222324;
  text-shadow: 8px 0px 0px #fabe2c;
  text-align: center;
}
#developerPra {
  position: fixed;
  bottom: 4rem;
  right: 4rem;
  font-size: 4rem;
  color: rgba(0, 0, 0, 0.7);
}
</style>
