import React, {Component} from 'react';

import styles from './PackageDesigner.module.css';
import PackageDesignerCanvas from "./PackageDesignerCanvas";
import PackageDesignerTopMenu from "./menus/PackageDesignerTopMenu";
import PackageDesignerRightMenu from "./menus/PackageDesignerRightMenu";
import PackageDesignerLeftMenu from "./menus/PackageDesignerLeftMenu";

class PackageDesigner extends Component {
  render() {
    return <div className={styles.designer}>
      <PackageDesignerTopMenu />
      <div className={styles.content}>
        <PackageDesignerLeftMenu />
        <PackageDesignerCanvas />
        <PackageDesignerRightMenu />
      </div>
    </div>
  }
}

export default PackageDesigner