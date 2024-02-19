// 数组类型
// 数组类型提取第一个元素
type First<T extends any[]> = T extends [infer F, ...unknown[]] ? F : never;
let f: First<[1]>; //1

// 提取数组最后一个元素
type Last<T extends any[]> = T extends [...unknown[], infer L] ? L : never;
let l: Last<[1, 2]>; //2

// [].pop 去掉了最后一个元素的数组
type PopArr<T extends any[]> = T extends [...infer Rest, unknown]
  ? Rest
  : never;
let p: PopArr<[1, 2, 3]>; //[1,2]

// [].shift 去掉了第一个元素的数组
type ShiftArr<T extends any[]> = T extends [unknown, ...infer Rest]
  ? Rest
  : never;
let s: ShiftArr<[1, 2, 3]>; //[2,3]

// 字符串类型
