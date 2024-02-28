// IsAny 判断一个类型是否 any 类型
type one = 1 & any;
type n = never & any;
// type isAny<T> = T & never;
