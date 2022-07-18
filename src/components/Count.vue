<template>
  <span class="block slider" :style="{transform: `translate(${position.col}00%, ${position.row}00%)`}">
    <p class="count">{{ count }}</p>
  </span>
</template>
<script setup lang="ts">import { computed } from 'vue';

const props = defineProps<{
  count: number;
  index: number
}>();

const position = computed(() => {
  const col = props.index % 4
  const row = (props.index - col) / 4
  return { col, row }
})


</script>
<style lang="scss" scoped>
.slider {
  position: absolute;
  top: 0;
  left: 0;
  background-color: #EDE4DA;

}

.count {
  text-align: center;
  font-size: 5em;
  font-weight: 900;
  margin-top: 50%;
  transform: translateY(-50%);
}
</style>