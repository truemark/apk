import {
  ForbiddenError,
  isForbiddenError,
  isNotFoundError,
  isValidationError,
  NotFoundError,
  ValidationError
} from "./errors";

test("Test isValidationError", () => {
  expect(isValidationError(undefined)).toBeFalsy();
  expect(isValidationError(null)).toBeFalsy();
  expect(isValidationError("test")).toBeFalsy();
  expect(isValidationError(new NotFoundError("just a test"))).toBeFalsy();
  expect(isValidationError(new ValidationError("just a test"))).toBeTruthy();
});

test("Test isNotFoundError", () => {
  expect(isNotFoundError(undefined)).toBeFalsy();
  expect(isNotFoundError(null)).toBeFalsy();
  expect(isNotFoundError("test")).toBeFalsy();
  expect(isNotFoundError(new ValidationError("just a test"))).toBeFalsy();
  expect(isNotFoundError(new NotFoundError("just a test"))).toBeTruthy();
});

test("Test isForbiddenError", () => {
  expect(isForbiddenError(undefined)).toBeFalsy();
  expect(isForbiddenError(null)).toBeFalsy();
  expect(isForbiddenError("test")).toBeFalsy();
  expect(isForbiddenError(new ValidationError("just a test"))).toBeFalsy();
  expect(isForbiddenError(new ForbiddenError("just a test"))).toBeTruthy();
});
