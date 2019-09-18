import React, {Component} from 'react';
import { connect } from 'react-redux';

import styles from './PackageDesigner.module.css';
import PackageDesignerEditor from "./PackageDesignerEditor";
import PackageDesignerTopMenu from "./menus/PackageDesignerTopMenu";
import PackageDesignerRightMenu from "./menus/PackageDesignerRightMenu";
import PackageDesignerLeftMenu from "./menus/PackageDesignerLeftMenu";
import PackageDesignerPreview from "./PackageDesignerPreview";
import {Layer} from "./layers/Layer";
import {ReduxState} from "reducers";
import {renderLayers} from "./duck/actions";
import {Packaging} from "./packaging/Packaging";
import {BackgroundMap} from "./duck/reducers";

interface StateProps {
  layers: Layer[]
  backgrounds: BackgroundMap,
  packaging: Packaging
}

interface DispatchProps {
  renderLayers: () => void
}

/*
TODO(improve): this doesn't seem like the right place to handle drawing the layers...
 */
class PackageDesigner extends Component<StateProps & DispatchProps> {
  private drawingCanvas: React.RefObject<HTMLCanvasElement>;
  private debug: boolean;

  constructor(props) {
    super(props);
    this.drawingCanvas = React.createRef();
    this.debug = false;
  }

  componentDidMount() {
    const canvas = this.drawingCanvas.current;
    if (canvas !== null) {
      const dimensions = this.props.packaging.dielineSize();
      canvas.height = dimensions.height;
      canvas.width = dimensions.width;

      this.drawLayers(this.props.layers, this.props.backgrounds);
      this.props.renderLayers();
    }
  }

  componentWillReceiveProps(nextProps: StateProps) {
    if (nextProps.layers !== this.props.layers ||
        nextProps.backgrounds !== this.props.backgrounds) {
      this.drawLayers(nextProps.layers, nextProps.backgrounds);
      this.props.renderLayers();
    }
  }

  drawLayers(layers: Layer[], backgrounds: BackgroundMap) {
    const canvas = this.drawingCanvas.current;
    if (canvas !== null) {
      const context = canvas.getContext("2d");

      if (context !== null) {
        context.clearRect(0, 0, canvas.width, canvas.height);

        this.props.packaging.drawDieline(context, backgrounds);

        layers.forEach((layer) => {
          layer.draw(context)
        })
      }
    }
  }

  getDrawingCanvas(): HTMLCanvasElement | null {
    return this.drawingCanvas.current;
  }

  render() {
    return <div className={styles.designer}>
      <PackageDesignerTopMenu />
      <div className={styles.content}>
        <PackageDesignerLeftMenu />
        <canvas style={{display: this.debug ? "" : "none"}} ref={this.drawingCanvas}></canvas>
        {
          this.debug ? null :
          <>
            <PackageDesignerPreview drawingCanvas={() => this.getDrawingCanvas()} />
            <PackageDesignerEditor drawingCanvas={() => this.getDrawingCanvas()} />
          </>
        }
        <PackageDesignerRightMenu />
      </div>
    </div>
  }
}

const mapStateToProps = (state: ReduxState) => {
  return {
    layers: state.packaging.layers,
    backgrounds: state.packaging.backgrounds,
    packaging: state.packaging.packaging
  }
};

export default connect(mapStateToProps, {renderLayers})(PackageDesigner);
