import React, {Component} from 'react';
import { connect } from 'react-redux';

import {ToolJson} from "app/models/designer/tool";
import styles from './PackageMenus.module.css';
import {createBackground, createContent} from "../duck/actions";
import {DesignerMode, PackageSide} from "app/models/designer/packaging";
import {ReduxState} from "reducers";
import {BackgroundJson} from "app/models/designer/background";
import {Packaging} from "../packaging/Packaging";
import {ContentJson} from "app/models/designer/content";
import {LayerType} from "app/models/designer/layer";

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

      //TODO(click): how translate coords to ones on actual thing?
      //const relativeSide = this.props.mode === DesignerMode.Full ? undefined : this.props.selectedSide;
      //modLayer.origin = this.props.packaging.dielineCoords(toolJson.relativeOrigin, relativeSide, true);
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
    mode: state.designer.mode,
    selectedSide: state.designer.selectedSide,
    packaging: state.designer.packaging
  }
};

export default connect(mapStateToProps, {createContent, createBackground})(PackageDesignerExpandedMenu);
