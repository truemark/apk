import {
  betweenValues,
  isEmail,
  isNumber,
  matches,
  maxLength,
  maxValue,
  minLength,
  minValue,
  notBlank,
  notEmpty,
  notNull
} from "./validators";
import {ValidationError} from "./validation-error";

test("Test notNull", () => {
  expect(() => notNull("test", null)).toThrow(ValidationError);
  expect(() => notNull("test", undefined)).toThrow(ValidationError);
  notNull("test", "test");
});

test("Test notEmpty", () => {
  expect(() => notEmpty("test", null)).toThrow(ValidationError);
  expect(() => notEmpty("test", undefined)).toThrow(ValidationError);
  expect(() => notEmpty("test", "")).toThrow(ValidationError);
  expect(() => notEmpty("test", [])).toThrow(ValidationError);
  notEmpty("test", "test");
  notEmpty("test", " ");
  notEmpty("test", ["test1", "test2"]);
});

test("Test notBlank", () => {
  expect(() => notBlank("test", null)).toThrow(ValidationError);
  expect(() => notBlank("test", undefined)).toThrow(ValidationError);
  expect(() => notBlank("test", "")).toThrow(ValidationError);
  expect(() => notBlank("test", [])).toThrow(ValidationError);
  expect(() => notBlank("test", [" "])).toThrow(ValidationError);
  expect(() => notBlank("test", " ")).toThrow(ValidationError);
  notBlank("test", "test");
  notBlank("test", [" ", " "]);
  notBlank("test", ["test1", "test2"]);
});

test("Test matches", () => {
  expect(() => matches("test", /[a-z]+/, "ABC")).toThrow(ValidationError);
  matches("test", /[a-z]+/, undefined);
  matches("test", /[a-z]+/, null);
  matches("test", /[a-z]+/, "abc");
});

test("Test isEmail", () => {
  expect(() => isEmail("test", "@example.com")).toThrow(ValidationError);
  expect(() => isEmail("test", "abc")).toThrow(ValidationError);
  expect(() => isEmail("test", "")).toThrow(ValidationError);
  expect(() => isEmail("test", " ")).toThrow(ValidationError);
  expect(() => isEmail("test", " foo@example.com")).toThrow(ValidationError);
  expect(() => isEmail("test", "foo@example.com ")).toThrow(ValidationError);
  expect(() => isEmail("test", "foo@ example.com ")).toThrow(ValidationError);
  expect(() => isEmail("test", "foo @example.com ")).toThrow(ValidationError);
  isEmail("test", undefined);
  isEmail("test", null);
  isEmail("test", "test@localhost");
  isEmail("test", "test@example.com");
  isEmail("test", "a@b.xx");
  isEmail("test", "A@B.XX");
});

test("Test maxLength", () => {
  expect(() => maxLength("test", 1, "12")).toThrow(ValidationError);
  expect(() => maxLength("test", 1, [1, 2])).toThrow(ValidationError);
  maxLength("test", 1, undefined);
  maxLength("test", 1, null);
  maxLength("test", 3, "abc");
  maxLength("test", 3, "ab");
  maxLength("test", 3, "a");
  maxLength("test", 3, "");
  maxLength("test", 3, [1, 2, 3]);
  maxLength("test", 3, [1, 2]);
  maxLength("test", 3, [1]);
  maxLength("test", 3, []);
});

test("Test minLength", () => {
  expect(() => minLength("test", 3, "12")).toThrow(ValidationError);
  expect(() => minLength("test", 3, [1,2])).toThrow(ValidationError);
  minLength("test", 1, undefined);
  minLength("test", 1, null);
  minLength("test", 3, "abc");
  minLength("test", 3, "abcd");
  minLength("test", 3, [1,2,3]);
  minLength("test", 3, [1,2,3,4]);
});

test("Test isNumber", () => {
  expect(() => isNumber("test", "1234a")).toThrow(ValidationError);
  isNumber("test", undefined);
  isNumber("test", null);
  isNumber("test", "1234");
  isNumber("test", "1234.5678");
});

test("Test minValue", () => {
  expect(() => minValue("test", 1, 0)).toThrow(ValidationError);
  expect(() => minValue("test", "oink", "meow")).toThrow(ValidationError);
  minValue("test", 1, undefined);
  minValue("test", 1, null);
  minValue("test", 2, 2);
  minValue("test", 2, 3);
  minValue("test", "oink", "oink");
  minValue("test", "oink", "zebra");
});

test("Test maxValue", () => {
  expect(() => maxValue("test", 2, 3)).toThrow(ValidationError);
  expect(() => maxValue("test", "oink", "zebra")).toThrow(ValidationError);
  maxValue("test", 1, undefined);
  maxValue("test", 1, null);
  maxValue("test", 1, 1);
  maxValue("test", 1, 0);
  maxValue("test", "oink", "oink");
  maxValue("test", "oink", "meow");
});

test("Test betweenValues", () => {
  expect(() => betweenValues("test", 1, 3, 4)).toThrow(ValidationError);
  expect(() => betweenValues("test", 1, 3, 0)).toThrow(ValidationError);
  expect(() => betweenValues("test", "meow", "oink", "zebra")).toThrow(ValidationError);
  expect(() => betweenValues("test", "oink", "zebra", "meow")).toThrow(ValidationError);
  betweenValues("test", 1, 3, undefined);
  betweenValues("test", 1, 3, null);
  betweenValues("test", 1, 3, 1);
  betweenValues("test", 1, 3, 2);
  betweenValues("test", 1, 3, 3);
  betweenValues("test", "meow", "zebra", "meow");
  betweenValues("test", "meow", "zebra", "zebra");
  betweenValues("test", "meow", "zebra", "oink");
});
