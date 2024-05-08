<template>
  <div id="app">
    <div class="game-container">
      <div class="chat-container">
        <div class="chat-messages">
          <div v-for="message in chatMessages" :key="message._id">{{ message.senderId }}: {{ message.message }}</div>
        </div>
        <input type="text" v-model="newMessage" @keyup.enter="sendMessage" placeholder="Type your message...">
        <button @click="sendMessage">Send</button>
      </div>
      <div class="game-board">
        <!-- Tic Tac Toe board goes here -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useGameStore } from "~/store/gameStore.js";
const gameStore = useGameStore();
import { useAuthStore } from "~/store/auth.js";
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const { oponentPlayerId } = storeToRefs(gameStore);
import { io } from 'socket.io-client';
import { onMounted } from "vue";
const socket = io(process.env.APP_URL);


const chatMessages = ref([])
const newMessage = ref('')

const sendMessage = () => {
    // Assuming opponentId is known
    const opponentId = oponentPlayerId?.value; // Get opponent's ID
    console.log(opponentId, 'opponentId')
    socket.emit('chatMessage', { senderId: user?.value?._id, receiverId: opponentId, message: newMessage.value });
    newMessage.value = ''; // Clear input field after sending
  };

onMounted(async () => {
  socket.on('chatMessageSend', ({ message }) => {
    console.log(message, 'chatMessage', chatMessages?.value)
    chatMessages?.value.push({ message });
  });
  // console.log(process.env.BASE_URL, "env")
  // socket.on('chatMessageSend', (message) => {
  //   console.log(message, 'chatMessage')
  //     // Scroll to bottom of chat container
  //     // this.$refs.chatMessages.scrollTop = this.$refs.chatMessages.scrollHeight;
  //   });
});
</script>

<style>

</style>