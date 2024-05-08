<template>
  <div>
    <div class="game-container">
      <div>
        <h1>tic-tac-toe 💜</h1>
      </div>
      <div v-if="!winner && history.length !== 10">
        <b>{{ currentPlayer }}</b>'s Turn
      </div>
      <div v-else-if="winner">
        Winner <b>{{ winner }}</b>
      </div>
      <div v-else>Match is Draw</div>
      <div id="game-board">
        <div class="row" v-for="(m, i) in 3" :key="i">
          <div
            class="cell"
            id="cell-1"
            v-for="(n, inx) in 3"
            :key="inx"
            @click="handleClick(m, n)"
          >
            {{ getVal(m, n) }}
          </div>
        </div>
      </div>
      <div id="gameMessage" class="game-message"></div>
      <button id="resetButton" v-if="winner" @click="resetData()">
        Reset Game
      </button>
      <div v-else-if="history.length == 10">
        Match Draw
        <button id="resetButton" @click.prevent="resetData()">
          Reset Game
        </button>
      </div>
      <ChatBoard />
      <Award />
    </div>
  </div>
</template>

<script setup>
import Award from "~/components/Award.vue";
import ChatBoard from "~/components/ChatBoard.vue";
import { ref, watch } from "vue";
import axios from "axios";
import { useGameStore } from "~/store/gameStore.js";
import { storeToRefs } from "pinia";
import { useAuthStore } from "~/store/auth.js";
import { io } from 'socket.io-client';
import { useUserStore } from "~/store/users.js";
const userStore = useUserStore();
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const socket = io(process.env.APP_URL);
import { useRouter } from 'vue-router';
const router = useRouter();

import auth from "~/middleware/auth.js";
definePageMeta({
  middleware: ["auth"],
});

const gameStore = useGameStore();
const { history, stepNo, currentPlayer, winner, oponentPlayer } =
  storeToRefs(gameStore);

const calculateWinner = function (squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null;
};

const getVal = (i, j) => {
  const idx = 3 * (i - 1) + (j - 1);
  return history.value[stepNo.value]["squares"][idx];
};

const resetData = () => {
  gameStore.reset();
};

const handleClick = (i, j, from) => {
  if(currentPlayer.value == user?.value.username || from == "server"){
    const idx = 3 * (i - 1) + (j - 1);
  // socket.emit("move", idx);
  let ghistory = history.value.slice(0, stepNo.value + 1);
  let current = ghistory[ghistory.length - 1];
  let squares = current.squares.slice();
  if (current.winner || squares[idx]) {
    // alert("winner" + current.winner);
    return;
  }
  squares[idx] = currentPlayer.value;

  let winner = calculateWinner(squares);
  let payload = {
    squares: squares,
    winner: winner,
    player:
      currentPlayer.value,
  };
  gameStore.addHistory(ghistory.concat([payload]));
  makeMove(i, j)
  if (winner) {
    gameStore.setWinner(winner);
  }
  gameStore.togglePlayer(currentPlayer.value);
  }else return;
};
const getRandomNumber = () => {
  return Math.random();
};

// const joinGame = () =>{
//   // Emit join game event with user ID
//   const userId = user?.value?._id; // Implement this function to get user ID
//   socket.emit('joinGame', userId);
// }
const makeMove = (i, j) => {
  // Emit player move event with move data
  socket.emit('makeMove', i, j);
}


const setGameData = async() => {
   try {
    const res = await axios.post(`${process.env.APP_URL}api/game`, {
      user: user?.value?._id,
      history:history?.value[history?.value.length - 1]["squares"],
      opponent:oponentPlayer?.value,
      winner: winner?.value,
    });
    if (res.data) {
      console.log(res.data)
    } else {
      throw new Error(res.data.message);
    }
  } catch (err) {
    console.error("something went wrong", err);
  }
}

watch(winner, async ()=>{
  if(winner.value){
    setGameData()
  }
  setTimeout(() => {
    gameStore.reset();
  }, 3000);
})
onMounted(async () => {
  if(!oponentPlayer.value) router.push('/profile');
    socket.on('gameStateUpdated', (updatedGameStatei, updatedGameStatej) => {
      handleClick(updatedGameStatei, updatedGameStatej, "server")
    });
    socket.emit("authenticate", user?.value._id);
    // joinGame();
});
</script>

<style scoped>
.game-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 50px 0;
}
#game-board {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.cell {
  background-color: #fff;
  border: 2px solid #27296d;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  cursor: pointer;
  transition: background-color 0.3 ease;
  width: 100px;
  height: 100px;
  margin-bottom: 6px;
  border-radius: 20px;
}

.cell:hover {
  background-color: #dcd6f7;
}

.game-message {
  text-align: center;
  margin-top: 20px;
  font-size: 24px;
  color: #fff;
}

button {
  background-color: #27296d;
  color: #fff;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 20px;
  border-radius: 30px;
  padding: 10px;
  margin-top: 20px;
  border-style: none;
}

button:hover {
  background-color: rgb(107, 116, 179);
  color: #dcd6f7;
}

@media (max-width: 600px) {
  .cell {
    width: 60px;
    height: 60px;
    border: 1.3px solid #27296d;
  }

  #game-board {
    grid-template-columns: repeat(3, 60px);
    grid-template-rows: repeat(3, 60px);
  }
}
</style>