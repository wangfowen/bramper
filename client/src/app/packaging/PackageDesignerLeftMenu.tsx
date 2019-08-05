import React, {Component} from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import {BackgroundTool, DesignerMode, Layer, Tool} from "app/models/packaging";
import {ReduxState} from "reducers";
import PackageDesignerExpandedMenu from "./scene/PackageDesignerExpandedMenu";

interface State {
  selected: Tool,
  //TODO(menu): this is probably not right type
  expandedMenuItems: Layer[]
}

interface CustomStyles {
  leftMenu?: string,
  leftMenuIcons?: string,
  expandedLeftMenu?: string,
}

interface OuterProps {
  styles?: CustomStyles
}

interface StateProps {
  mode: DesignerMode,
}

class PackageDesignerLeftMenu extends Component<StateProps & OuterProps, State> {
  constructor(props) {
    super(props);
    this.state = {
      selected: BackgroundTool,
      expandedMenuItems: []
    }
  }

  componentDidMount() {
    this.getExpandedMenuItems(this.state.selected, this.props.mode)
  }

  getExpandedMenuItems(tool: Tool, mode: DesignerMode) {
    /*
    TODO(menu): make API call for this combination
    if returned response, pass list into expanded menu
     */
  }

  renderButton(tool: Tool, mode: DesignerMode) {
    return <button key={tool.name} onClick={() => this.getExpandedMenuItems(tool, mode)}>{tool.name}</button>
  }

  renderLeftMenu(children: React.ReactNode[]) {
    const {mode, styles = {}} = this.props;

    let expandedMenu;
    if (this.state.expandedMenuItems.length > 0) {
      expandedMenu = <div className={classNames(styles.expandedLeftMenu)}>
        <PackageDesignerExpandedMenu mode={mode} items={this.state.expandedMenuItems} />
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
    mode: state.packaging.mode
  }
};

export default connect(mapStateToProps, {})(PackageDesignerLeftMenu);
