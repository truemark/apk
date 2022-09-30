import {ValidationError} from "./errors";

export function notEmpty(name: string, o?: any): asserts o is NonNullable<any> {
  if (o === undefined || o === null || (typeof o === "string" && o.trim() === "")) {
    throw new ValidationError(`${name} may not be empty`);
  }
}

export function matches(name: string, regex: RegExp, o?: string) {
  if (o !== undefined && o !== null && !o.match(regex)) {
    throw new ValidationError(`${name} must match ${regex}`);
  }
}

export function isEmail(name: string, o?: string) {
  if (o !== undefined && o !== null && !o.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
    throw new ValidationError(`${name} is not a valid email address`);
  }
}

export function maxLength(name: string, length: number, o?: string) {
  if (o !== undefined && o !== null && o.length > length) {
    throw new ValidationError(`length of ${name} may not exceed ${length}`);
  }
}

export function minLength(name: string, length: number, o?: string) {
  if (o !== undefined && o !== null && o.length < length) {
    throw new ValidationError(`length of ${name} may not be less than ${length}`);
  }
}
