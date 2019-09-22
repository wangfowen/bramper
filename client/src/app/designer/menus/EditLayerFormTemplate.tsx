import React, {Component} from 'react';
import {reduxForm, InjectedFormProps} from 'redux-form'

import {Layer} from "../layers/Layer";

interface OuterProps {
  layer: Layer
}

class EditLayerFormTemplate extends React.Component<InjectedFormProps<{}, OuterProps> & OuterProps> {
  render() {
    const {handleSubmit, layer} = this.props;

    return <form onSubmit={handleSubmit}>
      {layer.editForm()}
      <button className="btn btn-primary" type="submit">Save</button>
    </form>
  }
}

export default reduxForm({
  form: 'editLayer',
  destroyOnUnmount: false,
  enableReinitialize: true
})(EditLayerFormTemplate);
