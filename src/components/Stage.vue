<template>
  <div class="stage">
    <span v-for="block in 16" class="block"></span>
    <template v-for="(count, index) in counts">
      <Count v-if="!!count" :count="count" :index="index" />
    </template>
  </div>
</template>
<script setup lang="ts">
import Count from './Count.vue'
import { DIR_KEYS } from '../metaData'
import { ArrayElementType } from '../type'
import { ref, reactive, onBeforeMount, onBeforeUnmount, watch } from 'vue';
import { includes } from '../utils';

const props = defineProps<{
  triggerStart: boolean;
}>();

const counts = reactive<number[]>([128, 64, 2, 16, 8, 32, 16, 8, 4, 16, 8, 4, 16, 8, 4, 2])
// new Array(16).fill(0)

const stack: Array<ArrayElementType<typeof DIR_KEYS>> = reactive([])



const onKeyUp = (e: KeyboardEvent) => {
  const key = e.key
  if (includes(key, DIR_KEYS)) {
    stack.push(key);
  }
  step()
}

const slideLine = (line: number[]) => {
  const merge = () => {
    for (let i = line.length - 1; i >= 1; i--) {
      if (!line[i]) {
        continue
      } else if (!line[i - 1]) {
        line[i - 1] = line[i]
        line[i] = 0
      } else if (line[i - 1] === line[i]) {
        line[i] *= 2
        line[i - 1] = 0
      }
    }
  }
  const slide = () => {
    let order = line.length - 1
    for (let i = 3; i >= 0; i--) {
      if (line[i]) {
        const tmp = line[i]
        line[i] = 0
        line[order] = tmp
        order--
      }
    }
  }
  merge()
  slide()
  return line
}

const insertRandomBlock = () => {
  const countFlags: number[] = []
  for (let i = 0; i < counts.length; i++) {
    if (!counts[i]) {
      countFlags.push(i)
    }
  }
  const i = Math.trunc(Math.random() * countFlags.length)
  const flag = countFlags[i]
  counts[flag] = 2
}

const step = () => {
  const key = stack.shift()
  let hasChange = false
  switch (key) {
    case 'ArrowRight':
      for (let row = 0; row < 4; row++) {
        const countFlags: number[] = []
        for (let col = 0; col < 4; col++) {
          countFlags.push(row * 4 + col)
        }
        const res = slideLine(countFlags.map(i => counts[i]))
        countFlags.forEach((countflag, i) => {
          if (!hasChange && counts[countflag] !== res[i]) {
            hasChange = true
          }
          counts[countflag] = res[i]
        })
      }
      break;
    case 'ArrowDown':
      for (let col = 0; col < 4; col++) {
        const countFlags: number[] = []
        for (let i = col; i < counts.length; i += 4) {
          countFlags.push(i)
        }
        const res = slideLine(countFlags.map(i => counts[i]))
        countFlags.forEach((countflag, i) => {
          if (!hasChange && counts[countflag] !== res[i]) {
            hasChange = true
          }
          counts[countflag] = res[i]
        })
      }
      break;
    case 'ArrowUp':
      for (let col = 0; col < 4; col++) {
        const countFlags: number[] = []
        for (let i = col; i < counts.length; i += 4) {
          countFlags.push(i)
        }
        countFlags.reverse()
        const res = slideLine(countFlags.map(i => counts[i]))
        countFlags.forEach((countflag, i) => {
          if (!hasChange && counts[countflag] !== res[i]) {
            hasChange = true
          }
          counts[countflag] = res[i]
        })
      }
      break;
    case 'ArrowLeft':
      for (let row = 0; row < 4; row++) {
        const countFlags: number[] = []
        for (let col = 0; col < 4; col++) {
          countFlags.push(row * 4 + col)
        }
        countFlags.reverse()
        const res = slideLine(countFlags.map(i => counts[i]))
        countFlags.forEach((countflag, i) => {
          if (!hasChange && counts[countflag] !== res[i]) {
            hasChange = true
          }
          counts[countflag] = res[i]
        })
      }
      break;
    default:
      break;
  }
  if (hasChange) {
    insertRandomBlock()
  } else {
    const isLose = !counts.includes(0)
    if (isLose) {
      console.log('isLose')
    }
  }
}

const start = () => {
  stack.splice(0, stack.length)
  counts.splice(0, counts.length, ...new Array(16).fill(0))
  insertRandomBlock()
  insertRandomBlock()
}

watch(() => props.triggerStart, () => { start() })

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
