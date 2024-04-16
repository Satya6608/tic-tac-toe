import { defineStore } from "pinia";
import { ref } from "vue"
export const useGameStore = defineStore("gameStore", () => {
    const currentPlayer = ref('X')
  	const history =ref([
  		{squares: Array(9).fill(null),winner:null,player:'X'}
  	])
  	const stepNo = ref(0)
    const winner = ref(null)

    const changePlayer = (player) => {
    currentPlayer.value = player
    }
    const togglePlayer = () => {
    currentPlayer.value = currentPlayer.value == 'X' ? '0' : 'X'
    }
    const reset = ()=> {
    history.value = [
            {squares: Array(9).fill(null),winner:null}
        ]
    stepNo.value = 0
    currentPlayer.value = winner.value ? winner.value : currentPlayer.value
    winner.value = null
    }
    const addHistory = (payload) => {
    history.value = payload
    stepNo.value = history.value.length-1
    }
    const setWinner = (winner) => {
    winner.value = winner;
    }
    const setStepNo = (no) =>{
    stepNo.value = no;
    }

    return{
        currentPlayer, history, stepNo, winner
    }
})