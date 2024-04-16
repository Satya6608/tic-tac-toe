<template>
  <div class="cell" :class="{ 'player-x': value === 'X', 'player-o': value === 'O' }">
    <p>{{ value }}</p>
  </div>
</template>

<script>
export default {
  props: {
    value: String, // Cell's current value (X, O, or null)
  },
};
</script>

<style scoped>
.cell {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 100px;
  font-size: 3rem;
  font-weight: bold;
  cursor: pointer;
  border: 1px solid #ddd;
  transition: background-color 0.2s ease-in-out;
}

.cell:hover {
  background-color: #f5f5f5;
}

.player-x {
  color: #388e3c;
}

.player-o {
  color: #d32f2f;
}
</style>
