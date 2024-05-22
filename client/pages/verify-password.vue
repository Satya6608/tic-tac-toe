<template>
  <div class="flex justify-center">
    <div class="w-full md:w-1/2 lg:w-1/3 min-w-[500px]">
      <div class="card bg-white mb-5 mt-5 border-0 shadow-md">
        <div class="card-body p-5 text-center">
          <h4 class="text-lg font-semibold mb-2">Verify</h4>
          <p class="text-sm text-gray-600 mb-4">Your code was sent to you via email</p>

          <div class="otp-field mb-4">
            <input
              v-for="(input, index) in otpValues"
              :key="index"
              ref="otpInput"
              v-model="otpValues[index]"
              :type="'number'"
              :disabled="isDisabled(index)"
              @input="handleInput(index)"
              class="w-10 h-10 mr-1 border border-gray-300 rounded text-center focus:outline-none focus:border-blue-400"
            />
          </div>

          <button
            class="mb-3 text-white rounded px-5 py-2 text-center"
            :class="{ 'bg-blue-700 hover:bg-blue-600': isButtonActive, 'bg-blue-400 cursor-not-allowed': !isButtonActive }"
            @click="verify"
            :disabled="!isButtonActive"
          >
            Verify
          </button>

          <p class="text-xs text-gray-500 mb-0">
            Didn't receive code? <a href="#" class="text-blue-500 hover:text-blue-600">Request again</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
const otpValues = ref(["", "", "", "", "", ""]);
const otpInput = ref('');
const handleInput = (index) => {
  if (otpValues.value[index].length > 1) {
    otpValues.value[index] = "";
    return;
  }

  if (index < 5 && otpValues.value[index] !== "") {
    otpValues.value[index + 1] = "";
  }
  if(otpInput.value.length > index + 1){
    otpInput.value[index + 1].focus()
  }
  checkButtonState()
};

const isDisabled = (index) => {
  if(otpValues.value[index - 1] === ""){
    // otpInput.value[index - 1].focus()
    return true;
  }
  // return otpValues.value[index - 1] === "";
};

const isButtonActive = ref(false);

const verify = () => {
  // Add your verification logic here
  console.log("Verifying...");
};

const checkButtonState = () => {
  isButtonActive.value =
    otpValues.value.every((val) => val !== "") && !isDisabled(6);
};
onMounted(() => {
    // const inputs = document.querySelectorAll(".otp-field > input");
    // inputs[0].focus();
});
</script>

<style scoped>
.otp-field {
  flex-direction: row;
  column-gap: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.otp-field input {
  height: 45px;
  width: 42px;
  border-radius: 6px;
  outline: none;
  font-size: 1.125rem;
  text-align: center;
  border: 1px solid #ddd;
}
.otp-field input:focus {
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.1);
}
.otp-field input::-webkit-inner-spin-button,
.otp-field input::-webkit-outer-spin-button {
  display: none;
}

.resend {
  font-size: 12px;
}
</style>