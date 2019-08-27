import React, {Component} from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import {ReduxState} from "reducers";
import styles from './PackageMenus.module.css';
import {Layer} from "../layers/Layer";

interface StateProps {
  layer: Layer | null
}

/*
if a layer is selected, its editable properties show up here. editing them triggers update layer
 */
class PackageDesignerRightMenu extends Component<StateProps> {
  render() {
    const {layer} = this.props;
    if (layer !== null) {
      //TODO(menu): on save, trigger update with id + new json values
      return <div className={classNames(styles.rightMenu)}>
        {layer.editForm()}
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
