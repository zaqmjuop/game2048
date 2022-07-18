<template>
  <div class="mask">
    <div class="win vertical-center">
      <div>
        <h2 class="text-center">You win!</h2>
      </div>
      <div class="between">
        <Btn>Keep playing</Btn>
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
  background-color: rgba($color: #EED384, $alpha: 0.8);
}

.win {
  padding: 0 10%;
}
</style>