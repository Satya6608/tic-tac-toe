<template>
  
</template>

<script setup>
import { onMounted } from "vue"

const fetchData = async() =>{
    const response = await fetch('https://jsonplaceholder.typicode.com/posts')
    const data = await response.json()
    console.log(data)
    return data
}
onMounted(() =>{
  fetchData();
})
</script>

<style>

</style>