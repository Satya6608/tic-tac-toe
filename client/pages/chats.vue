<template>
  <div>
    <!-- <img src="http://loremflickr.com/550/650/girl" alt=""> -->
    <div class="content-chat">
      <div class="content-chat-user">
        <!-- <div class="head-search-chat">
          <img src="http://loremflickr.com/60/60/girl" alt="" />
          <div class="message-user-profile">
            <p class="mt-0 mb-0 text-white"><strong>Jorge Harrinson</strong></p>
            <small class="text-white"
              ><p class="online mt-0 mb-0"></p>
              Online</small
            >
          </div>
        </div> -->
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
a {
  text-decoration: none;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: "Open Sans", sans-serif;
  color: #19b6d3;
  font-weight: bold;
}

h1 {
  font-size: clamp(
    48px,
    calc(48px + (48 - 16) * ((100vw - 320px) / (1920 - 320))),
    48px
  );
  margin: 0;
}

h2 {
  font-size: clamp(
    36px,
    calc(36px + (36 - 16) * ((100vw - 320px) / (1920 - 320))),
    36px
  );
  margin: 0;
}

h3 {
  font-size: clamp(
    24px,
    calc(24px + (24 - 16) * ((100vw - 320px) / (1920 - 320))),
    24px
  );
  margin: 0;
}

h4 {
  font-size: clamp(
    20px,
    calc(20px + (20 - 16) * ((100vw - 320px) / (1920 - 320))),
    20px
  );
  margin: 0;
}

h5 {
  font-size: clamp(
    18px,
    calc(18px + (18 - 16) * ((100vw - 320px) / (1920 - 320))),
    18px
  );
  margin: 0;
}

h6 {
  font-size: clamp(
    16px,
    calc(16px + (16 - 16) * ((100vw - 320px) / (1920 - 320))),
    16px
  );
  margin: 0;
}

p {
  font-size: 15px;
  line-height: 28px;
}
ul li,
ol li {
  line-height: 28px;
}

.container {
  max-width: 1300px;
  margin: 0 auto;
}

.text-center {
  text-align: center;
}

.text-white {
  color: #ffffff;
}

.col-kdf {
  display: flex;
  justify-content: center;
}

.h3-text {
  margin: 60px 0;
}

.mt-60 {
  margin-top: 60px;
}
.mt-55 {
  margin-top: 55px;
}
.mt-50 {
  margin-top: 50px;
}
.mt-40 {
  margin-top: 40px;
}
.mt-35 {
  margin-top: 35px;
}
.mt-30 {
  margin-top: 30px;
}
.mt-25 {
  margin-top: 25px;
}
.mt-20 {
  margin-top: 20px;
}
.mt-15 {
  margin-top: 15px;
}
.mt-10 {
  margin-top: 10px;
}
.mt-5 {
  margin-top: 5px;
}
.mt-0 {
  margin-top: 0px;
}

.mb-60 {
  margin-bottom: 60px;
}
.mb-55 {
  margin-bottom: 55px;
}
.mb-50 {
  margin-bottom: 50px;
}
.mb-40 {
  margin-bottom: 40px;
}
.mb-35 {
  margin-bottom: 35px;
}
.mb-30 {
  margin-bottom: 30px;
}
.mb-25 {
  margin-bottom: 25px;
}
.mb-20 {
  margin-bottom: 20px;
}
.mb-15 {
  margin-bottom: 15px;
}
.mb-10 {
  margin-bottom: 10px;
}
.mb-5 {
  margin-bottom: 5px;
}
.mb-0 {
  margin-bottom: 0px;
}

.ml-60 {
  margin-left: 60px;
}
.ml-55 {
  margin-left: 55px;
}
.ml-50 {
  margin-left: 50px;
}
.ml-40 {
  margin-left: 40px;
}
.ml-35 {
  margin-left: 35px;
}
.ml-30 {
  margin-left: 30px;
}
.ml-25 {
  margin-left: 25px;
}
.ml-20 {
  margin-left: 20px;
}
.ml-15 {
  margin-left: 15px;
}
.ml-10 {
  margin-left: 10px;
}
.ml-5 {
  margin-left: 5px;
}
.ml-0 {
  margin-left: 0px;
}

