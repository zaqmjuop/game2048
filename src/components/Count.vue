<template>
  <span
    v-if="count"
    class="block slider"
    :style="{ transform: `translate(${offset.left}00%, ${offset.top}00%)` }"
  >
    <p class="count">{{ count }}</p>
  </span>
</template>
<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  count: number;
  position: number;
}>();

const offset = computed(() => {
  const left = props.position % 4;
  const top = (props.position - left) / 4;
  return { left, top };
});
</script>
<style lang="scss" scoped>
.slider {
  position: absolute;
  top: 0;
  left: 0;
  background-color: #ede4da;
  transition: all 0.2s;
}

.count {
  text-align: center;
  font-size: 5em;
  font-weight: 900;
  margin-top: 50%;
  transform: translateY(-50%);
}
</style>
