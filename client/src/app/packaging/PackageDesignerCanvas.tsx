import React, {Component} from 'react';

import styles from './PackageDesigner.module.css';
import SceneManager from "./scene/SceneManager";

class PackageDesignerCanvas extends Component {
  private canvas: React.RefObject<HTMLDivElement>;
  private sceneManager: SceneManager;

  constructor(props) {
    super(props);
    this.canvas = React.createRef();
    this.sceneManager = new SceneManager();
  }

  onMouseDown(event) {
    this.sceneManager.onMouseDown(event);
  }

  componentDidMount() {
    if (this.canvas.current) {
      this.sceneManager.init(this.canvas.current)
    }
  }

  componentWillUnmount() {
    this.sceneManager.unmount();
  }

  render() {
    return <div
      className={styles.canvas}
      ref={this.canvas}
      onClick={e => this.onMouseDown(e)}
    >
    </div>
  }
}

export default PackageDesignerCanvas
