import React, {Component} from 'react';
import { connect } from 'react-redux';

import {DesignerMode, PackageSide} from "app/models/packaging";
import {ApplicableSurface, Tool, ToolJson} from "app/models/tools/tools";
import styles from './PackageMenus.module.css';
import {applyTool} from "../duck/actions";
import {LayerHelper} from "../layers/LayerHelper";

interface OuterProps {
  selectedSide: PackageSide,
  mode: DesignerMode,
  toolsJson: ToolJson[]
}

interface DispatchProps {
  applyTool: (tool: Tool, sides: PackageSide[]) => void
}

class PackageDesignerExpandedMenu extends Component<OuterProps & DispatchProps> {
  selectedIsTop() {
    const {selectedSide} = this.props;
    return selectedSide === PackageSide.Top || selectedSide === PackageSide.Bottom;
  }

  applyTool(toolJson: ToolJson) {
    const {mode} = this.props;
    if (mode === DesignerMode.ThreeD) {
      if (toolJson.All !== undefined) {
        const tool = LayerHelper.toolFromJson(toolJson, ApplicableSurface.All);
        this.props.applyTool(tool, [PackageSide.Front, PackageSide.Back, PackageSide.Top, PackageSide.Bottom, PackageSide.Left, PackageSide.Right]);
      }
      //could have some combination of all of them for box mode tools
      if (toolJson.Tops !== undefined) {
        const tool = LayerHelper.toolFromJson(toolJson, ApplicableSurface.Tops);
        this.props.applyTool(tool, [PackageSide.Top, PackageSide.Bottom]);
      }
      if (toolJson.Sides !== undefined) {
        const tool = LayerHelper.toolFromJson(toolJson, ApplicableSurface.Sides);
        this.props.applyTool(tool, [PackageSide.Front, PackageSide.Back, PackageSide.Left, PackageSide.Right]);
      }
    } else if (mode === DesignerMode.Side) {
      if (toolJson.All !== undefined) {
        const tool = LayerHelper.toolFromJson(toolJson, ApplicableSurface.All);
        this.props.applyTool(tool, [this.props.selectedSide]);
        return
      }

      //could only apply top or side for the one
      if (this.selectedIsTop() && toolJson.Tops !== undefined) {
        const tool = LayerHelper.toolFromJson(toolJson, ApplicableSurface.Tops);
        this.props.applyTool(tool, [this.props.selectedSide]);
      } else if (toolJson.Sides !== undefined) {
        const tool = LayerHelper.toolFromJson(toolJson, ApplicableSurface.Sides);
        this.props.applyTool(tool, [this.props.selectedSide]);
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
        return <div className={styles.toolItem} key={tool.id} onClick={() => this.applyTool(tool)}>
          <div>{tool.name}</div>
          <div>{tool.image}</div>
        </div>

      })
    } else {
      return null
    }
  }
}

export default connect(() => {return {}}, {applyTool})(PackageDesignerExpandedMenu);
