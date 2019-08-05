import React, {Component} from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import {DesignerMode, PackageSide} from "app/models/packaging";
import {ReduxState} from "reducers";
import PackageDesignerExpandedMenu from "./PackageDesignerExpandedMenu";
import styles from './PackageDesigner.module.css';
import samples from './samples.json';
import {Sample, Tool} from "app/models/tools/tools";
import {BackgroundTool} from "app/models/tools/background";

interface State {
  selected: Tool,
  toolSamples: Sample[]
}

interface StateProps {
  mode: DesignerMode,
  selectedSide: PackageSide
}

class PackageDesignerLeftMenu extends Component<StateProps, State> {
  constructor(props) {
    super(props);
    this.state = {
      selected: BackgroundTool,
      toolSamples: []
    }
  }

  componentDidMount() {
    this.getToolSamples(this.state.selected, this.props.mode)
  }

  getToolSamples(property: Tool, mode: DesignerMode) {
    //this would eventually become an API call. for now we can hard code as JSON
    const samplesJson = samples[mode] && samples[mode][property.id];
    this.setState({
      toolSamples: samplesJson
    })
  }

  renderButton(property: Tool, mode: DesignerMode) {
    return <button key={property.name} onClick={() => this.getToolSamples(property, mode)}>{property.name}</button>
  }

  renderLeftMenu(children: React.ReactNode[]) {
    const {mode, selectedSide} = this.props;

    let expandedMenu;
    if (this.state.toolSamples.length > 0) {
      expandedMenu = <div className={classNames(styles.expandedLeftMenu)}>
        <PackageDesignerExpandedMenu mode={mode} samples={this.state.toolSamples} selectedSide={selectedSide} />
      </div>
    }

    return <div className={classNames(styles.leftMenu)}>
      <div className={classNames(styles.leftMenuIcons)}>
        {children}
      </div>

      {expandedMenu}
    </div>;
  }

  render() {
    const {mode} = this.props;

    switch (mode) {
      case DesignerMode.Box:
        return this.renderLeftMenu([
          this.renderButton(BackgroundTool, DesignerMode.Box)
        ]);
      case DesignerMode.Side:
        return this.renderLeftMenu([
          this.renderButton(BackgroundTool, DesignerMode.Side)
        ]);
      default:
        return null;
    }
  }
}

const mapStateToProps = (state: ReduxState) => {
  return {
    mode: state.packaging.mode,
    selectedSide: state.packaging.selectedSide
  }
};

export default connect(mapStateToProps, {})(PackageDesignerLeftMenu);
