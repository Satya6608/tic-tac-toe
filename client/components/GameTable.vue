<template>
  <div class="relative overflow-x-auto">
    <table
      class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
    >
      <thead
        class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
      >
        <tr>
          <th scope="col" class="px-6 py-3">Oponent</th>
          <th scope="col" class="px-6 py-3">user</th>
          <th scope="col" class="px-6 py-3">Winner</th>
          <th scope="col" class="px-6 py-3">History</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, i) in items" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700" :key="i">
          <th
            scope="row"
            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
          >
            {{ item.opponent }}
          </th>
          <td class="px-6 py-4">{{ item.user.username }}</td>
          <td class="px-6 py-4">{{ item.winner }}</td>
          <td class="px-6 py-4">{{ item.history }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { useUserStore } from "~/store/users.js"
const userStore = useUserStore()
const { items } = storeToRefs(userStore)

</script>

<style>
</style>