<template>
  <div class="typingIndicatorContainer">
    <div class="typingIndicatorBubble">
      <div class="typingIndicatorBubbleDot"></div>
      <div class="typingIndicatorBubbleDot"></div>
      <div class="typingIndicatorBubbleDot"></div>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style>

.typingIndicatorContainer {
  display: flex;
  flex: none;
  align-items: flex-end;
  /* margin: $spacing4 0; */
}

.typingIndicatorBubble {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 40px;
  margin: 0px 8px;
  background-color: #f0f1f1;
  border-radius: 12px;
}

.typingIndicatorBubbleDot {
  width: 4px;
  height: 4px;
  margin-right: 4px;
  background-color: #57585a;
  border-radius: 50%;
  animation-name: bounce;
  animation-duration: 1.3s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

.typingIndicatorBubbleDot:first-of-type {
  margin: 0px 4px;
}

.typingIndicatorBubbleDot:nth-of-type(2) {
  animation-delay: 0.15s;
}

.typingIndicatorBubbleDot:nth-of-type(3) {
  animation-delay: 0.3s;
}

@keyframes bounce {
  0%,
  60%,
  100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-4px);
  }
}

</style>