.mr-60 {
  margin-right: 60px;
}
.mr-55 {
  margin-right: 55px;
}
.mr-50 {
  margin-right: 50px;
}
.mr-40 {
  margin-right: 40px;
}
.mr-35 {
  margin-right: 35px;
}
.mr-30 {
  margin-right: 30px;
}
.mr-25 {
  margin-right: 25px;
}
.mr-20 {
  margin-right: 20px;
}
.mr-15 {
  margin-right: 15px;
}
.mr-10 {
  margin-right: 10px;
}
.mr-5 {
  margin-right: 5px;
}
.mr-0 {
  margin-right: 0px;
}

.pt-60 {
  padding-top: 60px;
}
.pt-55 {
  padding-top: 55px;
}
.pt-50 {
  padding-top: 50px;
}
.pt-40 {
  padding-top: 40px;
}
.pt-35 {
  padding-top: 35px;
}
.pt-30 {
  padding-top: 30px;
}
.pt-25 {
  padding-top: 25px;
}
.pt-20 {
  padding-top: 20px;
}
.pt-15 {
  padding-top: 15px;
}
.pt-10 {
  padding-top: 10px;
}
.pt-5 {
  padding-top: 5px;
}
.pt-0 {
  padding-top: 0px;
}

.pb-60 {
  padding-bottom: 60px;
}
.pb-55 {
  padding-bottom: 55px;
}
.pb-50 {
  padding-bottom: 50px;
}
.pb-40 {
  padding-bottom: 40px;
}
.pb-35 {
  padding-bottom: 35px;
}
.pb-30 {
  padding-bottom: 30px;
}
.pb-25 {
  padding-bottom: 25px;
}
.pb-20 {
  padding-bottom: 20px;
}
.pb-15 {
  padding-bottom: 15px;
}
.pb-10 {
  padding-bottom: 10px;
}
.pb-5 {
  padding-bottom: 5px;
}
.pt-0 {
  padding-bottom: 0px;
}

.pl-60 {
  padding-left: 60px;
}
.pl-55 {
  padding-left: 55px;
}
.pl-50 {
  padding-left: 50px;
}
.pl-40 {
  padding-left: 40px;
}
.pl-35 {
  padding-left: 35px;
}
.pl-30 {
  padding-left: 30px;
}
.pl-25 {
  padding-left: 25px;
}
.pl-20 {
  padding-left: 20px;
}
.pl-15 {
  padding-left: 15px;
}
.pl-10 {
  padding-left: 10px;
}
.pl-5 {
  padding-left: 5px;
}
.pl-0 {
  padding-left: 0px;
}

.pr-60 {
  padding-right: 60px;
}
.pr-55 {
  padding-right: 55px;
}
.pr-50 {
  padding-right: 50px;
}
.pr-40 {
  padding-right: 40px;
}
.pr-35 {
  padding-right: 35px;
}
.pr-30 {
  padding-right: 30px;
}
.pr-25 {
  padding-right: 25px;
}
.pr-20 {
  padding-right: 20px;
}
.pr-15 {
  padding-right: 15px;
}
.pr-10 {
  padding-right: 10px;
}
.pr-5 {
  padding-right: 5px;
}
.pr-0 {
  padding-right: 0px;
}

.w-100 {
  width: 100%;
}
.w-90 {
  width: 90%;
}
.w-80 {
  width: 80%;
}
.w-70 {
  width: 70%;
}
.w-60 {
  width: 60%;
}
.w-50 {
  width: 50%;
}
.w-40 {
  width: 40%;
}
.w-30 {
  width: 30%;
}
.w-20 {
  width: 20%;
}
.w-10 {
  width: 10%;
}

.content-chat {
  margin-right: 30px;
  margin-left: 30px;
  display: flex;
  justify-content: center;
  gap: 25px;
  padding: 20px;
}

.content-chat .content-chat-user {
  background-color: white;
  padding: 15px;
  border-radius: 25px;
  width: 350px;
}

.content-chat .content-chat-user .head-search-chat {
  background-color: #19b6d3;
  margin: -15px -15px 15px -15px;
  border-radius: 25px 25px 0 0;
  padding: 10px 15px;
}

