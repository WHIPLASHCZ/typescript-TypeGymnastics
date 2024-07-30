/**
 * 题目:实现一个type类型，用于约束特殊时间格式的字符串
   例子:
   FormatDate<"DD-MM-YY">
   允许的字符串为:
   const date:FormatDate<"DD-MM-YY">="12-12-2024"|"12-02-2024".
   不允许的字符串为:
   const date: FormatDate<"DD-MM-YY">="112-12-2024"|"12-112-2024"|"12-12-12024"
   时间格式支持多种分隔符:"-"|"."|"/"
 */
type YY = "YY";
type MM = "MM";
type DD = "DD";
type YMD = YY | MM | DD;
type Separator = "-" | "." | "/";

type isRightfulFormat<Format extends string> =
  Format extends `${infer F}${Separator}${infer S}${Separator}${infer T}`
    ? Utils.IsEqual<F | S | T, YMD> extends true
      ? true
      : false
    : false;

type GetSeparator<Format extends string> =
  Format extends `${YMD}${infer Sep}${YMD}${infer Sep}${YMD}` ? Sep : never;

type GetDateFormat<
  Format extends string,
  Index extends 0 | 1 | 2
> = Format extends `${infer F extends YMD}${Separator}${infer S extends YMD}${Separator}${infer T extends YMD}`
  ? [F, S, T][Index]
  : never;

type PadStart<
  S extends string | number,
  P extends string | number
> = `${P}${S}`;

type CreateNumStr<
  Start extends number,
  End extends number,
  PS extends boolean
> = MathUtil.GreaterThan<Start, End> extends true
  ? never
  :
      | `${PS extends true
          ? MathUtil.SmallerThan<Start, 10> extends true
            ? PadStart<Start, "0">
            : Start
          : Start}`
      | CreateNumStr<
          MathUtil.Add<Start, 1> extends number ? MathUtil.Add<Start, 1> : End,
          End,
          PS
        >;

type MonthStr = CreateNumStr<1, 12, true>;
type DateStr = CreateNumStr<1, 30, true>;
type YearFirstTwo = "19" | "20";
type YearSecondTwo =
  | CreateNumStr<1, 40, true>
  | CreateNumStr<40, 80, true>
  | CreateNumStr<80, 99, true>;

type GetDate<FormatFragment extends YMD> = FormatFragment extends YY
  ? `${YearFirstTwo}${YearSecondTwo}`
  : FormatFragment extends MM
  ? MonthStr
  : FormatFragment extends DD
  ? DateStr
  : never;

type FormatDate<Format extends string> = isRightfulFormat<Format> extends true
  ? `${GetDate<GetDateFormat<Format, 0>>}${GetSeparator<Format>}${GetDate<
      GetDateFormat<Format, 1>
    >}${GetSeparator<Format>}${GetDate<GetDateFormat<Format, 2>>}`
  : never;

const a: FormatDate<"YY-MM-DD"> = "2023-01-02";

const b: FormatDate<"DD/MM/YY"> = "01/02/2024";

// const c: FormatDate<"DD/MM/YY"> = "2024-01-02"; 报错

export {};
