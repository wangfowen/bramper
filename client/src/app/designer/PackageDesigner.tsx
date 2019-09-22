import React, {Component} from 'react';

import styles from './PackageDesigner.module.css';
import PackageDesignerEditor from "./PackageDesignerEditor";
import PackageDesignerTopMenu from "./menus/PackageDesignerTopMenu";
import PackageDesignerRightMenu from "./menus/PackageDesignerRightMenu";
import PackageDesignerLeftMenu from "./menus/PackageDesignerLeftMenu";
import PackageDesignerPreview from "./PackageDesignerPreview";

export default class PackageDesigner extends Component {
  render() {
    return <div className={styles.designer}>
      <PackageDesignerTopMenu />
      <div className={styles.content}>
        <PackageDesignerLeftMenu />
        <PackageDesignerPreview />
        <PackageDesignerEditor />
        <PackageDesignerRightMenu />
      </div>
    </div>
  }
}

