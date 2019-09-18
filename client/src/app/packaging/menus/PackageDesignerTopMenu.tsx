import React, {Component} from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import {DesignerMode, PackageSide} from "app/models/packaging";
import {ReduxState} from "reducers";
import {setMode, setSide} from "../duck/actions";
import {PackagingState} from "../duck/reducers";
import styles from './PackageMenus.module.css';

interface StateProps {
  packaging: PackagingState
}

interface DispatchProps {
  setMode: (mode: DesignerMode) => void
  setSide: (side: PackageSide) => void
}

/*
toggle between the modes, and if on side mode, toggle between the sides
 */
class PackageDesignerTopMenu extends Component<StateProps & DispatchProps> {
  className(mode: DesignerMode) {
    return classNames("nav-link", this.props.packaging.mode === mode ? "active" : "", styles.navItem)
  }

  renderNavFor(mode: DesignerMode) {
    return <li className="nav-item">
      <button className={this.className(mode)} onClick={() => this.props.setMode(mode)}>{mode}</button>
    </li>
  }

  renderOptionFor(side: PackageSide) {
    return <option value={side} key={side}>
      {side}
    </option>
  }

  renderSubMenu() {
    const {mode, selectedSide, packaging} = this.props.packaging;
    if (mode !== DesignerMode.Side) {
      return null
    } else {
      return <div className={styles.sideSelectorMenu}>
        <span className={styles.sideMenuText}>Selected Side:</span>
        <select className={classNames(styles.sideSelector, "form-control")} value={selectedSide} onChange={(e) => this.props.setSide(e.target.value)}>
          {packaging.getSides().map((side) => this.renderOptionFor(side))}
        </select>
      </div>
    }
  }

  render() {
    return <div>
      <ul className={classNames("nav nav-pills", styles.nav)}>
        {this.renderNavFor(DesignerMode.Side)}
        {this.renderNavFor(DesignerMode.Full)}
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
