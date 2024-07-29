/**
 * 任意层数的索引类型，给每一层都加上 Record<string, any>
 * 目的：给一个任意层深度的键值对，添加上可索引签名，使其可以扩展。
 */
type DeepScalable<Obj extends Record<string, any>> = {
  [key in keyof Obj]: Obj[key] extends Record<string, any>
    ? DeepScalable<Obj[key]>
    : Obj[key];
} & Record<string, any>;

type Data = {
  aaa: number;
  bbb: {
    ccc: number;
    ddd: string;
  };
  eee: {
    fff: string;
    ddd: number;
  };
};

type res = DeepScalable<Data>;

const data: res = {
  aaa: 1,
  bbb: {
    ccc: 1,
    ddd: "",
    fff: "zxc",
  },
  eee: {
    fff: "bbb",
    ddd: 2,
  },
  xxx: {},
};

/**
 * 当一个索引为 'desc' | 'asc' 的时候，其他索引都是 false
 */
type HasValInUnion<Vals, Val> = Vals extends Val ? true : false;
type BesidesOneValAllFalse<
  Obj extends Record<string, any>,
  Val = "desc" | "asc"
> = HasValInUnion<Obj[keyof Obj], Val> extends true
  ? {
      [key in keyof Obj]: Utils.IsEqual<Obj[key], Val> extends true
        ? Obj[key]
        : false;
    }
  : Obj;
