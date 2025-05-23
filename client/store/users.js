import { defineStore } from "pinia";
import axios from "axios";
export const useUserStore = defineStore("user", () => {
    const items = ref([])
    const fetchItems = async (id) => {
        try {
            const response = await axios.get(`${process.env.APP_URL}api/game/${id}`);
            items.value = response.data;
          } catch (error) {
            console.error('Error fetching data:', error);
          }
    }
    return { items, fetchItems };
});