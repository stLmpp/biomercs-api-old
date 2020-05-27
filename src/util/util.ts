import { isNullOrUndefined, isNumber } from 'is-what';

export function isNil<T = any>(value: T): value is null | undefined {
  return value == null;
}

export type RemoveNullObjectCheckType = 'strict' | 'loose';

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
  return Object.entries(obj).reduce((obj, [key, value]) => {
    if (key === propertyToFlatten) {
      obj = { ...obj, ...value };
    } else {
      obj = { ...obj, [key]: value };
    }
    return obj;
  }, {});
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
