import {
  ForbiddenError,
  isForbiddenError,
  isNotFoundError,
  NotFoundError,
} from "./errors";

test("Test isNotFoundError", () => {
  expect(isNotFoundError(undefined)).toBeFalsy();
  expect(isNotFoundError(null)).toBeFalsy();
  expect(isNotFoundError("test")).toBeFalsy();
  expect(isNotFoundError(new ForbiddenError("just a test"))).toBeFalsy();
  expect(isNotFoundError(new NotFoundError("just a test"))).toBeTruthy();
});

test("Test isForbiddenError", () => {
  expect(isForbiddenError(undefined)).toBeFalsy();
  expect(isForbiddenError(null)).toBeFalsy();
  expect(isForbiddenError("test")).toBeFalsy();
  expect(isForbiddenError(new NotFoundError("just a test"))).toBeFalsy();
  expect(isForbiddenError(new ForbiddenError("just a test"))).toBeTruthy();
});
