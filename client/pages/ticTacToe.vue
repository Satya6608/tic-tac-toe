<template>
  <div>
    <div class="game-container">
      <div>
        <h1>tic-tac-toe 💜</h1>
      </div>
      <div v-if="!winner && history.length !== 10">
        Next Player is <b>{{ currentPlayer }}</b>
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
      <Award />
    </div>
  </div>
</template>

<script setup>
import Award from "~/components/Award.vue";
import { ref, watch } from "vue";
import axios from "axios";
import { useGameStore } from "~/store/gameStore.js";
import { storeToRefs } from "pinia";
import { useAuthStore } from "~/store/auth.js";
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

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
      return squares[a];
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

const handleClick = (i, j) => {
  const idx = 3 * (i - 1) + (j - 1);
  let ghistory = history.value.slice(0, stepNo.value + 1);
  let current = ghistory[ghistory.length - 1];
  let squares = current.squares.slice();
  if (current.winner || squares[idx]) {
    alert("winner" + current.winner);
    return;
  }
  squares[idx] = currentPlayer.value;

  let winner = calculateWinner(squares);
  let payload = {
    squares: squares,
    winner: winner,
    player:
      currentPlayer.value == user?.value?.username ? oponentPlayer : user?.value.username,
  };
  gameStore.addHistory(ghistory.concat([payload]));
  if (winner) {
    gameStore.setWinner(winner);
  }
  gameStore.togglePlayer(currentPlayer.value);
};
const getRandomNumber = () => {
  return Math.random();
};
const setGameData = async() => {
   try {
    const res = await axios.post("http://localhost:7000/api/game", {
      user: user?.value?._id,
      history:history?.value[history?.value.length - 1]["squares"],
      opponent:oponentPlayer?.value,
      winner: winner?.value,
    });
    if (res.data) {
      console.log(res.data);
      // const token = res.data.token;
      // const user = res.data.user;
      // // authStore.login(token, user);
      // // router.push("/");
      // reset()
    } else {
      throw new Error(res.data.message);
    }
  } catch (err) {
    console.error("something went wrong", err);
  }
}

