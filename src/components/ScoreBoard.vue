<template>
  <div class="score-board">
    <h6>{{ label }}</h6>
    <p>{{ score }}</p>
    <!-- <Bullet ref="bullet" /> -->
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from "@vue/runtime-core";
import Bullet from "./Bullet.vue";
const props = defineProps<{
  label: string;
  score: number;
}>();

const bullet = ref<typeof Bullet | null>(null);

watch(
  () => props.score,
  (val, prev) => {
    bullet.value?.shot(val - prev);
  }
);
</script>
<style lang="scss" scoped>
.score-board {
  background-color: #bbada0;
  border-radius: 5px;
  width: 72px;
  color: #fff;
  text-align: center;
  display: inline-block;
  padding-bottom: 8px;
  margin-left: 5px;
  position: relative;
}
h6 {
  color: #ede4da;
  font-weight: 700;
  font-size: 12px;
  line-height: 12px;
  padding: 12px 0 8px 0;
}
p {
  font-weight: 700;
  font-size: 24px;
  line-height: 24px;
}
</style>
