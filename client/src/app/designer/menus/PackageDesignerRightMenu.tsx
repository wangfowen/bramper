import React, {Component} from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import {ReduxState} from "reducers";
import styles from './PackageMenus.module.css';
import {updateLayer} from "../duck/actions";
import {SelectedLayer} from "../layers/Layer";
import {LayerType} from "../../models/designer/layer";
import {BackgroundHelper} from "../layers/backgrounds/BackgroundLayer";
import {ContentHelper} from "../layers/contents/ContentLayer";
import EditLayerFormTemplate from "./EditLayerFormTemplate";

interface StateProps {
  selectedLayer: SelectedLayer | undefined
}

interface DispatchProps {
  updateLayer: (layer: SelectedLayer) => void
}

/*
if a layer is selected, its editable properties show up here. editing them triggers update layer
 */
class PackageDesignerRightMenu extends Component<StateProps & DispatchProps> {
  updateLayer(updatedJson) {
    const {selectedLayer, updateLayer} = this.props;
    if (selectedLayer !== undefined) {
      let newLayer;
      if (selectedLayer.type === LayerType.Content) {
        newLayer = ContentHelper.newContent(Object.assign({}, selectedLayer.layer.toJson(), updatedJson), selectedLayer.id);
      } else if (selectedLayer.type === LayerType.Background) {
        newLayer = BackgroundHelper.newBackground(Object.assign({}, selectedLayer.layer.toJson(), updatedJson));
      }

      updateLayer({
        id: selectedLayer.id,
        type: selectedLayer.type,
        layer: newLayer
      })
    }
  }

  render() {
    const {selectedLayer} = this.props;
    if (selectedLayer !== undefined) {
      return <div className={classNames(styles.rightMenu)}>
        <EditLayerFormTemplate
          onSubmit={this.updateLayer.bind(this)}
          layer={selectedLayer.layer}
          initialValues={selectedLayer.layer.toJson()}
        />
      </div>
    } else {
      return null
    }
  }
}

const mapStateToProps = (state: ReduxState) => {
  return {
    selectedLayer: state.designer.selectedLayer
  }
};

export default connect(mapStateToProps, {updateLayer})(PackageDesignerRightMenu);
