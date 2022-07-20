import { ArrayElementType } from "./type";

export const includes = <T extends any[] | readonly any[]>(
  val: any,
  ary: T
): val is ArrayElementType<T> => {
  return ary.includes(val);
};

export const slideLine = (line: number[]) => {
  const commands: Array<{ type: string; data1: number; data2: number }> = [];
  const res: number[] = new Array(line.length).fill(0);
  let resI = res.length - 1;
  for (let i = line.length - 1; i >= 0; i--) {
    if (!line[i]) {
      continue;
    } else {
      if (!res[resI]) {
        res[resI] = line[i]; // 滑动
        i !== resI && commands.push({ type: "slider", data1: i, data2: resI });
      } else if (res[resI] === line[i]) {
        res[resI] *= 2; // 滑动 +合并
        const prevCommand = commands[commands.length - 1];
        let mergeData2 = resI;
        if (
          prevCommand &&
          prevCommand.type === "slider" &&
          prevCommand.data2 === resI
        ) {
          // 站位值是后滑动过来的
          mergeData2 = prevCommand.data1;
        }
        commands.push({ type: "slider", data1: i, data2: resI });
        commands.push({ type: "merge", data1: i, data2: mergeData2 });
        resI--;
      } else {
        resI--;
        res[resI] = line[i]; // 滑动
        i !== resI && commands.push({ type: "slider", data1: i, data2: resI });
      }
    }
  }
  return { line, res, commands };
};
// slideLine([0, 2, 4, 8]);
// slideLine([2, 0, 0, 0]);
// slideLine([0, 0, 2, 0]);
// slideLine([2, 2, 0, 0]);
// slideLine([0, 2, 2, 0]);
// slideLine([0, 2, 2, 2]);
// slideLine([2, 2, 0, 2]);
// slideLine([2, 2, 2, 2]);
let id = 0;
export const getId = () => `${id >= Number.MAX_SAFE_INTEGER ? (id = 0) : id++}`;

export const sleep = (mesc: number) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(mesc);
    }, mesc);
  });
export const sleepFrame = () =>
  new Promise((resolve) => {
    window.requestAnimationFrame(() => resolve(0));
  });
