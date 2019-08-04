import React from 'react';
import { reduxForm } from 'redux-form'

import {TextField} from "app/common/ReduxForm/TextField";
import styles from "./Settings.module.css";

export interface SettingsFormProp {
}

const SettingsForm = props => {
  const {handleSubmit} = props;

  return <form className={styles.form} onSubmit={handleSubmit}>
    <div className="form-group">

      <button className="btn btn-primary" type="submit">Submit</button>
    </div>
  </form>
};

export default reduxForm({
  form: 'settings'
})(SettingsForm);
