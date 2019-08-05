import React, {Component} from 'react';

import styles from './PackageDesigner.module.css';
import PackageDesignerTopMenu from "./PackageDesignerTopMenu";
import PackageDesignerCanvas from "./PackageDesignerCanvas";
import PackageDesignerRightMenu from "./PackageDesignerRightMenu";
import PackageDesignerLeftMenu from "./PackageDesignerLeftMenu";

class PackageDesigner extends Component {
  render() {
    return <div className={styles.designer}>
      <PackageDesignerTopMenu styles={styles} />
      <div className={styles.content}>
        <PackageDesignerLeftMenu styles={styles} />
        <PackageDesignerCanvas />
        <PackageDesignerRightMenu styles={styles} />
      </div>
    </div>
  }
}

export default PackageDesigner