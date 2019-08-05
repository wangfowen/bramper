import React, {Component} from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import {ReduxState} from "reducers";
import {Layer} from "app/models/tools/tools";
import styles from './PackageDesigner.module.css';

interface StateProps {
  layer: Layer | null
}

class PackageDesignerRightMenu extends Component<StateProps> {
  render() {
    const {layer} = this.props;
    if (layer !== null) {
      //TODO(menu): based on selected layer, select form + populate with selected layer
      return <div className={classNames(styles.rightMenu)}>
        Right Menu
      </div>
    } else {
      return null
    }
  }
}

const mapStateToProps = (state: ReduxState) => {
  return {
    layer: state.packaging.selectedLayer
  }
};

export default connect(mapStateToProps, {})(PackageDesignerRightMenu);
