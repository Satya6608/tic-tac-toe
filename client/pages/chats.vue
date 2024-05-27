<template>
  <div>
    <!-- <img src="http://loremflickr.com/550/650/girl" alt=""> -->
    <div class="content-chat">
      <div class="content-chat-user">
        <div class="head-search-chat">
          <div class="flex gap-4">
            <img v-if="user?.image" :src="user?.image" alt="" />
          <div class="message-user-profile">
            <p class="mt-0 mb-0 text-white"><strong>{{user?.username}}</strong></p>
            <p  v-if="user?.online" class="online mt-0 mb-0">Online</p>
          </div>
          </div>
          <p class="add-group-chat">Group +</p>
        </div>
        <div class="search-user">
          <input
            id="search-input"
            type="text"
            placeholder="Search..."
            name="search"
            class="search"
            v-model="openentPlayer"
            autocomplete="off"
            @input="searchUser()"
          />
          <span class="absolute right-4">
            <img :src="searchImg" alt="" width="30px">
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
              @click="accessChat(player._id)"
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

        <div class="list-search-user-chat mt-20" v-if="chats.length > 0">
          <div
            v-for="(chat, i) in chats"
            class="user-chat"
            :class="chat == selectedChat && 'active'"
            data-username="Maria Dennis"
            :key="i"
            @click="chatSelect(chat)"
          >
            <div class="user-chat-img">
              <img
                :src="
                  chat?.users[0]?._id == user?._id
                    ? chat?.users[1]?.image
                    : chat?.users[0]?.image
                "
                alt=""
              />
              <div
                v-if="
                  !(chat?.users[0]?._id == user?._id
                    ? chat?.users[1]?.online
                    : chat?.users[0]?.online)
                "
                class="offline"
              ></div>
              <div v-else class="online"></div>
            </div>

            <div class="user-chat-text">
              <p class="mt-0 mb-0">
                <strong>{{
                  chat?.users[0]?._id == user?._id
                    ? chat?.users[1]?.username
                    : chat?.users[0]?.username
                }}</strong>
              </p>
              <small>{{ chat?.latestMessage?.content }}</small>
            </div>
          </div>
        </div>
        <div class="list-search-user-chat mt-20" v-else>
          Search a chat to start
        </div>
      </div>

      <div class="content-chat-message-user" data-username="Jorge Harrinson">
        <div class="head-chat-message-user">
          <div class="flex gap-x-4 head__side__icon">
            <img
            :src="
              selectedChat?.users[0]?._id == user?._id
                ? selectedChat?.users[1]?.image
                : selectedChat?.users[0]?.image
            "
            alt=""
          />
          <div class="message-user-profile">
            <p class="mt-0 mb-0 text-white">
              <strong>{{
                selectedChat?.users[0]?._id == user?._id
                  ? selectedChat?.users[1]?.username
                  : selectedChat?.users[0]?.username
              }}</strong>
            </p>
            <!-- <small class="text-white"
              > -->
            <p
              v-if="
                !(selectedChat?.users[0]?._id == user?._id
                  ? selectedChat?.users[1]?.online
                  : selectedChat?.users[0]?.online)
              "
              class="offline mt-0 mb-0"
            >
              Offline
            </p>
            <p v-else class="online mt-0 mb-0">Online</p>
            <!-- </small> -->
          </div>
          </div>
          <div class="flex items-center gap-x-2">
            <div class="flex items-center justify-center user-header-icons">
              <img @click="joinGame" :src="gameImg" alt="" style="width: 20px; height:20px;">
            </div>
            <div class="flex items-center justify-center user-header-icons">
              <img :src="audioCallImg" alt="" style="width: 20px; height:20px;">
            </div>
            <div class="flex items-center justify-center user-header-icons">
              <img :src="videoCallImg" alt="" style="width: 20px; height:20px;">
            </div>
          </div>
        </div>
        <div
          class="body-chat-message-user"
          ref="messageContainer"
          v-if="messages.length > 0"
        >
          <div
            class="message-user-left"
            :class="
              item.sender._id != user?._id
                ? 'message-user-left'
                : 'message-user-right'
            "
            v-for="(item, i) in messages"
            :key="i"
          >
            <!-- <div
              :class="
                item.sender._id != user._id
                  ? 'message-user-left-img'
                  : 'message-user-right-img'
              "
            >
              <img :src="item.sender.image" alt="" />
              <p class="mt-0 mb-0">
                <strong>{{ item?.sender?.username }}</strong>
              </p>
              <small>mié 17:59</small>
            </div> -->
            <div
              :class="
                item.sender._id != user._id
                  ? 'message-user-left-text'
                  : 'message-user-right-text'
              "
            >
              <span style="font-size: 14px; display: block;">{{ item?.content }}</span>
              <small
                style="
                  font-size: 10px;
                  text-align: right;
                  display: block;
                "
                >{{ formatTimestampWithTime(item.updatedAt) }}</small
              >
            </div>
          </div>
          <TypingBullets v-if="isTyping"/>
        </div>
        <div class="body-chat-message-user justify-center items-center" v-else>
          No message to show<br />
          Please start chatting
        </div>
        <div class="footer-chat-message-user">
          <div class="message-user-send">
            <input type="text" placeholder="Aa" v-model="newMessage" @keyup.enter="sendMessage" @input="typingHandler()"/>
          </div>
          <button type="button" @click="sendMessage" class="flex items-center justify-center">
            <img :src="sendImg" alt="sendMessage" width="20px">
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import axios from "axios";
import { storeToRefs } from "pinia";
import { useAuthStore } from "~/store/auth.js";
import sendImg from "~/assets/img/paperplane1.svg"
import searchImg from "~/assets/img/search.svg"
import gameImg from "~/assets/img/gameicon.svg"
import audioCallImg from "~/assets/img/viocecall.svg"
import videoCallImg from "~/assets/img/videocall.svg"
import auth from "~/middleware/auth.js";
import TypingBullets from "@/components/typingBullets.vue"
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import { useRouter } from 'vue-router';

