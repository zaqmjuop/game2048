<template>
  <div class="stage">
    <span v-for="item in 16" class="block"></span>
    <Count
      v-for="item in blocks"
      :key="item.id"
      :frameTime="frameTime"
      :item="item"
    />
    <Win v-if="status === GAME_STATUS.win" @try-again="start" />
    <GameOver v-else-if="status === GAME_STATUS.gameover" @try-again="start" />
  </div>
</template>
<script setup lang="ts">
import Count from "./Count.vue";
import { DIR_KEYS, GAME_STATUS, LINE_MAP, valueof } from "../metaData";
import { ArrayElementType, Block, Command, Line } from "../type";
import {
  ref,
  reactive,
  onBeforeMount,
  onBeforeUnmount,
  watch,
  onMounted,
} from "vue";
import { getId, includes, sleep, sleepFrame, slideLine } from "../utils";
import Win from "./Win.vue";
import GameOver from "./GameOver.vue";
import { computed } from "@vue/reactivity";
import { CountBlock } from "../Item/count";

let promise = Promise.resolve();

const mock = (): CountBlock[] => [
  CountBlock.of({ value: 2, position: 0 }),
  CountBlock.of({ value: 2, position: 1 }),
  CountBlock.of({ value: 3, position: 2 }),
  CountBlock.of({ value: 4, position: 3 }),
  CountBlock.of({ value: 5, position: 4 }),
  CountBlock.of({ value: 6, position: 5 }),
  CountBlock.of({ value: 7, position: 6 }),
  CountBlock.of({ value: 8, position: 7 }),
  CountBlock.of({ value: 9, position: 8 }),
  CountBlock.of({ value: 10, position: 9 }),
  CountBlock.of({ value: 11, position: 10 }),
  CountBlock.of({ value: 12, position: 11 }),
  CountBlock.of({ value: 13, position: 12 }),
  CountBlock.of({ value: 14, position: 13 }),
  CountBlock.of({ value: 15, position: 14 }),
  CountBlock.of({ value: 16, position: 15 }),
];

const defaultBlocks = (): CountBlock[] => [];

const props = defineProps<{
  triggerStart: boolean;
}>();

const emit = defineEmits<{
  (e: "score", payload: number): void;
  (e: "start"): void;
  (e: "win"): void;
  (e: "gameover"): void;
}>();

const blocks = reactive<CountBlock[]>(defaultBlocks());

const status = ref<valueof<typeof GAME_STATUS>>(GAME_STATUS.playing);

const stack: Array<ArrayElementType<typeof DIR_KEYS>> = reactive([]);
const DEFAULT_FRAME_TIME = 100;
const frameTime = computed(() =>
  Math.trunc(DEFAULT_FRAME_TIME / (stack.length || 1))
);

const onKeyUp = (e: KeyboardEvent) => {
  if (status.value !== GAME_STATUS.playing) {
    if (e.key === "Enter") {
      start();
    }
    return;
  }
  const key = e.key;
  if (includes(key, DIR_KEYS)) {
    stack.push(key);
  }
  promise = promise.then(() => runStep());
};

const insertRandomBlock = () => {
  const positions: number[] = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
  ];
  blocks.forEach(({ position }) => {
    const index = positions.indexOf(position);
    if (index > -1) {
      positions.splice(index, 1);
    }
  });
  const i = Math.trunc(Math.random() * positions.length);
  const flag = positions[i];

  blocks.push(CountBlock.of({ value: 2, position: flag }));
};

const playStep = async (
  row: Array<CountBlock | undefined>,
  positions: number[] | readonly number[],
  commands: Array<Command>
) => {
  let score = 0;
  const mergeCommands: Array<Command> = [];
  const sliderCommands: Array<Command> = [];
  commands.forEach((command) => {
    if (command.type === "merge") {
      mergeCommands.push(command);
    } else if (command.type === "slider") {
      sliderCommands.push(command);
    }
  });
  await Promise.all(
    sliderCommands.map(({ data1, data2 }) => {
      const block = row[data1];
      block && (block.position = positions[data2]);
    })
  );
  await sleepFrame();
  await Promise.all(
    mergeCommands.map(({ data1, data2 }) => {
      const block1 = row[data1];
      const block2 = row[data2];
      if (block1) {
        const index = blocks.indexOf(block1);
        if (index > -1) {
          blocks.splice(index, 1);
        }
      }
      if (block2) {
        block2.value *= 2;
        score += block2.value;
      }
    })
  );
  emit("score", score);
};

const runCommand = async (
  key: "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight"
) => {
  let hasChange = false;
  const lines = LINE_MAP[key];
  const positionMap: Record<number, CountBlock> = {};
  blocks.forEach((block) => {
    positionMap[block.position] = block;
  });
  await Promise.all(
    lines.map(async (line) => {
      const row: Array<CountBlock | undefined> = line.map(
        (position) => positionMap[position]
      );
      const res = slideLine(row.map((block) => block?.value || 0));
      const lineChange = res.commands.length;
      if (lineChange) {
        hasChange = true;
      }
      return playStep(row, line as number[], res.commands);
    })
  );
  return { hasChange };
};

const isGameOver = () => {
  if (blocks.length < 16) {
    return false;
  }
  const positionMap: Record<number, number> = {};
  blocks.forEach((block) => {
    positionMap[block.position] = block.value;
  });

  const isOverLine = (positions: Line) => {
    return positions.every((position, index) => {
      return (
        index >= positions.length - 1 ||
        positionMap[position] !== positionMap[positions[index + 1]]
      );
    });
  };

  return [LINE_MAP.ArrowRight, LINE_MAP.ArrowDown].every((map) => {
    return map.every((line) => {
      return isOverLine(line);
    });
  });
};

const runStep = async () => {
  if (status.value !== GAME_STATUS.playing) {
    return;
  }
  const key = stack.shift();
  if (!key) {
    return;
  }
  const res = await runCommand(key);
  if (res.hasChange) {
    const isWin = blocks.find((block) => block.value >= 2048);
    if (isWin) {
      emit("win");
    } else {
      insertRandomBlock();
    }
  } else {
    const isLose = isGameOver();
    if (isLose) {
      status.value = GAME_STATUS.gameover;
      emit("gameover");
    }
  }
};

const start = () => {
  stack.splice(0, stack.length);
  blocks.splice(0, blocks.length, ...defaultBlocks());
  insertRandomBlock();
  insertRandomBlock();
  status.value = GAME_STATUS.playing;
  emit("start");
};

watch(
  () => props.triggerStart,
  () => {
    start();
  }
);

onBeforeMount(() => {
  document.addEventListener("keyup", onKeyUp);
});
onMounted(() => {
  start();
});
onBeforeUnmount(() => {
  document.removeEventListener("keyup", onKeyUp);
});
</script>
<style lang="scss" scoped>
.stage {
  position: relative;
  background-color: #bbada0;
  font-size: 8px;
  border-radius: 5px;
  padding-bottom: 1em;
}
</style>
