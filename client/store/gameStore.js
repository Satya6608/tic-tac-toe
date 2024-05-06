import { defineStore, storeToRefs } from "pinia";
import { ref } from "vue"
import { useAuthStore } from "./auth";
export const useGameStore = defineStore("gameStore", () => {
    const currentPlayer = ref('')
    const oponentPlayer = ref('')
    const oponentPlayerId = ref('')
    const userPlayer = ref('')

    const authStore = useAuthStore()
    const { user } = storeToRefs(authStore)
  	const history =ref([
  		{squares: Array(9).fill(''),winner:null,player:'X'}
  	])
  	const stepNo = ref(0)
    const winner = ref(null)

    const changePlayer = (player) => {
        currentPlayer.value = player
    }
    const togglePlayer = (player) => {
    currentPlayer.value = currentPlayer.value == user?.value?.username ? oponentPlayer.value : user?.value?.username
    }

    const setOponentPlayer = (name, id) => {
        oponentPlayer.value = name;
        oponentPlayerId.value = id;
    }

    const reset = ()=> {
    history.value = [
            {squares: Array(9).fill(''),winner:null}
        ]
    stepNo.value = 0
    currentPlayer.value = winner.value ? winner.value : currentPlayer.value
    winner.value = null
    }
    const addHistory = (payload) => {
    history.value = payload
    stepNo.value = history.value.length-1
    }
    const setWinner = (win) => {
    winner.value = win;
    }
    const setStepNo = (no) =>{
    stepNo.value = no;
    }

    return{
        currentPlayer, history, stepNo, winner, changePlayer, setOponentPlayer, togglePlayer, reset, addHistory, setWinner, setStepNo, oponentPlayer, userPlayer
    }
})