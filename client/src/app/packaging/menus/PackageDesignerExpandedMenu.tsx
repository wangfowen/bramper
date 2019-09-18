import React, {Component} from 'react';
import { connect } from 'react-redux';

import {LayerJson, ToolJson, ToolType} from "app/models/layer";
import styles from './PackageMenus.module.css';
import {createBackground, createLayer} from "../duck/actions";
import {DesignerMode, PackageSide} from "app/models/packaging";
import {ReduxState} from "reducers";
import {BackgroundJson} from "app/models/background";
import {Packaging} from "../packaging/Packaging";

interface StateProps {
  mode: DesignerMode,
  selectedSide: PackageSide,
  packaging: Packaging
}

interface OuterProps {
  toolsJson: ToolJson[]
}

interface DispatchProps {
  createLayer: (layerJson: LayerJson) => void,
  createBackground: (backgroundJson: BackgroundJson, mode: DesignerMode, selectedSide: PackageSide) => void
}

/*
shows tools from the category. clicking one creates a layer using that tool
 */
class PackageDesignerExpandedMenu extends Component<OuterProps & DispatchProps & StateProps> {
  createLayer(toolJson: ToolJson) {
    if (toolJson.type === ToolType.Background) {
      const background = toolJson.props as BackgroundJson;
      this.props.createBackground(background, this.props.mode, this.props.selectedSide);
    } else {
      const layer = toolJson.props as LayerJson;
      const modLayer = Object.assign({}, layer);

      if (layer.origin !== undefined) {
        if (this.props.mode === DesignerMode.Full) {
          modLayer.origin = this.props.packaging.translateCoords(layer.origin);
        } else if (this.props.mode === DesignerMode.Side) {
          modLayer.origin = this.props.packaging.translateCoords(layer.origin, this.props.selectedSide);
        }
      }

      this.props.createLayer(modLayer);
    }
  }

  render() {
    const {toolsJson} = this.props;

    if (toolsJson.length > 0) {
      return toolsJson.map((tool) => {
        return <div className={styles.toolItem} key={tool.name} onClick={() => this.createLayer(tool)}>
          <div>{tool.name}</div>
          <div>{tool.image}</div>
        </div>

      })
    } else {
      return null
    }
  }
}

const mapStateToProps = (state: ReduxState): StateProps => {
  return {
    mode: state.packaging.mode,
    selectedSide: state.packaging.selectedSide,
    packaging: state.packaging.packaging
  }
};

export default connect(mapStateToProps, {createLayer, createBackground})(PackageDesignerExpandedMenu);
