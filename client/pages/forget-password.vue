<template>
  <div class="flex justify-center my-5">
    <div class="form-container">
      <div
        class="login-container"
        id="login-container"
        :style="`transform : ${loginTransform.transform}; width: ${loginTransform.width}; padding: ${loginTransform.padding}`"
      >
        <h1 class="title">Forget Password</h1>
        <!-- <p class="desc"></p> -->
        <div class="input-container">
          <input
            type="text"
            placeholder="username/email"
            autofocus="on"
            v-model="username"
            @keyup.enter="generateOtp()"
          />
        </div>
        <div class="account-controls">
          <nuxt-link to="/">Go Back To Login</nuxt-link>
          <button @click="generateOtp()">
            Next <i class="fas fa-solid fa-angle-right"></i>
          </button>
        </div>
      </div>
      <div
        class="placeholder-banner hidden md:block"
        id="banner"
        :style="{ transform: banner }"
      >
        <img
          src="https://img.freepik.com/free-vector/abstract-flat-design-background_23-2148450082.jpg?size=626&ext=jpg&ga=GA1.1.1286474015.1708934801&semt=sph"
          alt=""
          class="banner"
        />
        <!-- :style="{transform: bannerImg}" -->
      </div>
      <div
        class="signup-container"
        id="signup-container"
        :style="`transform : ${signupTransform?.transform}; width: ${signupTransform?.width}; padding: ${signupTransform?.padding}`"
      >
        <div class="flex justify-center">
          <div class="w-full">
            <div class="card bg-white mb-5 mt-5 border-0">
              <div class="card-body p-5 text-center">
                <h4 class="text-lg font-semibold mb-2">Verify</h4>
                <p class="text-sm text-gray-600 mb-4">
                  Your code was sent to you via email
                </p>

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
                <div class="input-container mb-5">
                  <input
                    type="password"
                    placeholder="new password"
                    v-model="password"
                    @keyup.enter="generateOtp()"
                  />
                </div>
                <button
                  class="mb-3 text-white rounded px-5 py-2 text-center"
                  :class="{
                    'bg-blue-700 hover:bg-blue-600': (isButtonActive && password),
                    'bg-blue-400 cursor-not-allowed': !(isButtonActive && password),
                  }"
                  @click="verifyPassword()"
                  :disabled="!(isButtonActive && password)"
                >
                  Verify
                </button>

                <p class="text-xs text-gray-500 mb-0">
                  Didn't receive code?
                  <a href="#" class="text-blue-500 hover:text-blue-600"
                    >Request again</a
                  >
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import axios from "axios";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import { useRouter } from "vue-router";
const router = useRouter();

const otpValues = ref(["", "", "", ""]);
const banner = ref(null);
const otpInput = ref("");
const username = ref("");
const password = ref("");
const loginTransform = ref({
  transform: "scale(1)",
  width: "50%",
  padding: "10px",
});
const signupTransform = ref({
  transform: "scale(0)",
  width: "50%",
  padding: "10px",
});
const handleInput = (index) => {
  if (otpValues.value[index].length > 1) {
    otpValues.value[index] = "";
    return;
  }

  if (index < 3 && otpValues.value[index] !== "") {
    otpValues.value[index + 1] = "";
  }
  if (otpInput.value.length > index + 1) {
    otpInput.value[index + 1].focus();
  }
  checkButtonState();
};

const isDisabled = (index) => {
  return otpValues.value[index - 1] === "";
};

const isButtonActive = ref(false);

const checkButtonState = () => {
  isButtonActive.value =
    otpValues.value.every((val) => val !== "") && !isDisabled(6);
};
const validateInput = () => {
  let regex = /[\s!@#$%^&*()_+={}\[\]:;"'<>,.?/\\|~-]/g;
  username.value = username.value.replace(regex, "");
};

const generateOtp = async () => {
  if (username.value) {
    try {
      const res = await axios.post(`${process.env.APP_URL}api/forgetpassword`, {
        username: username.value,
      });
      if (res.data.success) {
        toast(res.data.message, {
          theme: "colored",
          type: "success",
          position: "top-center",
          autoClose: 3000,
          transition: "slide",
          dangerouslyHTMLString: true,
        });
        banner.value = "translate(-100%)";
        if (window.innerWidth <= 768) {
          loginTransform.value = {
            transform: "scale(0)",
            width: "0",
            padding: "0",
          };
          signupTransform.value = {
            transform: "scale(1)",
            width: "100%",
            padding: "10px",
          };
        } else {
          loginTransform.value = {
            transform: "scale(0)",
            width: "50%",
            padding: "10px",
          };
          signupTransform.value = {
            transform: "scale(1)",
            width: "50%",
            padding: "10px",
          };
        }
      } else {
        toast(res.data.message, {
          theme: "colored",
          type: "warning",
          position: "top-center",
          autoClose: 3000,
          transition: "slide",
          dangerouslyHTMLString: true,
        });
        // throw new Error(res.data.message);
      }
    } catch (err) {
      toast(err.response.data.error, {
        theme: "colored",
        type: "error",
        position: "top-center",
        autoClose: 3000,
        transition: "slide",
        dangerouslyHTMLString: true,
      });
      // console.error("something went wrong", err);
    }
  } else {
    toast("Please enter username and email", {
      theme: "colored",
      type: "error",
      position: "top-center",
      autoClose: 3000,
      transition: "slide",
      dangerouslyHTMLString: true,
    });
  }
};

const verifyPassword = async () => {
  let otp = otpValues.value?.map((value) => value).join("");
  console.log(otp);
  try {
    const res = await axios.post(`${process.env.APP_URL}api/verifypassword`, {
      username: username.value,
      otp: otp,
      newPassword: password.value,
    });
    if (res.data.success) {
      toast(res.data.message, {
        theme: "colored",
        type: "success",
        position: "top-center",
        autoClose: 3000,
        transition: "slide",
        dangerouslyHTMLString: true,
      });
      router.push("/");
    } else {
      toast(res.data.message, {
        theme: "colored",
        type: "warning",
        position: "top-center",
        autoClose: 3000,
        transition: "slide",
        dangerouslyHTMLString: true,
      });
      // throw new Error(res.data.message);
    }
  } catch (err) {
    // console.log(err);
    toast(err.response.data.error, {
      theme: "colored",
      type: "error",
      position: "top-center",
      autoClose: 3000,
      transition: "slide",
      dangerouslyHTMLString: true,
    });
    // console.error("something went wrong", err);
  }
};

onMounted(() => {
  if (window.innerWidth <= 768) {
    loginTransform.value = {
      transform: "scale(1)",
      width: "100%",
      padding: "10px",
    };
  }
  otpInput.value[0].addEventListener("paste", function (event) {
    event.preventDefault();

    const pastedValue = (event?.clipboardData || window?.clipboardData).getData(
      "text"
    );
    const otpLength = otpInput.value?.length;

    for (let i = 0; i < otpLength; i++) {
      if (i < pastedValue.length) {
        otpValues.value[i] = pastedValue[i];
        otpInput.value[i].removeAttribute("disabled");
        otpInput.value[i].focus;
      } else {
        otpInput.value[i].value = ""; // Clear any remaining otpInput.value
        otpInput.value[i].focus;
      }
      console.log("1251", checkButtonState());
      checkButtonState();
    }
  });
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