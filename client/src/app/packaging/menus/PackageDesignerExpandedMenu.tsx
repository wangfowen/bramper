import React, {Component} from 'react';
import { connect } from 'react-redux';

import {ToolJson} from "app/models/packaging/tool";
import styles from './PackageMenus.module.css';
import {createBackground, createContent} from "../duck/actions";
import {DesignerMode, PackageSide} from "app/models/packaging/packaging";
import {ReduxState} from "reducers";
import {BackgroundJson} from "app/models/packaging/background";
import {Packaging} from "../packaging/Packaging";
import {ContentJson} from "app/models/packaging/content";
import {LayerType} from "app/models/packaging/layer";

interface StateProps {
  mode: DesignerMode,
  selectedSide: PackageSide,
  packaging: Packaging
}

interface OuterProps {
  toolsJson: ToolJson[]
}

interface DispatchProps {
  createContent: (contentJson: ContentJson) => void,
  createBackground: (backgroundJson: BackgroundJson, mode: DesignerMode, selectedSide: PackageSide) => void
}

/*
shows tools from the category. clicking one creates a layer using that tool
 */
class PackageDesignerExpandedMenu extends Component<OuterProps & DispatchProps & StateProps> {
  createLayer(toolJson: ToolJson) {
    if (toolJson.type === LayerType.Background) {
      const background = toolJson.props;
      this.props.createBackground(background, this.props.mode, this.props.selectedSide);
    } else {
      const layer = toolJson.props;
      const modLayer = Object.assign({}, layer);

      if (this.props.mode === DesignerMode.Full) {
        modLayer.origin = this.props.packaging.translateCoords(toolJson.relativeOrigin);
      } else if (this.props.mode === DesignerMode.Side) {
        modLayer.origin = this.props.packaging.translateCoords(toolJson.relativeOrigin, this.props.selectedSide);
      }
      this.props.createContent(modLayer);
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

export default connect(mapStateToProps, {createContent, createBackground})(PackageDesignerExpandedMenu);
