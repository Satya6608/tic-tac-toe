<template>
  <div class="container-fluid flex justify-center my-5">
    <div class="w-1/2">
      <h1 class="title">Edit</h1>
      <p class="desc">Edit your details</p>
      <div class="input-container">
        <input type="text" placeholder="username@123" v-model="username" />
      </div>
      <div class="input-container">
        <input
          type="email"
          placeholder="youremail@example.com"
          v-model="email"
        />
      </div>
      <div class="account-controls mt-5">
        <button @click="edit()">
          Next <i class="fas fa-solid fa-angle-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "~/store/auth.js"
import { storeToRefs } from "pinia";
import { useRouter } from 'vue-router'
import axios from "axios";
import auth from "~/middleware/auth.js";
definePageMeta({
  middleware: ["auth"],
});

const router = useRouter();

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
const username = ref(user?.value?.username);
const email = ref(user?.value?.email);

const reset = () => {
  username.value = "";
  email.value = "";
}

const edit = async () => {
  if (username.value && email.value) {
      try {
        const res = await axios.put(`http://localhost:7000/api/edit/${user?.value._id}`, {
          username: username.value,
          email: email.value,
        });
        if (res) {
          const tok = localStorage.getItem("token") 
          authStore.login(tok, res.data.user)
          router.push("/profile");
          reset()
        }
      } catch (err) {
        console.error("something went wrong", err);
      }
  } else return;
}
</script>

<style>
</style>