.content-chat .content-chat-user .head-search-chat h4 {
  color: #ffffff;
}

.content-chat .content-chat-user .search-user {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 25px;
}

.content-chat .content-chat-user .search-user input {
  padding: 10px 15px;
  border-radius: 25px;
  border: 2px solid #949494;
  outline: none;
  width: 100%;
}

.content-chat .content-chat-user .search-user span i {
  position: absolute;
  top: 10px;
  right: 15px;
}

.content-chat .content-chat-user .list-search-user-chat {
  display: flex;
  flex-direction: column;
  gap: 15px;
  height: 67vh;
  overflow-y: auto;
}

.content-chat .content-chat-user .list-search-user-chat::-webkit-scrollbar {
  -webkit-appearance: none;
}

.content-chat
  .content-chat-user
  .list-search-user-chat::-webkit-scrollbar:vertical {
  width: 10px;
}

.content-chat
  .content-chat-user
  .list-search-user-chat::-webkit-scrollbar-button:increment,
.content-chat
  .content-chat-user
  .list-search-user-chat::-webkit-scrollbar-button {
  display: none;
}

.content-chat
  .content-chat-user
  .list-search-user-chat::-webkit-scrollbar:horizontal {
  height: 10px;
}

.content-chat
  .content-chat-user
  .list-search-user-chat::-webkit-scrollbar-thumb {
  background-color: #19b6d3;
  border-radius: 20px;
  border: 2px solid #f1f2f3;
}

.content-chat
  .content-chat-user
  .list-search-user-chat::-webkit-scrollbar-track {
  border-radius: 10px;
}

.content-chat .content-chat-user .list-search-user-chat .user-chat {
  display: flex;
  gap: 15px;
  padding: 10px 15px;
  border-radius: 25px;
  cursor: pointer;
}

.content-chat .content-chat-user .list-search-user-chat .user-chat:hover {
  background-color: #c5e2e8;
}

.content-chat .content-chat-user .list-search-user-chat .user-chat.active {
  background-color: #c5e2e8;
}

.content-chat
  .content-chat-user
  .list-search-user-chat
  .user-chat
  .user-chat-img {
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 50%;
}

.content-chat
  .content-chat-user
  .list-search-user-chat
  .user-chat
  .user-chat-img
  img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}

.content-chat
  .content-chat-user
  .list-search-user-chat
  .user-chat
  .user-chat-img
  .online {
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 10px;
  height: 10px;
  font-size: 20px;
  background-color: #009975;
  border-radius: 50%;
  border: 3px solid #ffffff;
  box-shadow: 1px 1px 15px -4px #000;
}

.content-chat
  .content-chat-user
  .list-search-user-chat
  .user-chat
  .user-chat-img
  .offline {
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 10px;
  height: 10px;
  font-size: 20px;
  background-color: #bb4315;
  border-radius: 50%;
  border: 3px solid #ffffff;
  box-shadow: 1px 1px 15px -4px #000;
}

.content-chat .content-chat-message-user {
  /* display: none; */
  background-color: #ffffff;
  padding: 15px;
  border-radius: 25px;
  max-width: 700px;
  width: 100%;
}

.content-chat .content-chat-message-user.active {
  display: block;
}

/* .content-chat .content-chat-message-user.d-none{
    display: none;
} */

.content-chat .content-chat-message-user .head-chat-message-user {
  display: flex;
  justify-content: space-between;
  padding: 10px 15px;
  border-radius: 25px 25px 0 0;
  background-color: #19b6d3;
  margin-top: -15px;
  margin-left: -15px;
  margin-right: -15px;
}

.content-chat .content-chat-message-user .head-chat-message-user .head__side__icon img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}

.content-chat
  .content-chat-message-user
  .head-chat-message-user
  .message-user-profile
  small {
  display: flex;
  gap: 5px;
}
.content-chat .head-search-chat {
  display: flex;
  gap: 15px;
  padding: 10px 15px;
  border-radius: 25px 25px 0 0;
  background-color: #19b6d3;
  margin-top: -15px;
  margin-left: -15px;
  margin-right: -15px;
}
.content-chat .head-search-chat img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  -o-object-fit: cover;
  object-fit: cover;
}
.content-chat .head-search-chat .message-user-profile p {
  display: flex;
  gap: 5px;
  color: #ffffff;
  font-size: 10px;
}

