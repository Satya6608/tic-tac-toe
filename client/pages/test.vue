<template>
  <div class="tic-tac-toe">
    <div class="grid" v-for="n in 3" :key="n">
      <button
        v-for="(m, i) in 3"
        :key="i"
        class="cell"
        :class="{ 'x': gameBoard[n * 3 + m - 1] === 'X', 'o': gameBoard[n * 3 + m - 1] === 'O' }"
        @click="handleCellClick(n * 3 + m - 1)"
        :disabled="!gameActive || gameBoard[n * 3 + m - 1]"
      >
        {{ gameBoard[n * 3 + m - 1] || '' }}
      </button>
    </div>
    <div v-if="!gameActive">
      <p v-if="winner">{{ winner === 'X' ? 'ARMY Wins!' : 'BTS Wins!' }}</p>
      <p v-else>Game Draw!</p>
      <button @click="resetGame">Reset Game</button>
    </div>
    <p v-else id="gameMessage"></p>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

const gameBoard = ref(['', '', '', '', '', '', '', '', '']);
let gameActive = ref(false);
let currentPlayer = ref('X');

const winConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const winner = computed(() => {
  for (const condition of winConditions) {
    const [a, b, c] = condition;
    if (gameBoard.value[a] && gameBoard.value[a] === gameBoard.value[b] && gameBoard.value[a] === gameBoard.value[c]) {
      return gameBoard.value[a];
    }
  }
  return null;
});

const handleCellClick = (clickedCellIndex) => {
    console.log("handleCellClick" + clickedCellIndex)
  if (gameBoard.value[clickedCellIndex] !== '' || !gameActive.value) return;
  gameBoard.value[clickedCellIndex] = currentPlayer.value;
  checkForWinOrDraw();
  currentPlayer.value = currentPlayer.value === 'X' ? 'O' : 'X';
};

const checkForWinOrDraw = () => {
  if (winner.value) {
    gameActive.value = false;
    return;
  }

  const roundDraw = !gameBoard.value.includes('');
  if (roundDraw) {
    gameActive.value = false;
    return;
  }
};

const resetGame = () => {
  gameBoard.value = ['', '', '', '', '', '', '', '', ''];
  gameActive.value = true;
  currentPlayer.value = 'X';
};
</script>

<style scoped>
.tic-tac-toe {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.cell {
  width: 100px;
  height: 100px;
  border: 1px solid black;
  font-size: 3rem;
  text-align: center;
  cursor: pointer;
  background-color: #ddd;
}

.cell.x {
  background-color: #f00;
  color: #fff;
}
</style>