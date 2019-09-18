import React, {Component} from 'react';
import { connect } from 'react-redux';

import styles from './PackageDesigner.module.css';
import EditorManager from "./scene/EditorManager";
import {ReduxState} from "reducers";
import {selectLayer} from "./duck/actions";
import {LayerData} from "app/models/layer";
import {DesignerMode, PackageSide} from "app/models/packaging";
import {Packaging} from "./packaging/Packaging";

interface OuterProps {
  drawingCanvas: () => HTMLCanvasElement | null
}

interface StateProps {
  selectedSide: PackageSide
  mode: DesignerMode
  layersVersion: number
  packaging: Packaging
}

interface DispatchProps {
  selectLayer: (layer: LayerData) => void
}

type Props = StateProps & DispatchProps & OuterProps

/*
editing interface for package side/full dieline
all the interactions the user has with the canvas and what they trigger within the editor manager
all actual logic delegated to editor manager
 */
class PackageDesignerEditor extends Component<Props> {
  private canvas: React.RefObject<HTMLDivElement>;
  private editorManager: EditorManager;

  private prevMouseY: number;
  private prevMouseX: number;
  private mouseDown: boolean;

  constructor(props) {
    super(props);
    this.canvas = React.createRef();
    this.editorManager = new EditorManager();

    this.prevMouseY = 0;
    this.prevMouseX = 0;
    this.mouseDown = false;
  }

  componentDidMount() {
    const drawingCanvas = this.props.drawingCanvas();
    if (this.canvas.current && drawingCanvas) {
      this.editorManager.init(this.props.packaging, this.canvas.current, drawingCanvas);
      this.renderLayers()
    }

    this.editorManager.enterMode(this.props.mode, this.props.selectedSide);
  }

  componentWillReceiveProps(nextProps: Props) {
    const {selectedSide, mode, layersVersion} = nextProps;
    if (mode !== this.props.mode || selectedSide !== this.props.selectedSide) {
      this.editorManager.enterMode(nextProps.mode, selectedSide)
    }

    if (layersVersion !== this.props.layersVersion) {
      this.renderLayers()
    }
  }

  componentWillUnmount() {
    this.editorManager.unmount();
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

    this.editorManager.translateCamera(mouseX - this.prevMouseX, mouseY - this.prevMouseY);

    this.prevMouseX = mouseX;
    this.prevMouseY = mouseY;
  }

  onMouseDown(event) {
    if (this.canvas.current) {
      this.mouseDown = true;
      this.prevMouseX = event.clientX;
      this.prevMouseY = event.clientY;
      const intersection = this.editorManager.getClickedLayer(event);

      /*
      if (intersection && intersection.userData && intersection.userData.id) {
        this.props.selectLayer(intersection.userData as LayerData);
      }
      */
    }
  }

  onScroll(event) {
    const z = event.deltaY || 0;
    this.editorManager.zoomCamera(z);
  }

  renderLayers() {
    this.editorManager.updateTexture();
  }

  render() {
    return <div
      className={styles.canvas}
      ref={this.canvas}
      onMouseDown={e => this.onMouseDown(e)}
      onMouseMove={e => this.onMouseMove(e)}
      onMouseUp={this.reset.bind(this)}
      onMouseOut={this.reset.bind(this)}
      onWheel={e => this.onScroll(e)}
    >
    </div>
  }
}

const mapStateToProps = (state: ReduxState): StateProps => {
  return {
    selectedSide: state.packaging.selectedSide,
    mode: state.packaging.mode,
    layersVersion: state.packaging.layersVersion,
    packaging: state.packaging.packaging
  }
};

export default connect(mapStateToProps, {selectLayer})(PackageDesignerEditor);
