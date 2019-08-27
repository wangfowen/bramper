import React, {Component} from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import {DesignerMode, PackageSide} from "app/models/packaging";
import {ReduxState} from "reducers";
import PackageDesignerExpandedMenu from "./PackageDesignerExpandedMenu";
import styles from './PackageMenus.module.css';
import allToolsJson from './tools.json';
import {ToolCategory, ToolJson} from "app/models/tools/tools";
import {BackgroundCategory} from "app/models/tools/background";

interface State {
  selected: ToolCategory,
  toolsJson: ToolJson[]
}

interface StateProps {
  mode: DesignerMode,
  selectedSide: PackageSide
}

type Props = StateProps

/*
shows tool categories. clicking one opens the expanded menu showing the tools for that category
 */
class PackageDesignerLeftMenu extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      selected: BackgroundCategory,
      toolsJson: []
    }
  }

  componentDidMount() {
    this.getTools(this.state.selected, this.props.mode)
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.mode !== this.props.mode) {
      this.getTools(this.state.selected, nextProps.mode)
    }
  }

  getTools(category: ToolCategory, mode: DesignerMode) {
    //this would eventually become an API call. for now we can hard code as JSON
    const toolsJson = allToolsJson[mode] && allToolsJson[mode][category.id];
    this.setState({
      toolsJson: toolsJson || []
    })
  }

  renderButton(category: ToolCategory, mode: DesignerMode) {
    return <button key={category.name} onClick={() => this.getTools(category, mode)}>{category.name}</button>
  }

  renderLeftMenu(children: React.ReactNode[]) {
    const {mode, selectedSide} = this.props;

    let expandedMenu;
    if (this.state.toolsJson.length > 0) {
      expandedMenu = <div className={classNames(styles.expandedLeftMenu)}>
        <PackageDesignerExpandedMenu mode={mode} toolsJson={this.state.toolsJson} selectedSide={selectedSide} />
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
      case DesignerMode.ThreeD:
        return this.renderLeftMenu([
          this.renderButton(BackgroundCategory, DesignerMode.ThreeD)
        ]);
      case DesignerMode.Side:
        return this.renderLeftMenu([
          this.renderButton(BackgroundCategory, DesignerMode.Side)
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