watch(winner, async ()=>{
  if(winner.value){
    console.log(winner.value, "winnersdfghjkljhgfdsfghj");
    setGameData()
  } 
  setTimeout(() => {
    gameStore.reset();
  }, 3000);
})
onMounted(async () => {
  if(!oponentPlayer.value) router.push('/profile')
  const randomNumber1 = getRandomNumber();
  const randomNumber2 = getRandomNumber();
    if (randomNumber1 < randomNumber2) {
      await gameStore.changePlayer(user?.value?.username);
    } else if (randomNumber1 > randomNumber2) {
      await gameStore.changePlayer(oponentPlayer.value)
    } else {
      await gameStore.changePlayer(user?.value?.username);
    }
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

.cell.X {
  background: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4IiB3aWR0aD0iNDgwIiBoZWlnaHQ9IjQ4MCIgdmlld0JveD0iMCwwLDI1NiwyNTYiCnN0eWxlPSJmaWxsOiMwMDAwMDA7Ij4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTYuNCwtNi40KSBzY2FsZSgxLjA1LDEuMDUpIj48ZyBmaWxsLW9wYWNpdHk9IjAiIGZpbGw9IiMyNzI5NmQiIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1kYXNoYXJyYXk9IiIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjAiIGZvbnQtZmFtaWx5PSJub25lIiBmb250LXdlaWdodD0ibm9uZSIgZm9udC1zaXplPSJub25lIiB0ZXh0LWFuY2hvcj0ibm9uZSIgc3R5bGU9Im1peC1ibGVuZC1tb2RlOiBub3JtYWwiPjxwYXRoIGQ9Ik02LjA5NTI0LDI0OS45MDQ3NnYtMjQzLjgwOTUyaDI0My44MDk1MnYyNDMuODA5NTJ6IiBpZD0iYmdSZWN0YW5nbGUiPjwvcGF0aD48L2c+PGcgZmlsbD0iIzI3Mjk2ZCIgZmlsbC1ydWxlPSJub256ZXJvIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc3Ryb2tlLWRhc2hhcnJheT0iIiBzdHJva2UtZGFzaG9mZnNldD0iMCIgZm9udC1mYW1pbHk9Im5vbmUiIGZvbnQtd2VpZ2h0PSJub25lIiBmb250LXNpemU9Im5vbmUiIHRleHQtYW5jaG9yPSJub25lIiBzdHlsZT0ibWl4LWJsZW5kLW1vZGU6IG5vcm1hbCI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCwyLjY2NjY3KSBzY2FsZSg1LjMzMzMzLDUuMzMzMzMpIj48cGF0aCBkPSJNMTQsMjVsOSwtM3YtMTVsLTksLTZ6Ij48L3BhdGg+PHBhdGggZD0iTTE0LDQxbDksNXYtMjJsLTksM3oiPjwvcGF0aD48cGF0aCBkPSJNMzQsMjVsLTksLTN2LTE1bDksLTZ6Ij48L3BhdGg+PHBhdGggZD0iTTM0LDQxbC05LDV2LTIybDksM3oiPjwvcGF0aD48L2c+PC9nPjwvZz4KPC9zdmc+")
    50% 50% no-repeat;
  background-size: 80px;
  background-color: #fff;
  display: flex;
}

.cell.O {
  background: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4IiB3aWR0aD0iNDgwIiBoZWlnaHQ9IjQ4MCIgdmlld0JveD0iMCwwLDI1NiwyNTYiCnN0eWxlPSJmaWxsOiMwMDAwMDA7Ij4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTI1LjYsLTI1LjYpIHNjYWxlKDEuMiwxLjIpIj48ZyBmaWxsLW9wYWNpdHk9IjAiIGZpbGw9IiNkZGRkZGQiIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1kYXNoYXJyYXk9IiIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjAiIGZvbnQtZmFtaWx5PSJub25lIiBmb250LXdlaWdodD0ibm9uZSIgZm9udC1zaXplPSJub25lIiB0ZXh0LWFuY2hvcj0ibm9uZSIgc3R5bGU9Im1peC1ibGVuZC1tb2RlOiBub3JtYWwiPjxwYXRoIGQ9Ik0yMS4zMzMzMywyMzQuNjY2Njd2LTIxMy4zMzMzM2gyMTMuMzMzMzN2MjEzLjMzMzMzeiIgaWQ9ImJnUmVjdGFuZ2xlIj48L3BhdGg+PC9nPjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49Im5vbmUiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc3Ryb2tlLWRhc2hhcnJheT0iIiBzdHJva2UtZGFzaG9mZnNldD0iMCIgZm9udC1mYW1pbHk9Im5vbmUiIGZvbnQtd2VpZ2h0PSJub25lIiBmb250LXNpemU9Im5vbmUiIHRleHQtYW5jaG9yPSJub25lIiBzdHlsZT0ibWl4LWJsZW5kLW1vZGU6IG5vcm1hbCI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCw0NC40OCkgc2NhbGUoNi40LDYuNCkiPjxwYXRoIGQ9Ik0xOC41LDIzLjU5MWwtOSwyLjkwOXYtMjZsOS4wMDYsNnoiIGZpbGw9IiMyNzI5NmQiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciI+PC9wYXRoPjxwYXRoIGQ9Ik0yMS41LDIzLjU5MWw5LDIuOTA5di0yNmwtOSw2eiIgZmlsbD0iIzI3Mjk2ZCIgc3Ryb2tlPSJub25lIiBzdHJva2UtbGluZWpvaW49Im1pdGVyIj48L3BhdGg+PHBhdGggZD0iTTE4LjUsMjMuNTkxbC05LDIuOTA5di0yNmw5LjAwNiw2eiIgZmlsbD0ibm9uZSIgc3Ryb2tlLW9wYWNpdHk9IjAiIHN0cm9rZT0iIzY2Nzk4ZiIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PC9wYXRoPjxwYXRoIGQ9Ik0yMS41LDIzLjU5MWw5LDIuOTA5di0yNmwtOSw2eiIgZmlsbD0ibm9uZSIgc3Ryb2tlLW9wYWNpdHk9IjAiIHN0cm9rZT0iIzY2Nzk4ZiIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PC9wYXRoPjxwYXRoIGQ9Ik0xNy44MTgsMzFoMS4xNzZ2OGgydi04aDEuMTc2bDAuODI0LC0yaC02eiIgZmlsbC1vcGFjaXR5PSIwIiBmaWxsPSIjNjY3OThmIiBzdHJva2U9Im5vbmUiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiPjwvcGF0aD48cGF0aCBkPSJNMTIuOTk0LDI5aC0zdjEwaDNjMS4xMDMsMCAyLC0wLjg5NyAyLC0ydi0yYzAsLTAuMzY2IC0wLjEwNiwtMC43MDUgLTAuMjc4LC0xYzAuMTcyLC0wLjI5NSAwLjI3OCwtMC42MzQgMC4yNzgsLTF2LTJjMCwtMS4xMDMgLTAuODk3LC0yIC0yLC0yek0xMS45OTQsMzFoMWwwLjAwMSwyaC0wLjAwMWgtMXpNMTEuOTk0LDM3di0yaDFsMC4wMDEsMnoiIGZpbGwtb3BhY2l0eT0iMCIgZmlsbD0iIzY2Nzk4ZiIgc3Ryb2tlPSJub25lIiBzdHJva2UtbGluZWpvaW49Im1pdGVyIj48L3BhdGg+PHBhdGggZD0iTTI5Ljk5NCwzMnYtMWMwLC0xLjEwMyAtMC44OTcsLTIgLTIsLTJoLTFjLTEuMTAzLDAgLTIsMC44OTcgLTIsMnYxLjQ2NWMwLDAuNjcgMC4zMzMsMS4yOTIgMC44OTEsMS42NjRsMi4xMDksMS40MDZ2MS40NjVoLTF2LTFoLTJ2MWMwLDEuMTAzIDAuODk3LDIgMiwyaDFjMS4xMDMsMCAyLC0wLjg5NyAyLC0ydi0xLjQ2NWMwLC0wLjY3IC0wLjMzMywtMS4yOTIgLTAuODkxLC0xLjY2NGwtMi4xMDksLTEuNDA2di0xLjQ2NWgxdjF6IiBmaWxsLW9wYWNpdHk9IjAiIGZpbGw9IiM2Njc5OGYiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciI+PC9wYXRoPjwvZz48L2c+PC9nPgo8L3N2Zz4=")
    50% 50% no-repeat;
  background-size: 80px;
  background-color: #fff;
  display: flex;
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

  .cell.X {
    background: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4IiB3aWR0aD0iNDgwIiBoZWlnaHQ9IjQ4MCIgdmlld0JveD0iMCwwLDI1NiwyNTYiCnN0eWxlPSJmaWxsOiMwMDAwMDA7Ij4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTYuNCwtNi40KSBzY2FsZSgxLjA1LDEuMDUpIj48ZyBmaWxsLW9wYWNpdHk9IjAiIGZpbGw9IiMyNzI5NmQiIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1kYXNoYXJyYXk9IiIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjAiIGZvbnQtZmFtaWx5PSJub25lIiBmb250LXdlaWdodD0ibm9uZSIgZm9udC1zaXplPSJub25lIiB0ZXh0LWFuY2hvcj0ibm9uZSIgc3R5bGU9Im1peC1ibGVuZC1tb2RlOiBub3JtYWwiPjxwYXRoIGQ9Ik02LjA5NTI0LDI0OS45MDQ3NnYtMjQzLjgwOTUyaDI0My44MDk1MnYyNDMuODA5NTJ6IiBpZD0iYmdSZWN0YW5nbGUiPjwvcGF0aD48L2c+PGcgZmlsbD0iIzI3Mjk2ZCIgZmlsbC1ydWxlPSJub256ZXJvIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc3Ryb2tlLWRhc2hhcnJheT0iIiBzdHJva2UtZGFzaG9mZnNldD0iMCIgZm9udC1mYW1pbHk9Im5vbmUiIGZvbnQtd2VpZ2h0PSJub25lIiBmb250LXNpemU9Im5vbmUiIHRleHQtYW5jaG9yPSJub25lIiBzdHlsZT0ibWl4LWJsZW5kLW1vZGU6IG5vcm1hbCI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCwyLjY2NjY3KSBzY2FsZSg1LjMzMzMzLDUuMzMzMzMpIj48cGF0aCBkPSJNMTQsMjVsOSwtM3YtMTVsLTksLTZ6Ij48L3BhdGg+PHBhdGggZD0iTTE0LDQxbDksNXYtMjJsLTksM3oiPjwvcGF0aD48cGF0aCBkPSJNMzQsMjVsLTksLTN2LTE1bDksLTZ6Ij48L3BhdGg+PHBhdGggZD0iTTM0LDQxbC05LDV2LTIybDksM3oiPjwvcGF0aD48L2c+PC9nPjwvZz4KPC9zdmc+")
      50% 50% no-repeat;
    background-size: 40px;
    background-color: #fff;
    display: flex;
  }

  .cell.O {
    background: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4IiB3aWR0aD0iNDgwIiBoZWlnaHQ9IjQ4MCIgdmlld0JveD0iMCwwLDI1NiwyNTYiCnN0eWxlPSJmaWxsOiMwMDAwMDA7Ij4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTI1LjYsLTI1LjYpIHNjYWxlKDEuMiwxLjIpIj48ZyBmaWxsLW9wYWNpdHk9IjAiIGZpbGw9IiNkZGRkZGQiIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1kYXNoYXJyYXk9IiIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjAiIGZvbnQtZmFtaWx5PSJub25lIiBmb250LXdlaWdodD0ibm9uZSIgZm9udC1zaXplPSJub25lIiB0ZXh0LWFuY2hvcj0ibm9uZSIgc3R5bGU9Im1peC1ibGVuZC1tb2RlOiBub3JtYWwiPjxwYXRoIGQ9Ik0yMS4zMzMzMywyMzQuNjY2Njd2LTIxMy4zMzMzM2gyMTMuMzMzMzN2MjEzLjMzMzMzeiIgaWQ9ImJnUmVjdGFuZ2xlIj48L3BhdGg+PC9nPjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49Im5vbmUiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc3Ryb2tlLWRhc2hhcnJheT0iIiBzdHJva2UtZGFzaG9mZnNldD0iMCIgZm9udC1mYW1pbHk9Im5vbmUiIGZvbnQtd2VpZ2h0PSJub25lIiBmb250LXNpemU9Im5vbmUiIHRleHQtYW5jaG9yPSJub25lIiBzdHlsZT0ibWl4LWJsZW5kLW1vZGU6IG5vcm1hbCI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCw0NC40OCkgc2NhbGUoNi40LDYuNCkiPjxwYXRoIGQ9Ik0xOC41LDIzLjU5MWwtOSwyLjkwOXYtMjZsOS4wMDYsNnoiIGZpbGw9IiMyNzI5NmQiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciI+PC9wYXRoPjxwYXRoIGQ9Ik0yMS41LDIzLjU5MWw5LDIuOTA5di0yNmwtOSw2eiIgZmlsbD0iIzI3Mjk2ZCIgc3Ryb2tlPSJub25lIiBzdHJva2UtbGluZWpvaW49Im1pdGVyIj48L3BhdGg+PHBhdGggZD0iTTE4LjUsMjMuNTkxbC05LDIuOTA5di0yNmw5LjAwNiw2eiIgZmlsbD0ibm9uZSIgc3Ryb2tlLW9wYWNpdHk9IjAiIHN0cm9rZT0iIzY2Nzk4ZiIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PC9wYXRoPjxwYXRoIGQ9Ik0yMS41LDIzLjU5MWw5LDIuOTA5di0yNmwtOSw2eiIgZmlsbD0ibm9uZSIgc3Ryb2tlLW9wYWNpdHk9IjAiIHN0cm9rZT0iIzY2Nzk4ZiIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PC9wYXRoPjxwYXRoIGQ9Ik0xNy44MTgsMzFoMS4xNzZ2OGgydi04aDEuMTc2bDAuODI0LC0yaC02eiIgZmlsbC1vcGFjaXR5PSIwIiBmaWxsPSIjNjY3OThmIiBzdHJva2U9Im5vbmUiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiPjwvcGF0aD48cGF0aCBkPSJNMTIuOTk0LDI5aC0zdjEwaDNjMS4xMDMsMCAyLC0wLjg5NyAyLC0ydi0yYzAsLTAuMzY2IC0wLjEwNiwtMC43MDUgLTAuMjc4LC0xYzAuMTcyLC0wLjI5NSAwLjI3OCwtMC42MzQgMC4yNzgsLTF2LTJjMCwtMS4xMDMgLTAuODk3LC0yIC0yLC0yek0xMS45OTQsMzFoMWwwLjAwMSwyaC0wLjAwMWgtMXpNMTEuOTk0LDM3di0yaDFsMC4wMDEsMnoiIGZpbGwtb3BhY2l0eT0iMCIgZmlsbD0iIzY2Nzk4ZiIgc3Ryb2tlPSJub25lIiBzdHJva2UtbGluZWpvaW49Im1pdGVyIj48L3BhdGg+PHBhdGggZD0iTTI5Ljk5NCwzMnYtMWMwLC0xLjEwMyAtMC44OTcsLTIgLTIsLTJoLTFjLTEuMTAzLDAgLTIsMC44OTcgLTIsMnYxLjQ2NWMwLDAuNjcgMC4zMzMsMS4yOTIgMC44OTEsMS42NjRsMi4xMDksMS40MDZ2MS40NjVoLTF2LTFoLTJ2MWMwLDEuMTAzIDAuODk3LDIgMiwyaDFjMS4xMDMsMCAyLC0wLjg5NyAyLC0ydi0xLjQ2NWMwLC0wLjY3IC0wLjMzMywtMS4yOTIgLTAuODkxLC0xLjY2NGwtMi4xMDksLTEuNDA2di0xLjQ2NWgxdjF6IiBmaWxsLW9wYWNpdHk9IjAiIGZpbGw9IiM2Njc5OGYiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciI+PC9wYXRoPjwvZz48L2c+PC9nPgo8L3N2Zz4=")
      50% 50% no-repeat;
    background-size: 40px;
    background-color: #fff;
    display: flex;
  }
}

@media (max-width: 230px) {
  body {
    background: white;
  }

  #game-board {
    display: none;
  }

  button {
    display: none;
  }
  h1 {
    display: none;
  }
  .game-message {
    display: none;
  }

  h1#hiddenMessage {
    display: flex;
    color: black;
    font-size: 24px;
    font-family: Arial, Helvetica, sans-serif;
  }
}
</style>