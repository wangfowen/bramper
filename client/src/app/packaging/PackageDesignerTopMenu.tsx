import React, {Component} from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import {DesignerMode, PackageSide} from "app/models/packaging";
import {ReduxState} from "reducers";
import {setMode, setSide} from "./duck/actions";
import {PackagingState} from "./duck/reducers";
import styles from './PackageDesigner.module.css';

interface CustomStyles {
  nav?: string,
  navItem?: string
}

interface OuterProps {
  styles?: CustomStyles
}

interface StateProps {
  packaging: PackagingState
}

interface DispatchProps {
  setMode: (mode: DesignerMode) => void
  setSide: (side: PackageSide) => void
}

class PackageDesignerTopMenu extends Component<StateProps & DispatchProps & OuterProps> {
  className(mode: DesignerMode) {
    return classNames("nav-link", this.props.packaging.mode === mode ? "active" : "", this.props.styles && this.props.styles.navItem)
  }

  renderNavFor(mode: DesignerMode) {
    return <li className="nav-item">
      <button className={this.className(mode)} onClick={() => this.props.setMode(mode)}>{mode}</button>
    </li>
  }

  renderOptionFor(side: PackageSide) {
    return <option value={side}>
      {side}
    </option>
  }

  renderSubMenu() {
    const {mode, selectedSide} = this.props.packaging;
    if (mode !== DesignerMode.Side) {
      return null
    } else {
      return <div className={styles.sideSelectorMenu}>
        Selected Side:
        <select className={classNames(styles.sideSelector, "form-control")} value={selectedSide} onChange={(e) => this.props.setSide(PackageSide[e.target.value])}>
          {this.renderOptionFor(PackageSide.Front)}
          {this.renderOptionFor(PackageSide.Back)}
          {this.renderOptionFor(PackageSide.Left)}
          {this.renderOptionFor(PackageSide.Right)}
          {this.renderOptionFor(PackageSide.Top)}
          {this.renderOptionFor(PackageSide.Bottom)}
        </select>
      </div>
    }
  }

  render() {
    return <div>
      <ul className={classNames("nav nav-pills", this.props.styles && this.props.styles.nav)}>
        {this.renderNavFor(DesignerMode.Box)}
        {this.renderNavFor(DesignerMode.Side)}
        {this.renderNavFor(DesignerMode.Flat)}
      </ul>
      {this.renderSubMenu()}
    </div>
  }
}

const mapStateToProps = (state: ReduxState) => {
  return {
    packaging: state.packaging
  }
};

export default connect(mapStateToProps, {setMode, setSide})(PackageDesignerTopMenu);
