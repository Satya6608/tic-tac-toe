<template>
  <div>
    <Header />
    <slot/>
    <Footer />
  </div>
</template>
<script setup>
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";

</script>