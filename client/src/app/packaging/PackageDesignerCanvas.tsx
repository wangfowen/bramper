import React, {Component} from 'react';
import { connect } from 'react-redux';

import styles from './PackageDesigner.module.css';
import SceneManager from "./scene/SceneManager";
import {ReduxState} from "reducers";
import {PackagingState} from "./duck/reducers";
import {DesignerMode} from "app/models/packaging";

interface StateProps {
  packaging: PackagingState
}

type Props = StateProps

class PackageDesignerCanvas extends Component<Props> {
  private canvas: React.RefObject<HTMLDivElement>;
  private sceneManager: SceneManager;

  private prevMouseY: number;
  private prevMouseX: number;
  private mouseDown: boolean;

  constructor(props) {
    super(props);
    this.canvas = React.createRef();
    this.sceneManager = new SceneManager(props.packaging.mode, props.packaging.selectedSide);

    this.prevMouseY = 0;
    this.prevMouseX = 0;
    this.mouseDown = false;
  }

  reset() {
    this.mouseDown = false;
  }

  onMouseMove(event) {
    if (!this.mouseDown) {
      return
    }

    const mouseX = event.clientX;
    const mouseY = event.clientY;

    const rotateX = ( mouseX - this.prevMouseX);
    const rotateY = ( mouseY - this.prevMouseY);
    if (rotateX !== 0 || rotateY !== 0) {
      this.sceneManager.rotate(rotateX, rotateY);
    }

    this.prevMouseX = mouseX;
    this.prevMouseY = mouseY;
  }

  onMouseDown(event) {
    if (this.canvas.current) {
      if (this.props.packaging.mode === DesignerMode.Box) {
        this.mouseDown = true;
        this.prevMouseX = event.clientX;
        this.prevMouseY = event.clientY;
      }
      this.sceneManager.setColorAt(event);
    }
  }

  componentDidMount() {
    if (this.canvas.current) {
      this.sceneManager.init(this.canvas.current)
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.packaging.mode !== this.props.packaging.mode ||
        nextProps.packaging.selectedSide !== this.props.packaging.selectedSide) {
      this.sceneManager.enterMode(nextProps.packaging.mode, nextProps.packaging.selectedSide)
    }
  }

  componentWillUnmount() {
    this.sceneManager.unmount();
  }

  render() {
    return <div
      className={styles.canvas}
      ref={this.canvas}
      onMouseDown={e => this.onMouseDown(e)}
      onMouseMove={e => this.onMouseMove(e)}
      onMouseUp={this.reset.bind(this)}
      onMouseOut={this.reset.bind(this)}
    >
    </div>
  }
}

const mapStateToProps = (state: ReduxState) => {
  return {
    packaging: state.packaging
  }
};

export default connect(mapStateToProps, {})(PackageDesignerCanvas);


