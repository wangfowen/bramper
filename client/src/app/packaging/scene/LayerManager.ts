import {SideLayers} from "../duck/reducers";
import Packaging from "./Packaging";
import {PackageSide} from "app/models/packaging";
import {Layer} from "app/models/tools/tools";

export default class LayerManager {
  private packaging: Packaging;

  constructor(packaging: Packaging) {
    this.packaging = packaging;
  }

  applyLayers(sideLayers: SideLayers) {
    Object.keys(sideLayers).forEach((side) => {
      const packageSide = PackageSide[side];
      const layers: Layer[] = sideLayers[side];

      const sideMesh = this.packaging.getSide(packageSide);
      layers.forEach((layer) => {
        layer.render(sideMesh);
      });
    });
  }
}