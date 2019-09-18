import React from 'react';
import {Field} from 'redux-form'
import { TwitterPicker } from 'react-color';

import {FormHelper, ReduxFieldProps, WrappedInput} from "./FormHelper";

export interface ColorPickerFieldJson {
  name: string,
  label?: string,
  isRequired?: boolean
}

class ColorPickerFieldInner extends React.Component<ColorPickerFieldJson & ReduxFieldProps> {
  componentDidMount() {
    const {input, meta} = this.props;
    if (!input.value) {
      if (meta.initial) {
        input.onChange(meta.initial);
      }
    }
  }

  onChange(color) {
    this.props.input.onChange(color.hex);
  }

  render() {
    const {name, label, isRequired, meta, input} = this.props;

    const color = input.value || meta.initial;

    const element = <TwitterPicker
      name={name}
      color={color}
      onChangeComplete={this.onChange.bind(this)}
    />;

    return WrappedInput(element, {name, label, isRequired, meta})
  }
}

export function ColorPickerField(props: ColorPickerFieldJson) {
  const {isRequired} = props;

  let validate: ((value: string) => undefined | string)[] = [];
  if (isRequired) {
    validate.push(FormHelper.required)
  }

  return <Field
    component={ColorPickerFieldInner}
    validate={validate}
    {...props}
  />
}