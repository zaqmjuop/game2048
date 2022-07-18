<template>
  <div class="stage">
    <span v-for="block in 16" class="block  "></span>
    <template v-for="(count, index) in counts">
      <Count v-if="!!count" :count="count" :index="index" />
    </template>
  </div>
</template>
<script setup lang="ts">
import Count from './Count.vue'
import { ref, reactive, onBeforeMount, onBeforeUnmount } from 'vue';
const counts = reactive<Uint8Array>(new Uint8Array(16).fill(0))
counts[4] = 2
counts[13] = 2
const onKeyUp = (e: KeyboardEvent) => {
  console.log(e)
}
onBeforeMount(() => {
  document.addEventListener('keyup', onKeyUp)
})
onBeforeUnmount(() => {
  document.removeEventListener('keyup', onKeyUp)
})
</script>
<style lang="scss" scoped>
.stage {
  position: relative;
  background-color: #BBADA0;
  font-size: 8px;
  border-radius: 5px;
  padding-bottom: 1em;
}
</style>
