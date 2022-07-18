<template>
  <div class="mask">
    <div class="gameover vertical-center">
      <div>
        <h2 class="text-center" style="color: #776e65;">Game Over!</h2>
      </div>
      <div class="between">
        <Btn @click="emit('try-again')">Try Again</Btn>
      </div>
    </div>
  </div>

</template>
<script setup lang="ts">
import Btn from './Btn.vue'
const emit = defineEmits<{
  (e: 'try-again', payload?: any): void
}>()
</script>
<style lang="scss" scoped>
h2 {
  margin-bottom: 1em;
}

.mask {
  background-color: rgba($color: #EEE3DB, $alpha: 0.8);
}

.gameover {
  padding: 0 10%;
}
</style>