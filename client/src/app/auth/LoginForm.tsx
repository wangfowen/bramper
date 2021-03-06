import React from 'react';
import { reduxForm } from 'redux-form'

import {TextField} from "app/common/ReduxForm/TextField";

const LoginForm = props => {
  const {handleSubmit, disabled} = props;

  return <form onSubmit={handleSubmit}>
    <TextField name="email" label="Email" type="email" isRequired />
    <TextField name="password" label="Password" type="password" isRequired />
    <button className="btn btn-primary" type="submit" disabled={disabled}>Submit</button>
  </form>
};

export default reduxForm({
  form: 'login'
})(LoginForm);
