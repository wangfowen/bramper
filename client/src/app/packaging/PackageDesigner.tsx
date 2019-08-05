import React, {Component} from 'react';

import styles from './PackageDesigner.module.css';
import PackageDesignerTopMenu from "./PackageDesignerTopMenu";
import PackageDesignerCanvas from "./PackageDesignerCanvas";
import PackageDesignerRightMenu from "./PackageDesignerRightMenu";
import PackageDesignerLeftMenu from "./PackageDesignerLeftMenu";

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