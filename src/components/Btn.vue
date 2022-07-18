<template>
  <button class="primary" @click="emit('click')">
    <slot></slot>
  </button>
</template>
<script setup lang="ts">
const emit = defineEmits<{
  (e: 'click', payload?: any): void
}>()
</script>
<style scoped lang="scss">
button {
  border: none;
  outline: none;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  display: inline-block;
  border-radius: 5px;
  padding: 4px;
}

.primary {
  background-color: #8E7A65;
}
</style>
