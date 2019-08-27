import React, {Component} from 'react';
import { connect } from 'react-redux';

import {DesignerMode, PackageSide} from "app/models/packaging";
import {ApplicableSurface, LayerJson, ToolJson} from "app/models/tools/tools";
import styles from './PackageMenus.module.css';
import {createLayer} from "../duck/actions";
import {LayerHelper} from "../layers/Layer";

interface OuterProps {
  selectedSide: PackageSide,
  mode: DesignerMode,
  toolsJson: ToolJson[]
}

interface DispatchProps {
  createLayer: (layerJson: LayerJson, sides: PackageSide[]) => void
}

class PackageDesignerExpandedMenu extends Component<OuterProps & DispatchProps> {
  selectedIsTop() {
    const {selectedSide} = this.props;
    return selectedSide === PackageSide.Top || selectedSide === PackageSide.Bottom;
  }

  createLayer(toolJson: ToolJson) {
    const {mode} = this.props;
    if (mode === DesignerMode.ThreeD) {
      if (toolJson.All !== undefined) {
        const layerJson = LayerHelper.layerFromTool(toolJson, ApplicableSurface.All);
        this.props.createLayer(layerJson, [PackageSide.Front, PackageSide.Back, PackageSide.Top, PackageSide.Bottom, PackageSide.Left, PackageSide.Right]);
      }
      //could have some combination of all of them for box mode tools
      if (toolJson.Tops !== undefined) {
        const layerJson = LayerHelper.layerFromTool(toolJson, ApplicableSurface.Tops);
        this.props.createLayer(layerJson, [PackageSide.Top, PackageSide.Bottom]);
      }
      if (toolJson.Sides !== undefined) {
        const layerJson = LayerHelper.layerFromTool(toolJson, ApplicableSurface.Sides);
        this.props.createLayer(layerJson, [PackageSide.Front, PackageSide.Back, PackageSide.Left, PackageSide.Right]);
      }
    } else if (mode === DesignerMode.Side) {
      if (toolJson.All !== undefined) {
        const layerJson = LayerHelper.layerFromTool(toolJson, ApplicableSurface.All);
        this.props.createLayer(layerJson, [this.props.selectedSide]);
        return
      }

      //could only apply top or side for the one
      if (this.selectedIsTop() && toolJson.Tops !== undefined) {
        const layerJson = LayerHelper.layerFromTool(toolJson, ApplicableSurface.Tops);
        this.props.createLayer(layerJson, [this.props.selectedSide]);
      } else if (toolJson.Sides !== undefined) {
        const layerJson = LayerHelper.layerFromTool(toolJson, ApplicableSurface.Sides);
        this.props.createLayer(layerJson, [this.props.selectedSide]);
      }
    }
  }

  render() {
    const {toolsJson, mode} = this.props;

    //does this tool work for the side we're looking at
    const applicableTools = mode !== DesignerMode.Side ? toolsJson : toolsJson.filter((tool) => {
      if (tool.All !== undefined) {
        return true;
      }

      if (this.selectedIsTop()) {
        return tool.Tops !== undefined
      } else {
        return tool.Sides !== undefined
      }
    });

    if (applicableTools.length > 0) {
      return applicableTools.map((tool) => {
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

export default connect(() => {return {}}, {createLayer})(PackageDesignerExpandedMenu);
