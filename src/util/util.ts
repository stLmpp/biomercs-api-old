import { isNumber } from 'is-what';

export function isNil(value: any): value is null | undefined {
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
