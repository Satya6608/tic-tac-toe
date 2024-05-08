<template>
  <div class="profile__container">
    <div class="profile-card">
      <div class="avatar" v-if="user?.image">
        <img
          :src="user?.image"
          alt="profile-img"
        />
      </div>
      <div class="salutation">
        <div class="name">{{ user?.username }}</div>
        <div class="designation">{{ user?.email }}</div>
      </div>
      <div class="options">
        <button class="status" @click="selectOponent()">
          <span>Play</span>
        </button>
        <nuxt-link to="/edit" class="edit-profile">
          <span>Edit Profile</span>
        </nuxt-link>
      </div>
    </div>
    <div v-if="items.length" class="mt-4">
      <GameTable />
    </div>
    <div class="popUpContainer" v-if="oponentPopup">
      <p class="absolute right-3.5 top-1.5 cursor-pointer"
@click="oponentPopup = false">X</p>
      <h2 class="text-center">Please give oponent Name</h2>
      <div class="popUp relative">
        <div class="input-container">
          <input
            type="text"
            v-model="openentPlayer"
            class="m-0"
            @input="searchUser()"
          />
        </div>
        <div class="!block buttons options !w-full absolute" v-if="searchedPlayer && openentPlayer">
          <button
            class="w-full !flex-row !justify-start"
            v-for="(player, i) in searchedPlayer"
            :key="i"
            @click="joinRoom(player)"
          >
    <img :src="player.image" style="width:32px; height:32px; border-radius:50%;"/>
          {{player.username}} <span v-if="player.online" class="ml-10 onlineUser absolute right-3"></span>
          </button>
        </div>
        <!-- <div class="buttons options !w-full mt-4">
          <button @click="oponentPopup = false">Close</button>
          <button @click="joinRoom()">Join</button>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { useAuthStore } from "~/store/auth.js";
import { useUserStore } from "~/store/users.js";
import { useGameStore } from "~/store/gameStore.js";
import { storeToRefs } from "pinia";
import GameTable from "~/components/GameTable.vue";
import { ref } from "vue";
import auth from "~/middleware/auth.js";
import { useRouter } from "vue-router";
import { io } from "socket.io-client";
const socket = io(process.env.APP_URL);

const router = useRouter();
definePageMeta({
  middleware: ["auth"],
});
const authStore = useAuthStore();
const gameStore = useGameStore();
const userStore = useUserStore();
const { user } = storeToRefs(authStore);
const { items } = storeToRefs(userStore);

const oponentPopup = ref(false);
const openentPlayer = ref("");
const searchedPlayer = ref([]);
const selectOponent = () => {
  oponentPopup.value = !oponentPopup.value;
};

// watch(openentPlayer, (newValue, oldValue) => {
//   localStorage.setItem("openentPlayer", newValue);
// });
const joinRoom = (player) => {
  const opponentId = player?._id; // Implement this function to get user ID
  socket.emit('joinGame', opponentId);
  router.push("/tictactoe");
  // gameStore.setOponentPlayer(player?.username);
};
const searchUser = () => {
  if (openentPlayer.value.length > 0) {
    axios
        .get(`${process.env.APP_URL}/api/?search=${openentPlayer.value}&userId=${user?.value?._id}`)
        .then((res) => {
          // if (res.data.length > 0) {
            searchedPlayer.value = res.data
            //   gameStore.setOponentPlayer(res.data[0].username);
          //   router.push("/tictactoe");
          // }
        });
    };
};
onMounted(async () => {
  console.log(process.env.APP_URL, "enve caaa a")
  if (!user) return router.push("/");
  socket.on('startGame', ({ opponent, currentPlayer }) => {
  axios
        .get(`${process.env.APP_URL}/api/${opponent}`)
        .then((res) => {
          gameStore.setOponentPlayer(res.data.username, opponent);
        });
  axios
        .get(`${process.env.APP_URL}/api/${currentPlayer}`)
        .then((res) => {
          gameStore.changePlayer(res.data.username)
        });
  });
  await userStore.fetchItems(user?.value._id);
  socket.emit("authenticate", user?.value._id);
  clearTimeout(searchUser)
});
</script>

<style scoped>
.profile__container {
  display: grid;
  place-items: center;
  padding: 50px 0;
}
.profile-card {
  background-color: white;
  color: var(--main-txt-color);
  width: 400px;
  height: 300px;
  border-radius: 10px;
  box-shadow: 0 0 5px 5px #e1e7fb;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 20px;
  position: relative;
}

.avatar {
  width: 80px;
  height: 80px;
  outline: 10px solid #ecf1ff;
  border-radius: 50%;
}

.avatar > img {
  outline: 10px #ecf1ff;
  border-radius: 50%;
  width: inherit;
  aspect-ratio: 1/1;
  object-fit: cover;
}

.salutation {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 5px;
}

.salutation > .name {
  font-size: 20px;
  font-weight: 500;
}

.salutation > .designation {
  font-size: 15px;
}

.options {
  display: flex;
  align-items: center;
  width: 80%;
  gap: 10px;
}

.options > button,
.options > a {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 5px;
  gap: 10px;
  background-color: white;
  border: 2px solid #e9e6f6;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 500;
  transition: all 500ms ease;
}
.options > button:hover {
  transform: scale(1.1);
}
.options > button > .btn-img {
  width: 30px;
  aspect-ratio: 1/1;
}

.more-options {
  bottom: -60px;
  right: -120px;
  position: absolute;
  display: flex;
  flex-direction: column;
  padding: 10px;
  background: var(--main-txt-color);
  color: white;
  border-radius: 5px;
  gap: 5px;
  transition: all 500ms ease;
}
.notVisible {
  transform: scale(0);
}

.option {
  display: flex;
  align-items: center;
  height: 30px;
  cursor: pointer;
  transition: all 500ms ease;
  border-radius: inherit;
  padding: 10px;
}
.option:hover {
  background-color: #2d255a;
}
.popUpContainer {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: antiquewhite;
  height: 50vh;
  width: 50vw;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.onlineUser::before{
  content: "";
  display: block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: green;
  margin-right: 10px;
}
</style>