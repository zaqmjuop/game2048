<template>
  <span
    class="block slider"
    :style="{
      transform: `translate(${offset.left}00%, ${offset.top}00%) scale(${scale})`,
      'transition-duration': `${frameTime}ms`,
    }"
  >
    <p class="count">{{ item.value }}</p>
  </span>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { CountBlock } from "../Item/count";

const props = defineProps<{
  item: CountBlock;
  frameTime: number;
}>();

const offset = computed(() => {
  const left = props.item.position % 4;
  const top = (props.item.position - left) / 4;
  return { left, top };
});
const scale = ref(0);

onMounted(() => {
  window.requestAnimationFrame(() => (scale.value = props.item.value ? 1 : 0));
});
</script>
<style lang="scss" scoped>
.slider {
  position: absolute;
  top: 0;
  left: 0;
  background-color: #ede4da;
  transition-property: transform;
  transform-origin: center;
}

.count {
  text-align: center;
  font-size: 5em;
  font-weight: 900;
  margin-top: 50%;
  transform: translateY(-50%);
}
</style>
