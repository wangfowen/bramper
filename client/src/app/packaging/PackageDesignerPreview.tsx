import React, {Component} from 'react';
import { connect } from 'react-redux';

import styles from './PackageDesigner.module.css';
import PreviewManager from "./scene/PreviewManager";
import {ReduxState} from "reducers";
import {selectLayer} from "./duck/actions";
import {LayerData} from "app/models/layer";
import {Packaging} from "./packaging/Packaging";

interface OuterProps {
  drawingCanvas: () => HTMLCanvasElement | null
}

interface StateProps {
  layersVersion: number,
  packaging: Packaging
}

interface DispatchProps {
  selectLayer: (layer: LayerData) => void
}

type Props = StateProps & DispatchProps & OuterProps

/*
preview of 3D package
all the interactions the user has with the canvas and what they trigger within the preview manager
all actual logic delegated to preview manager
 */
class PackageDesignerPreview extends Component<Props> {
  private canvas: React.RefObject<HTMLDivElement>;
  private previewManager: PreviewManager;

  private prevMouseY: number;
  private prevMouseX: number;
  private mouseDown: boolean;

  constructor(props) {
    super(props);
    this.canvas = React.createRef();
    this.previewManager = new PreviewManager();

    this.prevMouseY = 0;
    this.prevMouseX = 0;
    this.mouseDown = false;
  }

  componentDidMount() {
    const drawingCanvas = this.props.drawingCanvas();
    if (this.canvas.current && drawingCanvas) {
      this.previewManager.init(this.props.packaging, this.canvas.current, drawingCanvas);
    }
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
    if (this.canvas.current) {
      this.mouseDown = true;
      this.prevMouseX = event.clientX;
      this.prevMouseY = event.clientY;
    }
  }

  renderLayers() {
    this.previewManager.updateTexture();
  }

  render() {
    return <div
      className={styles.preview}
      ref={this.canvas}
      onMouseDown={e => this.onMouseDown(e)}
      onMouseMove={e => this.onMouseMove(e)}
      onMouseUp={this.reset.bind(this)}
      onMouseOut={this.reset.bind(this)}
    >
    </div>
  }
}

const mapStateToProps = (state: ReduxState): StateProps => {
  return {
    packaging: state.packaging.packaging,
    layersVersion: state.packaging.layersVersion
  }
};

export default connect(mapStateToProps, {selectLayer})(PackageDesignerPreview);


