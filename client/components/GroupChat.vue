<template>
  <div style="width: 50vw; margin: 0 auto">
    <h2 class="text-center text-white">Create group</h2>
    <p class="absolute top-4 right-8 !text-xl" @click="emitClosePopup">X</p>
    <div class="search-user">
        <input
      type="text"
      v-if="!groupsetting"
      v-model="groupChatName"
      @keyup.enter="groupsetting = !groupsetting"
      placeholder="Enter Group Name"
      class="search"
    />
    </div>
    <h3 class="text-white text-center mt-5 mb-5">{{ groupChatName }}</h3>
    <div class="search-user" v-if="groupsetting">
      <input
        id="search-input"
        type="text"
        placeholder="Search for group members"
        name="search"
        class="search"
        v-model="openentPlayer"
        autocomplete="off"
        @input="searchUser()"
      />
      <span class="absolute right-4">
        <img :src="searchImg" alt="" width="30px" />
      </span>
      <div
        class="!block !w-full absolute buttons options top-12 z-10"
        v-if="searchedPlayer && openentPlayer"
        style="background-color: aliceblue"
      >
        <button
          class="w-full !flex-row !justify-start"
          v-for="(player, i) in searchedPlayer"
          :key="i"
          @click="handleGroup(player)"
        >
          <img
            :src="player.image"
            style="width: 32px; height: 32px; border-radius: 50%"
          />
          {{ player.username }}
          <span
            v-if="player.online"
            class="ml-10 onlineUser absolute right-3"
          ></span>
        </button>
      </div>
    </div>
    <button v-if="selectedUsers.length > 1" @click="handleSubmit()">
      Create
    </button>
  </div>
</template>

<script setup>
import searchImg from "~/assets/img/search.svg";
import { useAuthStore } from "~/store/auth.js";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import { defineEmits } from 'vue';
import axios from "axios";

const searchedPlayer = ref([]);
const openentPlayer = ref("");
const groupChatName = ref("");
const groupsetting = ref(false);
const selectedUsers = ref([]);

const emit = defineEmits(['close-popup']);
const authStore = useAuthStore();
const { user, token } = storeToRefs(authStore);

const handleGroup = (userToAdd) => {
  if (selectedUsers.value.includes(userToAdd)) {
    toast("User already added", {
      theme: "colored",
      type: "error",
      position: "top-center",
      autoClose: 3000,
      transition: "slide",
      dangerouslyHTMLString: true,
    });
    return;
  }

  selectedUsers.value.push(userToAdd);
};
const searchUser = () => {
  if (openentPlayer.value.length > 0) {
    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token.value}`,
      },
    };
    axios
      .get(
        `${process.env.APP_URL}api/?search=${openentPlayer.value}&userId=${user?.value?._id}`,
        config
      )
      .then((res) => {
        // if (res.data.length > 0) {
        searchedPlayer.value = res.data;
        //   gameStore.setOponentPlayer(res.data[0].username);
        //   router.push("/tictactoe");
        // }
      });
  }
};

const handleSubmit = async () => {
  if (!groupChatName || !selectedUsers) {
    toast("Please fill all the feilds", {
      theme: "colored",
      type: "error",
      position: "top-center",
      autoClose: 3000,
      transition: "slide",
      dangerouslyHTMLString: true,
    });
    return;
  }

  try {
    console.log(token.value,'handleSubmit')

    const config = {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    };
    const { data } = await axios.post(
      `${process.env.APP_URL}api/chat/group`,
      {
        name: groupChatName.value,
        users: JSON.stringify(selectedUsers.value.map((u) => u._id)),
      },
      config
    );
    //   setChats([data, ...chats]);
    //   onClose();
    toast("New Group Chat Created!", {
      theme: "colored",
      type: "success",
      position: "top-center",
      autoClose: 3000,
      transition: "slide",
      dangerouslyHTMLString: true,
    });
  } catch (error) {
    console.log(error,'handleSubmit')
    toast("Failed to Create the Chat!", {
      theme: "colored",
      type: "error",
      position: "top-center",
      autoClose: 3000,
      transition: "slide",
      dangerouslyHTMLString: true,
    });
  }
};

const emitClosePopup = () => {
      emit('close-popup');
    }
</script>

<style scoped>
@import "../assets/css/chats.css";
</style>