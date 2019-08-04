import React from 'react'
import styles from './Form.module.css'

//when you stick a component into a Field, these props are what get injected and you interact with
export interface ReduxFieldProps {
  input: {
    name: string,
    value: string,
    onChange: (value) => void
  },
  meta: {
    touched: boolean,
    error?: string,
    warning?: string,
    initial?: string | number
  }
}

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const FormHelper = {
  required: (value) => (value !== undefined && value !== "" && value !== null) ? undefined : "This field is required",
  isEmail: (value) => value === undefined || emailRegex.test(value) ? undefined : "Please provide a valid email",
  validPassword: (value) => value === undefined || value.length >= 8 ? undefined : "Password must be at least 8 characters",
  isNumber: (value) => value === undefined || value === "" || !isNaN(value) ? undefined :  "Must be a number"
};

export const WrappedInput = (field: React.ReactNode, props) => {
  const {name, label, isRequired, meta} = props;
  const { touched, error, warning } = meta;

  let top;
  if (label !== undefined) {
    top = <label htmlFor={name}>{label}
      {isRequired && <span className={styles.required}>*</span>}
    </label>
  } else if (isRequired) {
    top = <span className={styles.required}>*</span>
  }

  return <div className={styles.field}>
    {top}
    {touched && ((error && <div className={styles.error}>{error}</div>) || (warning && <div className={styles.error}>{warning}</div>))}
    <div className={styles.input}>
      {field}
    </div>
  </div>
};

export const AdaptedInput = (props) => {
  const {name, type, input, placeholder, children, className} = props;
  const field = <input className={className || "form-control"} placeholder={placeholder} name={name} type={type} children={children} {...input} />;

  return WrappedInput(field, props)
};