.content-chat
  .content-chat-message-user
  .head-chat-message-user
  .message-user-profile
  .online::before {
  content: "";
  width: 10px;
  height: 10px;
  background-color: #009975;
  border-radius: 50%;
  border: 3px solid #ffffff;
  box-shadow: 1px 1px 15px -4px #000;
  display: inline-block;
  margin-right: 5px;
}
.content-chat
  .content-chat-message-user
  .head-chat-message-user
  .message-user-profile
  .offline::before {
  content: "";
  width: 10px;
  height: 10px;
  background-color: #bb4315;
  border-radius: 50%;
  border: 3px solid #ffffff;
  box-shadow: 1px 1px 15px -4px #000;
  display: inline-block;
  margin-right: 5px;
}
.content-chat .content-chat-message-user .body-chat-message-user {
  display: flex;
  flex-direction: column;
  gap: 15px;
  box-sizing: border-box;
  padding: 15px;
  height: 58dvh;
  margin: 15px 0;
  overflow: auto;
  background-color: #ececec;
  border-radius: 10px;
}

.content-chat
  .content-chat-message-user
  .body-chat-message-user::-webkit-scrollbar {
  -webkit-appearance: none;
}

.content-chat
  .content-chat-message-user
  .body-chat-message-user::-webkit-scrollbar:vertical {
  width: 10px;
  border-radius: 25px;
}

.content-chat
  .content-chat-message-user
  .body-chat-message-user::-webkit-scrollbar-button:increment,
.content-chat
  .content-chat-message-user
  .body-chat-message-user::-webkit-scrollbar-button {
  display: none;
}

.content-chat
  .content-chat-message-user
  .body-chat-message-user::-webkit-scrollbar:horizontal {
  height: 10px;
}

.content-chat
  .content-chat-message-user
  .body-chat-message-user::-webkit-scrollbar-thumb {
  background-color: #19b6d3;
  border-radius: 20px;
  border: 2px solid #f1f2f3;
}

.content-chat
  .content-chat-message-user
  .body-chat-message-user::-webkit-scrollbar-track {
  border-radius: 10px;
}

