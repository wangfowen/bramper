import React, {Component} from 'react';

import {DesignerMode, PackageSide} from "app/models/packaging";
import {Sample} from "app/models/tools/tools";
import styles from './PackageDesigner.module.css';

interface OuterProps {
  selectedSide: PackageSide,
  mode: DesignerMode,
  samples: Sample[]
}

class PackageDesignerExpandedMenu extends Component<OuterProps> {
  selectedIsTop() {
    const {selectedSide} = this.props;
    return selectedSide === PackageSide.Top || selectedSide === PackageSide.Bottom;
  }

  applySample(sample: Sample) {
    const {mode} = this.props;
    if (mode === DesignerMode.Box) {
      if (sample.All !== undefined) {
        console.log(`applying to all: ${JSON.stringify(sample.All)}`);
      }
      //could have some combination of all of them for box mode samples
      if (sample.Top !== undefined) {
        console.log(`applying to tops: ${sample.Top}`);
      }
      if (sample.Side !== undefined) {
        console.log(`applying to sides: ${sample.Side}`);
      }
    } else if (mode === DesignerMode.Side) {
      if (sample.All !== undefined) {
        console.log(`applying: ${JSON.stringify(sample.All)}`);
        return
      }

      //could only apply top or side for the one
      if (this.selectedIsTop()) {
        console.log(`applying to top: ${sample.Top}`);
      } else {
        console.log(`applying to side: ${sample.Side}`);
      }
    }
  }

  render() {
    const {samples, mode} = this.props;

    //does this sample work for the side we're looking at
    const applicableSamples = mode !== DesignerMode.Side ? samples : samples.filter((sample) => {
      if (sample.All !== undefined) {
        return true;
      }

      if (this.selectedIsTop()) {
        return sample.Top !== undefined
      } else {
        return sample.Side !== undefined
      }
    });

    if (applicableSamples.length > 0) {
      return applicableSamples.map((sample) => {
        return <div className={styles.sampleItem} key={sample.id} onClick={() => this.applySample(sample)}>
          <div>{sample.name}</div>
          <div>{sample.sampleImage}</div>
        </div>

      })
    } else {
      return null
    }
  }
}

export default PackageDesignerExpandedMenu