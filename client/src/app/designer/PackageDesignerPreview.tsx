import React, {Component} from 'react';
import { connect } from 'react-redux';

import styles from './PackageDesigner.module.css';
import PreviewManager from "./scene/PreviewManager";
import {ReduxState} from "reducers";
import {Packaging} from "./packaging/Packaging";
import DrawingCanvas from "./DrawingCanvas";

interface StateProps {
  layersVersion: number,
  packaging: Packaging
}

type Props = StateProps

/*
preview of 3D package
all the interactions the user has with the viewingCanvas and what they trigger within the preview manager
all actual logic delegated to preview manager
 */
class PackageDesignerPreview extends Component<Props> {
  private drawingCanvas?: HTMLCanvasElement;
  private viewingCanvas?: HTMLDivElement;
  private previewManager: PreviewManager;

  private prevMouseY: number;
  private prevMouseX: number;
  private mouseDown: boolean;

  constructor(props) {
    super(props);
    this.previewManager = new PreviewManager();

    this.prevMouseY = 0;
    this.prevMouseX = 0;
    this.mouseDown = false;
  }

  initPreview = () => {
    if (this.viewingCanvas && this.drawingCanvas) {
      this.previewManager.init(this.props.packaging, this.viewingCanvas, this.drawingCanvas);
    }
  }

  setViewingCanvas = (canvas: HTMLDivElement) => {
    this.viewingCanvas = canvas;
    this.initPreview();
  }

  setDrawingCanvas = (canvas: HTMLCanvasElement) => {
    this.drawingCanvas = canvas;
    this.initPreview();
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.layersVersion !== this.props.layersVersion) {
      this.renderLayers()
    }
  }

  componentWillUnmount() {
    this.previewManager.unmount();
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
      this.previewManager.rotateCamera(rotateX, rotateY);
    }

    this.prevMouseX = mouseX;
    this.prevMouseY = mouseY;
  }

  onMouseDown(event) {
    if (this.viewingCanvas) {
      this.mouseDown = true;
      this.prevMouseX = event.clientX;
      this.prevMouseY = event.clientY;
    }
  }

  renderLayers() {
    this.previewManager.updateTexture();
  }

  render() {
    return <>
      <div
        className={styles.preview}
        ref={this.setViewingCanvas}
        onMouseDown={e => this.onMouseDown(e)}
        onMouseMove={e => this.onMouseMove(e)}
        onMouseUp={this.reset.bind(this)}
        onMouseOut={this.reset.bind(this)}
      ></div>
      <DrawingCanvas editingMode={false} onCanvasMount={this.setDrawingCanvas} />
    </>
  }
}

const mapStateToProps = (state: ReduxState): StateProps => {
  return {
    packaging: state.designer.packaging,
    layersVersion: state.designer.layersVersion
  }
};

export default connect(mapStateToProps, {})(PackageDesignerPreview);


