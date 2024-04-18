<template>
  <Authentication/>
</template>

<script setup>
import Authentication from "~/components/auth/Authentication.vue"
import { getToken } from "~/services/jwt.service";
import { useRouter } from 'vue-router';
const router = useRouter();

onMounted(async () => {
  // Check if the user is authenticated
   if (process.client){
    const user = await getToken()
    if(user) {
      return router.push("/profile")
    }
  }
});
</script>

<style>

</style>