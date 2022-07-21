<template>
  <p class="bullet shot" @animationend="AnimationEnd">{{ 1 }}</p>
</template>
<script setup lang="ts">
const AnimationEnd = () => {
  console.log(1);
};
const shot = (plus: number) => {};
defineExpose({
  shot,
});
</script>
<style lang="scss" scoped>
.bullet {
  color: #776e65;
  position: absolute;
  left: 0;
  right: 0;
}

@keyframes shot {
  0% {
    visibility: visible;
    opacity: 1;
    top: 50%;
    left: 0;
    right: 0;
  }

  99% {
    opacity: 0.5;
    top: -100%;
  }

  100% {
    visibility: hidden;
  }
}

.shot {
  animation-name: shot;
  animation-duration: 1s;
  animation-delay: 0s;
  animation-fill-mode: forwards;
}
</style>