.content-chat
  .content-chat-message-user
  .body-chat-message-user
  .message-user-left {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.content-chat
  .content-chat-message-user
  .body-chat-message-user
  .message-user-left
  .message-user-left-img {
  display: flex;
  gap: 10px;
  justify-content: start;
  align-items: center;
}

.content-chat
  .content-chat-message-user
  .body-chat-message-user
  .message-user-left
  .message-user-left-img
  img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.content-chat
  .content-chat-message-user
  .body-chat-message-user
  .message-user-left
  .message-user-left-text {
  position: relative;
  padding: 15px 25px;
  background-color: #ffffff;
  border-radius: 15px;
  color: #303030;
  text-align: left;
  overflow-wrap: break-word;
  max-width: 250px;
}

.content-chat
  .content-chat-message-user
  .body-chat-message-user
  .message-user-left
  .message-user-left-text::before {
  content: "";
  position: absolute;
  top: -26px;
  left: 15px;
  border-right: 15px solid transparent;
  border-top: 15px solid transparent;
  border-left: 0px solid transparent;
  border-bottom: 15px solid #ffffff;
}

.content-chat
  .content-chat-message-user
  .body-chat-message-user
  .message-user-right {
  display: flex;
  flex-direction: column;
  align-items: end;
  gap: 15px;
}

.content-chat
  .content-chat-message-user
  .body-chat-message-user
  .message-user-right
  .message-user-right-img {
  display: flex;
  gap: 10px;
  justify-content: end;
  align-items: center;
}

.content-chat
  .content-chat-message-user
  .body-chat-message-user
  .message-user-right
  .message-user-right-img
  img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.content-chat
  .content-chat-message-user
  .body-chat-message-user
  .message-user-right
  .message-user-right-text {
  position: relative;
  padding: 15px 25px;
  background-color: #c5e2e8;
  border-radius: 15px;
  color: #303030;
  max-width: 250px;
  text-align: right;
  overflow-wrap: break-word;
}

.content-chat
  .content-chat-message-user
  .body-chat-message-user
  .message-user-right
  .message-user-right-text::before {
  content: "";
  position: absolute;
  top: -26px;
  right: 15px;
  border-right: 0px solid transparent;
  border-top: 15px solid transparent;
  border-left: 15px solid transparent;
  border-bottom: 15px solid #c5e2e8;
}

.content-chat .content-chat-message-user .footer-chat-message-user {
  background-color: #c5e2e8;
  padding: 15px 25px;
  border-radius: 15px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.content-chat
  .content-chat-message-user
  .footer-chat-message-user
  .message-user-send {
  position: relative;
  width: 100%;
}

.content-chat
  .content-chat-message-user
  .footer-chat-message-user
  .message-user-send
  input {
  box-sizing: border-box;
  width: 100%;
  padding: 10px 15px;
  border-radius: 25px;
  outline: none;
  border: 2px solid #949494;
}

.content-chat .content-chat-message-user .footer-chat-message-user button {
  font-size: 18px;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: none;
  background-color: #19b6d3;
  color: #ffffff;
  cursor: pointer;
}

.content-chat
  .content-chat-message-user
  .footer-chat-message-user
  button:hover {
  background-color: #daa520;
}
.onlineUser::before {
  content: "";
  display: block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: green;
  margin-right: 10px;
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

.user-header-icons{
  font-size: 18px;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: none;
  background-color: #c5e2e8;
  color: #ffffff;
  cursor: pointer;
}


@media (max-width: 913px) {
  .content-chat {
    padding: 0px;
  }

  .content-chat .content-chat-user {
    max-width: 300px;
    width: 100%;
  }

  .content-chat .content-chat-message-user {
    background-color: #ffffff;
    padding: 15px;
    border-radius: 25px;
    max-width: 600px;
    width: 100%;
  }
}

@media (max-width: 728px) {
  .content-chat {
    display: flex;
    flex-direction: column;
  }

  .content-chat .content-chat-user {
    box-sizing: border-box;
    max-width: 1000px;
    width: 100%;
  }

  .content-chat .content-chat-message-user {
    box-sizing: border-box;
    max-width: 1000px;
    width: 100%;
  }

  .content-chat .content-chat-user .list-search-user-chat {
    box-sizing: border-box;
    max-width: -moz-fit-content;
    max-width: fit-content;
    display: flex;
    flex-direction: row;
    margin: 0 auto;
    overflow-x: auto;
    max-height: -moz-fit-content;
    max-height: fit-content;
    padding: 15px;
    height: 100%;
  }

  .content-chat .content-chat-user .list-search-user-chat::-webkit-scrollbar {
    -webkit-appearance: none;
  }

  .content-chat
    .content-chat-user
    .list-search-user-chat::-webkit-scrollbar:vertical {
    width: 10px;
  }

  .content-chat
    .content-chat-user
    .list-search-user-chat::-webkit-scrollbar-button:increment,
  .content-chat
    .content-chat-user
    .list-search-user-chat::-webkit-scrollbar-button {
    display: none;
  }

  .content-chat
    .content-chat-user
    .list-search-user-chat::-webkit-scrollbar:horizontal {
    height: 10px;
  }

  .content-chat
    .content-chat-user
    .list-search-user-chat::-webkit-scrollbar-thumb {
    background-color: #19b6d3;
    border-radius: 20px;
    border: 2px solid #f1f2f3;
  }

  .content-chat
    .content-chat-user
    .list-search-user-chat::-webkit-scrollbar-track {
    border-radius: 10px;
  }

  .content-chat .content-chat-user .list-search-user-chat .user-chat {
    padding: 10px;
    background-color: #19b6d3;
    max-height: -moz-fit-content;
    max-height: fit-content;
    border-radius: 50%;
  }

  .content-chat
    .content-chat-user
    .list-search-user-chat
    .user-chat
    .user-chat-text {
    display: none;
  }
}
</style>
