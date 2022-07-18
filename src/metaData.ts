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

export const BEST_SCORE_KEY = 'bestScore'
export type valueof<T extends object> = T[keyof T]