import { io } from "socket.io-client";
const socket = io(process.env.APP_URL);

const router = useRouter();
definePageMeta({
  middleware: ["auth"],
});

const authStore = useAuthStore();
const { user, token } = storeToRefs(authStore);

const chats = ref([]);
const searchedPlayer = ref([]);
const openentPlayer = ref("");
const selectedChat = ref(null);
const messageContainer = ref(null);
const messages = ref([]);
const newMessage = ref("");
const isTyping = ref(false);
const typing = ref(false);
const socketConnected = ref(false);
import { useGameStore } from "~/store/gameStore.js";
const gameStore = useGameStore();


const scrollToBottom = () => {
  setTimeout(() => {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
  }, 500)
};

  const typingHandler = (e) => {

    if (!socketConnected.value) return;

    if (!typing.value) {
      typing.value = true;
      socket.emit("typing", selectedChat.value?._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 5000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat.value?._id);
        typing.value = false;
      }
    }, timerLength);
  };

const chatSelect = (chat) => {
  selectedChat.value = chat;
  if (!chat) return;
  fetchMessages();
};
const fetchChats = async () => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    };

    const { data } = await axios.get(
      `${process.env.APP_URL}api/chat/fetch`,
      config
    );
    chats.value = data;
    chatSelect(data[0]);
    // fetchMessages();
  } catch (error) {
    console.error("Error fetching chats", error);
    toast("Error fetching chats", {
      "theme": "colored",
      "type": "error",
      "position": "top-center",
      "autoClose": 3000,
      "transition": "slide",
      "dangerouslyHTMLString": true
    })
  }
};

