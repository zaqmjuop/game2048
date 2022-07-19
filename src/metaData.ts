import { Line } from "./type";

export const DIR_KEYS = [
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
] as const;

export const GAME_STATUS = {
  playing: 0,
  win: 1,
  gameover: 2,
} as const;

export const BEST_SCORE_KEY = "bestScore";
export type valueof<T extends object> = T[keyof T];
export const LINE_MAP: Record<string, [Line, Line, Line, Line]> = {
  ArrowRight: [
    [0, 1, 2, 3],
    [4, 5, 6, 7],
    [8, 9, 10, 11],
    [12, 13, 14, 15],
  ],
  ArrowDown: [
    [0, 4, 8, 12],
    [1, 5, 9, 13],
    [2, 6, 10, 14],
    [3, 7, 11, 15],
  ],
  ArrowUp: [
    [12, 8, 4, 0],
    [13, 9, 5, 1],
    [14, 10, 6, 2],
    [15, 11, 7, 3],
  ],
  ArrowLeft: [
    [3, 2, 1, 0],
    [7, 6, 5, 4],
    [11, 10, 9, 8],
    [15, 14, 13, 12],
  ],
};
