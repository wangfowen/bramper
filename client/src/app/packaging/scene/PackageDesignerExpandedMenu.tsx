import React, {Component} from 'react';
import {DesignerMode, Layer} from "app/models/packaging";

interface OuterProps {
  mode: DesignerMode,
  items: Layer[]
}

class PackageDesignerExpandedMenu extends Component<OuterProps> {
  /*
  TODO(menu): render icons based on items passed in
  on icon click, add that layer into canvas
  if mode is Box, parse each side into layers
  if mode is Side, add to current side
   */
  render() {
    return null
  }
}

export default PackageDesignerExpandedMenu