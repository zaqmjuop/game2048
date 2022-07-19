<template>
  <div class="stage">
    <span v-for="block in 16" class="block"></span>

    <template v-for="block in blocks">
      <Count
        v-if="block.value"
        :key="block.id"
        :count="block.value"
        :position="block.position"
      />
    </template>
    <Win v-if="status === GAME_STATUS.win" @try-again="start" />
    <GameOver v-else-if="status === GAME_STATUS.gameover" @try-again="start" />
  </div>
</template>
<script setup lang="ts">
import Count from "./Count.vue";
import { DIR_KEYS, GAME_STATUS, valueof } from "../metaData";
import { ArrayElementType, Block } from "../type";
import {
  ref,
  reactive,
  onBeforeMount,
  onBeforeUnmount,
  watch,
  onMounted,
} from "vue";
import { includes, slideLine } from "../utils";
import Win from "./Win.vue";
import GameOver from "./GameOver.vue";



const defaultBlocks = (): Block[] => [
  { id: "0", value: 2, position: 0 },
  { id: "1", value: 2, position: 1 },
  { id: "2", value: 2, position: 2 },
  { id: "3", value: 2, position: 3 },
  { id: "4", value: 2, position: 4 },
  { id: "5", value: 2, position: 5 },
  { id: "6", value: 2, position: 13 },
];

const props = defineProps<{
  triggerStart: boolean;
}>();

const emit = defineEmits<{
  (e: "score", payload: number): void;
  (e: "start"): void;
  (e: "win"): void;
  (e: "gameover"): void;
}>();

const blocks: Block[] = reactive(defaultBlocks());

const status = ref<valueof<typeof GAME_STATUS>>(GAME_STATUS.playing);

const stack: Array<ArrayElementType<typeof DIR_KEYS>> = reactive([]);

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
  step();
};
let score = 0;

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
  const block: Block = {
    id: blocks.length.toString(),
    value: 2,
    position: flag,
  };
  blocks.push(block);
};

const runCommond = (
  row: Array<Block | undefined>,
  positions: number[],
  commonds: Array<{ type: string; data1: number; data2: number }>
) => {
  const mergeCommonds: Array<{ type: string; data1: number; data2: number }> =
    [];
  const silderCommonds: Array<{ type: string; data1: number; data2: number }> =
    [];
  commonds.forEach((commond) => {
    if (commond.type === "merge") {
      mergeCommonds.push(commond);
    } else if (commond.type === "silder") {
      silderCommonds.push(commond);
    }
  });
  silderCommonds.forEach(({ data1, data2 }) => {
    if (!data1) {
      console.log("positions", data1, data2, positions, row);
    }

    const block = row[data1];
    block && (block.position = positions[data2]);
  });
  setTimeout(() => {
    mergeCommonds.forEach(({ data1, data2 }) => {
      const block1 = row[data1];
      if (block1) {
        const index = blocks.indexOf(block1);
        if (index > -1) {
          blocks.splice(index, 1);
        }
      }
      (row[data2] as Block).value *= 2;
    });
  }, 200);
};

const step = () => {
  if (status.value !== GAME_STATUS.playing) {
    return;
  }
  const key = stack.shift();
  let hasChange = false;
  score = 0;
  switch (key) {
    case "ArrowRight":
      var lines = [
        [0, 1, 2, 3],
        [4, 5, 6, 7],
        [8, 9, 10, 11],
        [12, 13, 14, 15],
      ];
      var positionMap: Record<number, Block> = {};
      blocks.forEach((block) => {
        positionMap[block.position] = block;
      });
      for (let i = 0; i < lines.length; i++) {
        const row: Array<Block | undefined> = lines[i].map(
          (position) => positionMap[position]
        );
        const res = slideLine(row.map((block) => block?.value || 0));
        const lineChange = res.commonds.length;
        if (lineChange) {
          hasChange = true;
        }
        runCommond(row, lines[i], res.commonds);
      }
      break;
    case "ArrowDown":
      var lines = [
        [0, 4, 8, 12],
        [1, 5, 9, 13],
        [2, 6, 10, 14],
        [3, 7, 11, 15],
      ];
      var positionMap: Record<number, Block> = {};
      blocks.forEach((block) => {
        positionMap[block.position] = block;
      });
      for (let i = 0; i < lines.length; i++) {
        const row: Array<Block | undefined> = lines[i].map(
          (position) => positionMap[position]
        );
        const res = slideLine(row.map((block) => block?.value || 0));
        const lineChange = res.commonds.length;
        if (lineChange) {
          hasChange = true;
        }
        runCommond(row, lines[i], res.commonds);
      }
      break;
    case "ArrowUp":
      var lines = [
        [12, 8, 4, 0],
        [13, 9, 5, 1],
        [14, 10, 6, 2],
        [15, 11, 7, 3],
      ];
      var positionMap: Record<number, Block> = {};
      blocks.forEach((block) => {
        positionMap[block.position] = block;
      });
      for (let i = 0; i < lines.length; i++) {
        const row: Array<Block | undefined> = lines[i].map(
          (position) => positionMap[position]
        );
        const res = slideLine(row.map((block) => block?.value || 0));
        const lineChange = res.commonds.length;
        if (lineChange) {
          hasChange = true;
        }
        runCommond(row, lines[i], res.commonds);
      }
      break;
    case "ArrowLeft":
      var lines = [
        [3, 2, 1, 0],
        [7, 6, 5, 4],
        [11, 10, 9, 8],
        [15, 14, 13, 12],
      ];
      var positionMap: Record<number, Block> = {};
      blocks.forEach((block) => {
        positionMap[block.position] = block;
      });
      for (let i = 0; i < lines.length; i++) {
        const row: Array<Block | undefined> = lines[i].map(
          (position) => positionMap[position]
        );
        const res = slideLine(row.map((block) => block?.value || 0));
        const lineChange = res.commonds.length;
        if (lineChange) {
          hasChange = true;
        }
        runCommond(row, lines[i], res.commonds);
      }
      break;
    default:
      break;
  }
  if (hasChange) {
    if (score) {
      emit("score", score);
      score = 0;
    }
    const isWin = blocks.find((block) => block.value >= 2048);
    if (isWin) {
      emit("win");
    } else {
      setTimeout(() => insertRandomBlock(), 200);
    }
  } else {
    const isLose = blocks.length >= 16;
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
onMounted(() => {});
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
