import React, {Component} from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import {DesignerMode} from "app/models/packaging/packaging";
import {ReduxState} from "reducers";
import PackageDesignerExpandedMenu from "./PackageDesignerExpandedMenu";
import styles from './PackageMenus.module.css';
import allToolsJson from './tools.json';
import categoriesJson from './categories.json';
import {ToolCategoryJson, ToolJson} from "app/models/packaging/tool";

interface State {
  selected: ToolCategoryJson,
  toolsJson: ToolJson[]
}

interface StateProps {
  mode: DesignerMode,
}

type Props = StateProps

/*
shows tool categories. clicking one opens the expanded menu showing the tools for that category
 */
class PackageDesignerLeftMenu extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      selected: categoriesJson[this.props.mode][0],
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

  getTools(category: ToolCategoryJson, mode: DesignerMode) {
    //this would eventually become an API call. for now we can hard code as JSON
    const toolsJson = allToolsJson[mode] && allToolsJson[mode][category.id];
    this.setState({
      toolsJson: toolsJson || []
    })
  }

  renderButton(category: ToolCategoryJson, mode: DesignerMode) {
    return <button
      key={category.name}
      onClick={() => this.getTools(category, mode)}
      className={classNames(styles.leftMenuIcon)}
    >
      {category.name}
    </button>
  }

  renderLeftMenu(children: React.ReactNode[]) {
    let expandedMenu;
    if (this.state.toolsJson.length > 0) {
      expandedMenu = <div className={classNames(styles.expandedLeftMenu)}>
        <PackageDesignerExpandedMenu toolsJson={this.state.toolsJson} />
      </div>
    }

    return <div className={classNames(styles.leftMenu)}>
      <div>
        {children}
      </div>

      {expandedMenu}
    </div>;
  }

  render() {
    return this.renderLeftMenu(
      categoriesJson[this.props.mode].map((category: ToolCategoryJson) => {
        return this.renderButton(category, this.props.mode)
      })
    );
  }
}

const mapStateToProps = (state: ReduxState) => {
  return {
    mode: state.packaging.mode,
  }
};

export default connect(mapStateToProps, {})(PackageDesignerLeftMenu);
