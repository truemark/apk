import {isValidationError, ValidationError} from "./validation-error";

test("Test ValidationError", () => {
  expect(isValidationError(new ValidationError("Just a test"))).toBeTruthy();
  expect(isValidationError(new Error("Just a test"))).toBeFalsy();
  expect(isValidationError(undefined)).toBeFalsy();
  expect(isValidationError(null)).toBeFalsy();
  expect(isValidationError("test")).toBeFalsy();
});
