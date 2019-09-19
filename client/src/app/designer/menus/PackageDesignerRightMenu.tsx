import React, {Component, FormEventHandler} from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { reduxForm } from 'redux-form'

import {ReduxState} from "reducers";
import styles from './PackageMenus.module.css';
import {updateLayer} from "../duck/actions";
import {BackgroundLayer} from "../backgrounds/BackgroundLayer";
import {ContentLayer} from "../contents/ContentLayer";
import {SelectedLayer} from "app/models/designer/layer";

interface FormType {
  handleSubmit: FormEventHandler,
  layer: ContentLayer | BackgroundLayer
}

const EditLayerForm = (props: FormType) => {
  const {handleSubmit, layer} = props;

  return <form onSubmit={handleSubmit}>
    {layer.editForm()}
    <button className="btn btn-primary" type="submit">Save</button>
  </form>
};

const EditLayerReduxForm = reduxForm({
  form: 'editLayer'
})(EditLayerForm);

interface StateProps {
  layer: ContentLayer | BackgroundLayer | undefined
}

interface DispatchProps {
  updateLayer: (layer: SelectedLayer) => void
}

/*
if a layer is selected, its editable properties show up here. editing them triggers update layer
 */
class PackageDesignerRightMenu extends Component<StateProps & DispatchProps> {
  updateLayer(json) {
    const {layer, updateLayer} = this.props;
    if (layer !== undefined) {
      updateLayer({
        id: layer.id,
        type: layer.type,
        json: json
      })
    }
  }

  render() {
    const {layer} = this.props;
    if (layer !== undefined) {
      return <div className={classNames(styles.rightMenu)}>
        <EditLayerReduxForm onSubmit={this.updateLayer.bind(this)} layer={layer} initialValues={layer.toJson()} />
      </div>
    } else {
      return null
    }
  }
}

const mapStateToProps = (state: ReduxState) => {
  return {
    layer: state.designer.selectedLayer
  }
};

export default connect(mapStateToProps, {updateLayer})(PackageDesignerRightMenu);
