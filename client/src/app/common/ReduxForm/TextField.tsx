import React from 'react'
import {Field} from 'redux-form'
import {FormHelper, AdaptedInput} from './FormHelper'

export interface TextFieldJson {
  name: string,
  type?: string,
  label?: string,
  placeholder?: string,
  isRequired?: boolean,
  isNumber?: boolean
}

export function TextField(props: TextFieldJson) {
  const { name, label, isRequired, type, placeholder, isNumber } = props;
  
  let validate: ((value: string) => undefined | string)[] = [];
  if (isRequired) {
    validate.push(FormHelper.required)
  }
  if (type === "email") {
    validate.push(FormHelper.isEmail)
  }
  if (type === "password") {
    validate.push(FormHelper.validPassword)
  }
  if (isNumber) {
    validate.push(FormHelper.isNumber)
  }

  return <Field
    name={name}
    component={AdaptedInput}
    type={type || "text"}
    placeholder={placeholder}
    validate={validate}
    isRequired={isRequired}
    label={label}
  />
}
