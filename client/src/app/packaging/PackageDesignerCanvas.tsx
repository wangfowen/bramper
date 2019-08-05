import React, {Component} from 'react';
import { connect } from 'react-redux';

import styles from './PackageDesigner.module.css';
import SceneManager from "./scene/SceneManager";
import {ReduxState} from "../../reducers";
import {PackagingState} from "./duck/reducers";

interface StateProps {
  packaging: PackagingState
}

type Props = StateProps

class PackageDesignerCanvas extends Component<Props> {
  private canvas: React.RefObject<HTMLDivElement>;
  private sceneManager: SceneManager;

  constructor(props) {
    super(props);
    this.canvas = React.createRef();
    this.sceneManager = new SceneManager(props.packaging.mode, props.packaging.selectedSide);
  }

  onMouseDown(event) {
    this.sceneManager.onMouseDown(event);
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
      onClick={e => this.onMouseDown(e)}
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