const accessChat = async (userId) => {
  try {
    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token.value}`,
      },
    };
    const { data } = await axios.post(
      `${process.env.APP_URL}api/chat`,
      { userId },
      config
    );

    if (!chats?.value?.find((c) => c._id === data._id)) {
      chats?.value.push(data);
      searchedPlayer.value = [];
      openentPlayer.value = "";
    }
  } catch (error) {
    console.error(error, "Failed to access Chats");
  }
};

const searchUser = () => {
  if (openentPlayer.value.length > 0) {
    axios
      .get(
        `${process.env.APP_URL}api/?search=${openentPlayer.value}&userId=${user?.value?._id}`
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
const sendMessage = async () => {
  if (newMessage.value && selectedChat.value) {
    socket.emit("stop typing", selectedChat.value?._id);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token.value}`,
        },
      };
      // setNewMessage("");
      const { data } = await axios.post(
        `${process.env.APP_URL}api/message`,
        {
          content: newMessage.value,
          chatId: selectedChat.value?._id,
        },
        config
      );
      newMessage.value = "";
      messages?.value.push(data);
      scrollToBottom();
      socket.emit("new message", data);
      // setMessages([...messages, data]);
    } catch (error) {
      toast("Error Occured While fetching data", {
      "theme": "colored",
      "type": "error",
      "position": "top-center",
      "autoClose": 3000,
      "transition": "slide",
      "dangerouslyHTMLString": true
    })
    }
  }else {
    toast("Please select a chat by using search", {
      "theme": "colored",
      "type": "warning",
      "position": "top-center",
      "autoClose": 3000,
      "transition": "slide",
      "dangerouslyHTMLString": true
    })
  }
};

const fetchMessages = async () => {
  if (!selectedChat) return;

  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    };
    const { data } = await axios.get(
      `${process.env.APP_URL}api/message/${selectedChat.value?._id}`,
      config
    );
    newMessage.value = "";
    messages.value = data;
    // setLoading(false);
    scrollToBottom();
    socket.emit("join chat", selectedChat.value?._id);
  } catch (error) {
    // console.error("Error fetching messages", error);
    toast("Failed to Load the Messages", {
      "theme": "colored",
      "type": "error",
      "position": "top-center",
      "autoClose": 3000,
      "transition": "slide",
      "dangerouslyHTMLString": true
    })
  }
};

const formatTimestampWithTime = (timestamp) => {
  const date = new Date(timestamp);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayIndex = date.getDay(); // Get the day index (0-6)
  const dayAbbreviation = days[dayIndex]; // Get the three-letter abbreviation of the day

  // Get the time in HH:mm format
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const time = `${hours}:${minutes}`;

  return `${dayAbbreviation}, ${time}`; // Return day abbreviation followed by time
};

const joinGame = () => {
  if (selectedChat.value) {
    let opponent = selectedChat.value?.users[0]?._id == user.value?._id
                  ? selectedChat.value?.users[1]
                  : selectedChat.value?.users[0];
    gameStore.setOponentPlayer(opponent.username, opponent._id);
    socket.emit('joinGame', opponent._id);
    router.push("/tictactoe");
  }
}
onMounted(async () => {
  socket.emit("authenticate", user?.value._id);
  socket.emit("setup", user.value);
  socket.on("connected", () => { socketConnected.value = true; });
  socket.on("message recieved", (newMessageRecieved) => {
    console.log(newMessageRecieved, "newMessageRecieved")
    if(newMessageRecieved?.chat?._id == selectedChat.value?._id){
      messages?.value.push(newMessageRecieved);
      toast('New message received', {
      "theme": "auto",
      "type": "default",
      "position": "top-center",
      "autoClose": 3000,
      "transition": "slide",
      "dangerouslyHTMLString": true
    })
    }else{
      toast('New message received from '+ newMessageRecieved?.sender?.username, {
        "theme": "auto",
        "type": "default",
        "position": "top-center",
        "autoClose": 3000,
        "transition": "slide",
        "dangerouslyHTMLString": true
      })
    }
    scrollToBottom();
  });
    scrollToBottom();
  await fetchChats();
  socket.on("typing", () => {
    isTyping.value = true;
    scrollToBottom();
  });
  socket.on("stop typing", () => { isTyping.value = false; });
  socket.on('startGame', ({ opponent, currentPlayer }) => {
  axios
        .get(`${process.env.APP_URL}api/${opponent}`)
        .then((res) => {
          gameStore.setOponentPlayer(res.data.username, opponent);
        });
  axios
        .get(`${process.env.APP_URL}api/${currentPlayer}`)
        .then((res) => {
          gameStore.changePlayer(res.data.username)
        });
  });
});
</script>
<style scoped>
@import "../assets/css/chats.css";
</style>
