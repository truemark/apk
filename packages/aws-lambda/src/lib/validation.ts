import {ValidationError} from "./errors";

/**
 * Throws a ValidationError if the value is null or undefined.
 * This function also asserts the value to be NonNullable if the check passes.
 *
 * @param name the name of the variable
 * @param o the value to check
 */
export function notNull(name: string, o?: any): asserts o is NonNullable<any> {
  if (o === undefined || o === null) {
    throw new ValidationError(`${name} may not be null or undefined`);
  }
}

/**
 * Throws a ValidationError if the value is null, undefined or the length is 0.
 * This function also asserts the value to be NonNullable if the check passes.
 *
 * @param name the name of the variable
 * @param o the value to check
 */
export function notEmpty(name: string, o?: any): asserts o is NonNullable<any> {
  if (o === undefined || o === null || o.toString().length === 0) { // works for arrays as well
    throw new ValidationError(`${name} may not be empty`);
  }
}

/**
 * Throws a ValidationError if the value is null, undefined, has a length of 0 or contains only whitespace.
 * This function also asserts the value to be NonNullable if the check passes.
 *
 * @param name the name of the variable
 * @param o the value to check
 */
export function notBlank(name: string, o?: any): asserts o is NonNullable<any> {
  if (o === undefined || o === null || o.toString().trim().length === 0) {
    throw new ValidationError(`${name} may not be blank`);
  }
}

/**
 * Throws a ValidationError if the value does not match the regular expression provided.
 * Undefined and null values are skipped and not validated.
 *
 * @param name the name of the variable
 * @param regex the regular expression to validate with
 * @param o the value to check
 */
export function matches(name: string, regex: RegExp, o?: string) {
  if (o !== undefined && o !== null && !o.match(regex)) {
    throw new ValidationError(`${name} must match ${regex}`);
  }
}

/**
 * Throws a ValidationError if the value provided is not an email.
 * Undefined and null values are skipped and not validated.
 *
 * @param name the name of the variable
 * @param o the value to check
 */
export function isEmail(name: string, o?: string) {
  const expression: RegExp = /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/
  if (o !== undefined && o !== null && !expression.test(o)) {
    throw new ValidationError(`${name} is not a valid email address`);
  }
}

/**
 * Throws a ValidationError if the value provided has a length that exceeds the provided length.
 * Undefined and null values are skipped and not validated.
 *
 * @param name the name of the variable
 * @param length the maximum length of the variable
 * @param o the value to check
 */
export function maxLength(name: string, length: number, o?: string | any[]) {
  if (o !== undefined && o !== null && o.length > length) {
    throw new ValidationError(`length of ${name} may not exceed ${length}`);
  }
}

/**
 * Throws a ValidationError if the value provided has a length that is less than the provided length.
 * Undefined and null values are skipped and not validated.
 *
 * @param name the name of the variable
 * @param length the minimum length of the variable
 * @param o the value to check
 */
export function minLength(name: string, length: number, o?: string | any[]) {
  if (o !== undefined && o !== null && o.length < length) {
    throw new ValidationError(`length of ${name} may not be less than ${length}`);
  }
}

/**
 * Throws a ValidationError if the value provided is not a number.
 * Undefined and null values are skipped and not validated.
 *
 * @param name the name of the variable
 * @param o the value to check
 */
export function isNumber(name: string, o?: string) {
  if (o !== undefined && o !== null && isNaN(Number(o))) {
    throw new ValidationError(`${name} is not a number`);
  }
}

/**
 * Throws a ValidationError if the value is less than the provided minimum value.
 *
 * @param name the name of the variable
 * @param minValue the minimum value allowed
 * @param o the value to check
 */
export function minValue(name: string, minValue: any, o?: any) {
  if (o !== undefined && o !== null && o < minValue) {
    throw new ValidationError(`${name} may not be less than ${minValue}`);
  }
}

/**
 * Throws a ValidationError if the value is more than the provided maximum value.
 *
 * @param name the name of the variable
 * @param maxValue the maximum value allowed
 * @param o the value to check
 */
export function maxValue(name: string, maxValue: any, o?: any) {
  if (o !== undefined && o != null && o > maxValue) {
    throw new ValidationError(`${name} may not be more than ${maxValue}`);
  }
}

/**
 * Throws a ValidationError if the value is not between the provided minimum and maximum values inclusive.
 *
 * @param name the name of the variable
 * @param minValue the minimum value allowed
 * @param maxValue the maximum value allowed
 * @param o the value to check
 */
export function betweenValues(name: string, minValue: any, maxValue: any, o?: any) {
  if (o !== undefined && o != null && (o > maxValue || o < minValue)) {
    throw new ValidationError(`${name} must be in the range of ${minValue} and ${maxValue}`);
  }
}
