import React, {Component} from 'react';
import { connect } from 'react-redux';

import styles from './PackageDesigner.module.css';
import EditorManager from "./scene/EditorManager";
import {ReduxState} from "reducers";
import {selectLayer} from "./duck/actions";
import {LayerType} from "app/models/designer/layer";
import {DesignerMode, FullDieline, PackageSide} from "app/models/designer/packaging";
import {Packaging} from "./packaging/Packaging";
import {ContentHelper, ContentLayer} from "./layers/contents/ContentLayer";
import {BackgroundLayer, BackgroundMap} from "./layers/backgrounds/BackgroundLayer";
import {SelectedLayer} from "./layers/Layer";

interface OuterProps {
  drawingCanvas: () => HTMLCanvasElement | null
}

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
    const drawingCanvas = this.props.drawingCanvas();
    const context = drawingCanvas && drawingCanvas.getContext("2d");
    if (this.canvas.current && context) {
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
          let layer: BackgroundLayer | undefined;

          const sideAtIntersection = this.props.packaging.sideAtCoords(absIntersection);
          if (sideAtIntersection) {
            layer = this.props.backgroundLayers[sideAtIntersection];
            if (layer !== undefined) {
              this.props.selectLayer({
                id: sideAtIntersection,
                type: LayerType.Background,
                layer: layer
              })
            }
          }

          if (layer === undefined && this.props.backgroundLayers[FullDieline]) {
            this.props.selectLayer({
              id: FullDieline,
              type: LayerType.Background,
              layer: this.props.backgroundLayers[FullDieline]
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
    selectedSide: state.designer.selectedSide,
    mode: state.designer.mode,
    layersVersion: state.designer.layersVersion,
    packaging: state.designer.packaging,
    contentLayers: state.designer.contentLayers,
    backgroundLayers: state.designer.backgroundLayers
  }
};

export default connect(mapStateToProps, {selectLayer})(PackageDesignerEditor);
