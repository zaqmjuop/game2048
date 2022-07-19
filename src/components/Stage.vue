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
import { DIR_KEYS, GAME_STATUS, LINE_MAP, valueof } from "../metaData";
import { ArrayElementType, Block, Line } from "../type";
import {
  ref,
  reactive,
  onBeforeMount,
  onBeforeUnmount,
  watch,
  onMounted,
} from "vue";
import { getId, includes, slideLine } from "../utils";
import Win from "./Win.vue";
import GameOver from "./GameOver.vue";

let promise = Promise.resolve();

const mock = (): Block[] => [
  { id: getId(), value: 2, position: 0 },
  { id: getId(), value: 2, position: 1 },
  { id: getId(), value: 3, position: 2 },
  { id: getId(), value: 4, position: 3 },
  { id: getId(), value: 5, position: 4 },
  { id: getId(), value: 6, position: 5 },
  { id: getId(), value: 7, position: 6 },
  { id: getId(), value: 8, position: 7 },
  { id: getId(), value: 9, position: 8 },
  { id: getId(), value: 10, position: 9 },
  { id: getId(), value: 11, position: 10 },
  { id: getId(), value: 12, position: 11 },
  { id: getId(), value: 13, position: 12 },
  { id: getId(), value: 14, position: 13 },
  { id: getId(), value: 15, position: 14 },
  { id: getId(), value: 16, position: 15 },
];

const defaultBlocks = (): Block[] => [];

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
  const block: Block = {
    id: getId(),
    value: 2,
    position: flag,
  };
  blocks.push(block);
};

const playStep = (
  row: Array<Block | undefined>,
  positions: number[] | readonly number[],
  commonds: Array<{ type: string; data1: number; data2: number }>
) => {
  let score = 0;
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
    });
    emit("score", score);
  }, 200);
};

const runCommand = (key: "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight") => {
  let hasChange = false;
  const lines = LINE_MAP[key];
  const positionMap: Record<number, Block> = {};
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
    playStep(row, lines[i] as readonly number[], res.commonds);
  }
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
  const res = runCommand(key);
  if (res.hasChange) {
    const isWin = blocks.find((block) => block.value >= 2048);
    if (isWin) {
      emit("win");
    } else {
      setTimeout(() => insertRandomBlock(), 200);
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
