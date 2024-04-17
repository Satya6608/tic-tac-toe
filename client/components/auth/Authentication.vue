<template>
  <div class="flex justify-center my-5">
    <div class="form-container">
      <div
        class="login-container"
        id="login-container"
        :style="{ transform: loginTransform }"
      >
        <h1 class="title">Log In</h1>
        <p class="desc">
          Login to your account to Play the game
        </p>
        <div class="input-container">
          <input
            type="text"
            placeholder="username"
            autofocus="on"
            v-model="username"
          />
        </div>
        <div class="input-container">
          <input
            type="password"
            placeholder="******"
            v-model="pass"
          />
        </div>
        <div class="account-controls">
          <a href="">Forgot Password?</a>
          <button @click="Login()">Next <i class="fas fa-solid fa-angle-right"></i></button>
        </div>
        <span class="signup-text"
          >Don't have an account yet?
          <button @click="signupToggle" id="signup-form-toggler">
            Sign up
          </button></span
        >
      </div>
      <div class="placeholder-banner" id="banner" :style="{ transform: banner }">
        <img
          src="https://img.freepik.com/free-vector/abstract-flat-design-background_23-2148450082.jpg?size=626&ext=jpg&ga=GA1.1.1286474015.1708934801&semt=sph"
          alt=""
          class="banner"
          :style="{transform: bannerImg}"
        />
      </div>

      <div
        class="signup-container"
        id="signup-container"
        :style="{ transform: signupTransform }"
      >
        <h1 class="title">Signup</h1>
        <p class="desc">
          Create your account to Play the Game
        </p>
        <div class="input-container">
          <input type="text" placeholder="username@123" v-model="username"/>
        </div>
        <div class="input-container">
          <input type="email" placeholder="youremail@example.com" v-model="email"/>
        </div>
        <div class="input-container">
          <input type="password" placeholder="******" v-model="pass"/>
        </div>
        <div class="account-controls">
          <button @click="signUp()">Next <i class="fas fa-solid fa-angle-right"></i></button>
        </div>
        <span class="signup-text"
          >Already have an account?
          <button id="login-form-toggler" @click="loginToggle">Login here</button></span
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from 'vue-router';
import { useAuthStore } from "~/store/auth.js"
import { storeToRefs } from "pinia"
const authStore = useAuthStore()
const banner = ref(null);
const bannerImg = ref(null);
const loginContainer = ref(null);
const signupContainer = ref(null);

const router = useRouter();
const loginTransform = ref("scale(1)");
const signupTransform = ref("scale(0)");
const email = ref("");
const pass = ref("");
const username = ref("");

const signupToggle = () => {
    banner.value = "translateX(-100%)";
    bannerImg.value = "scaleX(-1)";
console.log("signupToggle:", banner.value)
    loginTransform.value = "scale(0)";
    signupTransform.value = "scale(1)"
    reset()
}
const loginToggle = () => {
    banner.value = "translateX(0%)"
    bannerImg.value = "scaleX(-1)";
    signupTransform.value = "scale(0)"
    loginTransform.value = "scale(1)"
    reset()
}

const Login = async () => {
    console.log("Login:", username.value, pass.value)
    try {
    const res = await axios.post("http://localhost:7000/api/login", {
      username: username.value,
      password: pass.value,
    });
    if (res.data.success) {
      const token = res.data.token;
      const user = res.data.user;
      authStore.login(token, user);
      router.push("/tictactoe");
      reset()
    } else {
      throw new Error(res.data.message);
    }
  } catch (err) {
    console.error("something went wrong", err);
  }
}

const reset = () => {
  username.value = "";
  email.value = "";
  pass.value = "";
}
const signUp = async () => {
  console.log("signUp:", username.value, email.value, pass.value)
  if (username.value && pass.value && email.value) {
      try {
        const res = await axios.post("http://localhost:7000/api/signup", {
          username: username.value,
          email: email.value,
          password: pass.value,
        });
        if (res) {
          // setCookie("jwt", res.data.token, {
          //   httpOnly: true,
          //   maxAge: 60 * 60 * 24 * 7, // Example: 7 days, adjust as needed
          //   path: "/", // You may adjust this based on your requirements
          //   sameSite: "strict", // You may adjust this based on your requirements
          // });
          router.push("/tictactoe");
          reset()
        }
      } catch (err) {
        console.error("something went wrong", err);
      }
  } else return;
}
</script>

<style>
.form-container {
  border: 1px solid #e8e8e8;
  height: 500px;
  width: 600px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  background-color: white;
  overflow: hidden;
  position: relative;
}

.login-container,
.signup-container {
  width: 50%;
  padding: 40px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 15px;
  transition: all 500ms ease;
}
.signup-container {
  transform: scale(0);
}

.title {
  font-size: 20px;
  font-weight: 500;
}

.desc {
  font-size: 12px;
}

.input-container {
  margin-top: 10px;
  width: 100%;
  height: 40px;
  border-radius: 5px;
  border: 2px solid #d6e0eb;
  display: flex;
  align-items: center;
}

input {
  height: 100%;
  border: none;
  margin-left: 5px;
  outline: none;
  font-family: "Roboto", sans-serif;
}

.account-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.account-controls > a {
  text-decoration: none;
  color: #5293aa;
  font-size: 12px;
}

.account-controls > button {
  width: 65px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  border: none;
  background: #046586;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  transition: transform 500ms ease;
  box-shadow: 0 3px 10px -5px #73aabb;
}
.account-controls > button {
  transform: scale(1.1);
}

.line {
  width: 100%;
  height: 2px;
  background-color: #bfc0c9;
  border-radius: 10px;
}

.other-login-text {
  text-align: center;
  font-size: 12px;
  color: #64656a;
}

.placeholder-banner {
  width: 50%;
  height: 100%;
  position: absolute;
  right: 0;
  transition: all 500ms ease;
  z-index: 4;
}

.social-logins {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.social-login {
  height: 40px;
  aspect-ratio: 1/1;
  border: 2px solid #bfc0c9;
  background-color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  cursor: pointer;
  transition: transform 500ms ease;
}
.social-login:hover {
  transform: scale(1.1);
}
.signup-text {
  margin-top: 5px;
  font-size: 12px;
}
#signup-form-toggler,
#login-form-toggler {
  cursor: pointer;
  text-decoration: none;
  color: #046586;
}
#signup-form-toggler,
#login-form-toggler {
  border-bottom: 1px solid;
}

.banner {
  width: 100%;
  height: inherit;
  object-fit: cover;
  transition: transform 500ms ease;
}
</style>