import React from 'react'
import {Field} from 'redux-form'
import ReactDatePicker from "react-datepicker";
import moment, {Moment} from "moment";
import "react-datepicker/dist/react-datepicker.css";
import classNames from 'classnames';

import {FormHelper, WrappedInput, ReduxFieldProps} from './FormHelper'
import "./Picker.css";

export interface DatePickerFieldJson {
  name: string,
  label?: string,
  isRequired?: boolean
}

export const DateHelper = {
  toApiFormat(date: Moment) {
    return date.valueOf()
  },

  fromApiFormat(dateMs: string | number) {
    return moment(parseInt(dateMs.toString(), 10))
  }
};

class DatePickerFieldInner extends React.Component<DatePickerFieldJson & ReduxFieldProps> {
  componentDidMount() {
    const {input, meta, isRequired} = this.props;
    if (!input.value) {
      if (meta.initial) {
        input.onChange(meta.initial);
      } else if (isRequired) {
        input.onChange(DateHelper.toApiFormat(moment().startOf('day')))
      }
    }
  }

  onChange(date) {
    this.props.input.onChange(DateHelper.toApiFormat(moment(date)))
  }

  render() {
    const {name, label, isRequired, meta, input} = this.props;

    let date;
    if (input.value) {
      date = DateHelper.fromApiFormat(input.value).toDate();
    } else if (meta.initial) {
      date = DateHelper.fromApiFormat(meta.initial).toDate();
    } else if (isRequired) {
      date = moment().startOf('day').toDate();
    }

    const element = <ReactDatePicker
      name={name}
      selected={date}
      onChange={this.onChange.bind(this)}
      className={classNames("form-control", "picker")}
    />;

    return WrappedInput(element, {name, label, isRequired, meta})
  }
}

export function DatePickerField(props: DatePickerFieldJson) {
  const {isRequired} = props;

  let validate: ((value: string) => undefined | string)[] = [];
  if (isRequired) {
    validate.push(FormHelper.required)
  }

  return <Field
    component={DatePickerFieldInner}
    validate={validate}
    {...props}
  />
}