<template>
  <div class="flex justify-center m-5">
    <button @click="fetchData">fetchData</button>
    <canvas ref="graphCanvas" width="800" height="400"></canvas>
    <div class="overlay" v-if="displayText">
      <span>{{ displayText }}</span>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from "vue";

export default {
  setup() {
    const graphCanvas = ref(null);
    const dataPoints = ref([]);
    const canvasWidth = 800;
    const canvasHeight = 400;
    let time = 0;
    const displayText = ref("");

    // Initial static data points
    const initialData = [
      { x: 0, y: 0 },
      { x: 1, y: 0.5 },
      { x: 2, y: 1 },
      { x: 3, y: 1.5 },
      { x: 4, y: 2 },
    ];

    // Add initial data points to dataPoints
    dataPoints.value.push(...initialData);

    // Function to simulate receiving data from a streaming API
    const fetchData = () => {
      time += 0.1;
      const x = initialData.length + time;
      const y = Math.exp((initialData.length + time) / 5); // Exponential growth
      dataPoints.value.push({ x, y });
      drawGraph();
    };

    const drawGraph = () => {
      const ctx = graphCanvas.value.getContext("2d");
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      // Determine the maximum x and y values
      const maxX = Math.max(...dataPoints.value.map((p) => p.x));
      const maxY = Math.max(...dataPoints.value.map((p) => p.y));

      // Define scale factors
      const xScale = canvasWidth / maxX;
      const yScale = canvasHeight / maxY;

      ctx.beginPath();
      ctx.moveTo(0, canvasHeight);

      dataPoints.value.forEach((point) => {
        const x = point.x * xScale;
        const y = canvasHeight - point.y * yScale;
        ctx.lineTo(x, y);
      });

      ctx.lineTo(
        dataPoints.value[dataPoints.value.length - 1].x * xScale,
        canvasHeight
      );
      ctx.closePath();
      ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
      ctx.fill();

      ctx.strokeStyle = "red";
      ctx.lineWidth = 2;
      ctx.stroke();
    };

    let fetchInterval;

    // onMounted(() => {
    //   fetchInterval = setInterval(fetchData, 1000); // Fetch new data every second
    // });

    // onUnmounted(() => {
    //   clearInterval(fetchInterval);
    // });

    return {
      graphCanvas,
      displayText,
      fetchData,
    };
  },
};
</script>

<style>
canvas {
  border: 1px solid black;
}

.overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 48px;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
}
</style>
