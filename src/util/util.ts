import { isNullOrUndefined, isNumber } from 'is-what';
import { SelectQueryBuilder } from 'typeorm';

export function isNil<T = any>(value: T): value is null | undefined {
  return value == null;
}

export type RemoveNullObjectCheckType = 'strict' | 'loose';
export type JoinType = keyof Pick<
  SelectQueryBuilder<any>,
  'innerJoinAndSelect' | 'innerJoin' | 'leftJoin' | 'leftJoinAndSelect'
>;

export function removeNullObject<T = any>(
  object: T,
  checkType: RemoveNullObjectCheckType = 'strict'
): T {
  if (!object) return object;
  let checkFn: (value: T) => boolean;
  if (checkType === 'loose') {
    checkFn = value => {
      if (isNumber(value)) {
        return value === 0 ? true : !!value;
      } else {
        return !!value;
      }
    };
  } else if (checkType === 'strict') {
    checkFn = value => !isNil(value);
  }
  return Object.entries(object).reduce((obj, [key, value]) => {
    if (checkFn(value)) {
      obj[key] = value;
    }
    return obj;
  }, {}) as T;
}

export function isObjectEmpty<T = any>(obj: T): boolean {
  return isNullOrUndefined(obj) || !Object.keys(obj).length;
}

export function flattenObject(
  obj: { [key: string]: any },
  propertyToFlatten: string
): { [key: string]: any } {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (key === propertyToFlatten) {
      acc = { ...acc, ...value };
    } else {
      acc = { ...acc, [key]: value };
    }
    return acc;
  }, {});
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function sample<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function multipleSample<T>(arr: T[], n: number): T[] {
  const result = new Array(n);
  let len = arr.length;
  const taken = new Array(len);
  if (n > len) {
    throw new RangeError('getRandom: more elements taken than available');
  }
  while (n--) {
    const x = Math.floor(Math.random() * len);
    result[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
}

export function deleteProperties<T = any>(object: T, keys: (keyof T)[]): T {
  for (const key of keys) {
    if (object.hasOwnProperty(key)) {
      delete object[key];
    }
  }
  return object;
}
