import React, {Component} from 'react';
import { connect } from 'react-redux';

import styles from './PackageDesigner.module.css';
import PackageDesignerEditor from "./PackageDesignerEditor";
import PackageDesignerTopMenu from "./menus/PackageDesignerTopMenu";
import PackageDesignerRightMenu from "./menus/PackageDesignerRightMenu";
import PackageDesignerLeftMenu from "./menus/PackageDesignerLeftMenu";
import PackageDesignerPreview from "./PackageDesignerPreview";
import {ContentLayer} from "./layers/contents/ContentLayer";
import {ReduxState} from "reducers";
import {renderContent} from "./duck/actions";
import {Packaging} from "./packaging/Packaging";
import {BackgroundMap} from "./layers/backgrounds/BackgroundLayer";

interface StateProps {
  contentLayers: ContentLayer[]
  backgroundLayers: BackgroundMap,
  packaging: Packaging
}

interface DispatchProps {
  renderContent: () => void
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

      this.drawLayers(this.props.contentLayers, this.props.backgroundLayers);
      this.props.renderContent();
    }
  }

  componentWillReceiveProps(nextProps: StateProps) {
    if (nextProps.contentLayers !== this.props.contentLayers ||
        nextProps.backgroundLayers !== this.props.backgroundLayers) {
      this.drawLayers(nextProps.contentLayers, nextProps.backgroundLayers);
      this.props.renderContent();
    }
  }

  drawLayers(contentLayers: ContentLayer[], backgroundLayers: BackgroundMap) {
    const canvas = this.drawingCanvas.current;
    if (canvas !== null) {
      const context = canvas.getContext("2d");

      if (context !== null) {
        context.clearRect(0, 0, canvas.width, canvas.height);

        this.props.packaging.drawDieline(context, canvas, backgroundLayers);

        contentLayers.forEach((layer) => {
          layer.draw(context, canvas)
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
    contentLayers: state.designer.contentLayers,
    backgroundLayers: state.designer.backgroundLayers,
    packaging: state.designer.packaging
  }
};

export default connect(mapStateToProps, {renderContent})(PackageDesigner);
