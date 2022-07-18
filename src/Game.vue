<template>
  <div class="game2048">
    <div class="between">
      <h1>2048</h1>
      <span>
        <ScoreBoard label="SCORE" :score="score"></ScoreBoard>
        <ScoreBoard label="BEST" :score="bestScore"></ScoreBoard>
      </span>
    </div>
    <div class="between">
      <p>
      <p><b>Play 2048 Game Online</b></p>
      <p>Join the numbers and get to the <b>2048 tile!</b></p>
      </p>
      <div>
        <Btn @click="startGame">New Game</Btn>
      </div>
    </div>
    <Stage :triggerStart="triggerStart" @score="score += $event" @start="onStart" />
  </div>

</template>
<script setup lang="ts">
import Stage from "./components/Stage.vue";
import ScoreBoard from "./components/ScoreBoard.vue";
import Btn from "./components/Btn.vue";
import { onBeforeMount, onMounted, ref } from "vue";
import { BEST_SCORE_KEY } from "./metaData";
const triggerStart = ref(false)
const score = ref(0)
const bestScore = ref(0)
const updateBestScore = () => {
  const newBestScore = Math.max(Number(localStorage.getItem(BEST_SCORE_KEY)) || 0, score.value)
  bestScore.value = newBestScore
  localStorage.setItem(BEST_SCORE_KEY, `${bestScore.value}`)
}
const startGame = () => {
  triggerStart.value = !triggerStart.value
}
const onStart = () => {
  updateBestScore()
  score.value = 0
}
onMounted(() => {
  // startGame()
}) 
</script>
<style scoped lang="scss">
.game2048 {
  width: 400px;
}
</style>
