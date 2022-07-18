<template>
  <div class="game2048">
    <div class="between">
      <h1>2048</h1>
      <span>
        <ScoreBoard label="SCORE" :score="0"></ScoreBoard>
        <ScoreBoard label="BEST" :score="0"></ScoreBoard>
      </span>
    </div>
    <div class="between">
      <p>
      <p><b>Play 2048 Game Online</b></p>
      <p>Join the numbers and get to the <b>2048 tile!</b></p>
      </p>
      <div>
        <Btn text="New Game" @click="startGame" />
      </div>
    </div>
    <Stage :triggerStart="triggerStart"/>
  </div>

</template>
<script setup lang="ts">
import Stage from "./components/Stage.vue";
import ScoreBoard from "./components/ScoreBoard.vue";
import Btn from "./components/Btn.vue";
import { ref } from "vue";
const triggerStart = ref(false)
const startGame = () => {
  console.log('startGame')
  triggerStart.value = !triggerStart.value
}
</script>
<style scoped lang="scss">
.game2048 {
  width: 400px;
}
</style>
