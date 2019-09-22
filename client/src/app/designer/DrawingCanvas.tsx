import React, {Component} from 'react';
import { connect } from 'react-redux';

import {Packaging} from "./packaging/Packaging";
import {BackgroundMap} from "./layers/backgrounds/BackgroundLayer";
import {ContentLayer} from "./layers/contents/ContentLayer";
import {ReduxState} from "../../reducers";
import {renderContent} from "./duck/actions";
import {SelectedLayer} from "./layers/Layer";
import {LayerType} from "../models/designer/layer";

interface StateProps {
  contentLayers: ContentLayer[]
  backgroundLayers: BackgroundMap,
  packaging: Packaging
  selectedLayer: SelectedLayer | undefined
}

interface DispatchProps {
  renderContent: () => void
}

interface OuterProps {
  editingMode: boolean
  onCanvasMount: (canvas: HTMLCanvasElement) => void
}

type Props = StateProps & DispatchProps & OuterProps

class DrawingCanvas extends Component<Props> {
  private canvas?: HTMLCanvasElement;

  setCanvas = (canvas: HTMLCanvasElement) => {
    this.canvas = canvas;

    const dimensions = this.props.packaging.dielineSize();
    this.canvas.height = dimensions.height;
    this.canvas.width = dimensions.width;

    this.props.onCanvasMount(canvas);

    this.drawLayers(this.props);
    this.props.renderContent();
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.contentLayers !== this.props.contentLayers ||
      nextProps.backgroundLayers !== this.props.backgroundLayers ||
      nextProps.selectedLayer !== this.props.selectedLayer) {
      this.drawLayers(nextProps);
      this.props.renderContent();
    }
  }

  drawLayers(props: Props) {
    const {backgroundLayers, contentLayers, selectedLayer, editingMode, packaging} = props;

    const canvas = this.canvas;
    if (canvas !== undefined) {
      const context = canvas.getContext("2d");

      if (context !== null) {
        context.clearRect(0, 0, canvas.width, canvas.height);

        if (editingMode && selectedLayer !== undefined && selectedLayer.type === LayerType.Background) {
          packaging.drawDieline(context, canvas, backgroundLayers, selectedLayer)
        } else {
          packaging.drawDieline(context, canvas, backgroundLayers);
        }

        contentLayers.forEach((layer) => {
          if (editingMode && selectedLayer !== undefined && selectedLayer.id === layer.id) {
            layer.draw(context, canvas, true)
          } else {
            layer.draw(context, canvas)
          }
        })
      }
    }
  }

  render() {
    return <canvas style={{display: "none"}} ref={this.setCanvas}></canvas>
  }
}

const mapStateToProps = (state: ReduxState) => {
  return {
    selectedLayer: state.designer.selectedLayer,
    contentLayers: state.designer.contentLayers,
    backgroundLayers: state.designer.backgroundLayers,
    packaging: state.designer.packaging
  }
};

export default connect(mapStateToProps, {renderContent})(DrawingCanvas);
