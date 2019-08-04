import {FormHelper} from "./FormHelper";

it ('validates email if exists', () => {
  expect(FormHelper.isEmail("bademail")).toEqual("Please provide a valid email")
  expect(FormHelper.isEmail("bademail@")).toEqual("Please provide a valid email")
  expect(FormHelper.isEmail("bademail@.com")).toEqual("Please provide a valid email")
  expect(FormHelper.isEmail("@.com")).toEqual("Please provide a valid email")
  expect(FormHelper.isEmail("@bademail.com")).toEqual("Please provide a valid email")

  expect(FormHelper.isEmail(undefined)).toEqual(undefined)
  expect(FormHelper.isEmail("admin@example.com")).toEqual(undefined)
  expect(FormHelper.isEmail("goodemail@email.com")).toEqual(undefined)
  expect(FormHelper.isEmail("goodemail@email.domain")).toEqual(undefined)
});

it ('validates password if exists', () => {
  expect(FormHelper.validPassword(undefined)).toEqual(undefined)
  expect(FormHelper.validPassword("password")).toEqual(undefined)

  expect(FormHelper.validPassword("pass")).toEqual("Password must be at least 8 characters")
})

it ('validates number if exists', () => {
  expect(FormHelper.isNumber(undefined)).toEqual(undefined);
  expect(FormHelper.isNumber("123")).toEqual(undefined);
  expect(FormHelper.isNumber("123.1")).toEqual(undefined);
  expect(FormHelper.isNumber("-123.1")).toEqual(undefined);

  expect(FormHelper.isNumber("pass")).toEqual("Must be a number");
  expect(FormHelper.isNumber("1pass")).toEqual("Must be a number");
})