import React, {Component} from 'react';
import { connect } from 'react-redux';

import styles from './PackageDesigner.module.css';
import EditorManager from "./scene/EditorManager";
import {ReduxState} from "reducers";
import {selectLayer} from "./duck/actions";
import {LayerType} from "app/models/designer/layer";
import {DesignerMode, PackageSide} from "app/models/designer/packaging";
import {Packaging} from "./packaging/Packaging";
import {ContentHelper, ContentLayer} from "./layers/contents/ContentLayer";
import {BackgroundHelper, BackgroundMap} from "./layers/backgrounds/BackgroundLayer";
import {SelectedLayer} from "./layers/Layer";
import DrawingCanvas from "./DrawingCanvas";

interface StateProps {
  selectedSide: PackageSide,
  mode: DesignerMode,
  layersVersion: number,
  packaging: Packaging,
  contentLayers: ContentLayer[],
  backgroundLayers: BackgroundMap
}

interface DispatchProps {
  selectLayer: (layer: SelectedLayer) => void
}

type Props = StateProps & DispatchProps

/*
editing interface for package side/full dieline
all the interactions the user has with the canvas and what they trigger within the editor manager
all actual logic delegated to editor manager
 */
class PackageDesignerEditor extends Component<Props> {
  private editingCanvas?: HTMLDivElement;
  private drawingCanvas?: HTMLCanvasElement;
  private editorManager: EditorManager;

  private prevMouseY: number;
  private prevMouseX: number;
  private mouseDown: boolean;

  constructor(props) {
    super(props);
    this.editorManager = new EditorManager();

    this.prevMouseY = 0;
    this.prevMouseX = 0;
    this.mouseDown = false;
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

  initEditor = () => {
    if (this.editingCanvas && this.drawingCanvas) {
      this.editorManager.init(this.props.packaging, this.editingCanvas, this.drawingCanvas);
      this.renderLayers();

      this.editorManager.enterMode(this.props.mode, this.props.selectedSide);
    }
  }

  setEditingCanvas = (canvas: HTMLDivElement) => {
    this.editingCanvas = canvas;
    this.initEditor();
  }

  setDrawingCanvas = (canvas: HTMLCanvasElement) => {
    this.drawingCanvas = canvas;
    this.initEditor();
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
    const context = this.drawingCanvas !== undefined && this.drawingCanvas.getContext("2d");
    if (this.editingCanvas && context) {
      this.mouseDown = true;
      this.prevMouseX = event.clientX;
      this.prevMouseY = event.clientY;
      const intersection = this.editorManager.getClickedPoint(event);

      if (intersection !== null) {
        const relativeSide = this.props.mode === DesignerMode.Side ? this.props.selectedSide : undefined;
        const absIntersection = this.props.packaging.dielineCoordsFromCenter({x: intersection.x, y: intersection.y}, relativeSide);

        const contentLayer = ContentHelper.getContentAt(this.props.contentLayers, absIntersection, context);
        if (contentLayer !== undefined) {
          this.props.selectLayer({
            id: contentLayer.id,
            type: LayerType.Content,
            layer: contentLayer
          })
        } else {
          const backgroundLayerInfo = BackgroundHelper.getBackgroundAt(this.props.backgroundLayers, absIntersection, this.props.packaging);
          if (backgroundLayerInfo !== undefined) {
            this.props.selectLayer({
              id: backgroundLayerInfo.side,
              type: LayerType.Background,
              layer: backgroundLayerInfo.layer
            })
          }
        }
      }
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
    return <>
      <DrawingCanvas editingMode={true} onCanvasMount={this.setDrawingCanvas} />
      <div
        className={styles.canvas}
        ref={this.setEditingCanvas}
        onMouseDown={e => this.onMouseDown(e)}
        onMouseMove={e => this.onMouseMove(e)}
        onMouseUp={this.reset.bind(this)}
        onMouseOut={this.reset.bind(this)}
        onWheel={e => this.onScroll(e)}
      ></div>
    </>
  }
}

const mapStateToProps = (state: ReduxState): StateProps => {
  return {
    selectedSide: state.designer.selectedSide,
    mode: state.designer.mode,
    layersVersion: state.designer.layersVersion,
    packaging: state.designer.packaging,
    contentLayers: state.designer.contentLayers,
    backgroundLayers: state.designer.backgroundLayers
  }
};

export default connect(mapStateToProps, {selectLayer})(PackageDesignerEditor);
