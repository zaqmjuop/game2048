<template>
  <div class="stage">
    <span v-for="block in 16" class="block"></span>
  </div>
</template>
<script setup lang="ts"></script>
<style lang="scss" scoped>
.stage {
  background-color: #BBADA0;
  font-size: 8px;
  border-radius: 5px;
  padding-bottom: 1em;
}

.block {
  background-color: #CDC1B4;
  width: 11.25em;
  height: 11.25em;
  display: inline-block;
  margin-left: 1em;
  margin-top: 1em;
  vertical-align: top;
}
</style>
