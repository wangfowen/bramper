import {Object3D, Texture} from "three";
import {PackageSide} from "app/models/designer/packaging";
import {DielineCoords} from "app/models/designer/packaging";
import {BackgroundMap} from "../layers/backgrounds/BackgroundLayer";
import {SelectedLayer} from "../layers/Layer";

export interface Packaging {
  getSides: () => PackageSide[],
  dielineSize: () => {width: number, height: number},

  drawDieline: (context: CanvasRenderingContext2D, canvas: HTMLCanvasElement, backgroundLayers: BackgroundMap, selectedLayer?: SelectedLayer) => void,
  dielineCoordsFromCenter: (relativeCoords: DielineCoords, relativeSide?: PackageSide) => DielineCoords,
  sideAtCoords: (coords: DielineCoords) => PackageSide | undefined,

  mesh: (texture: Texture) => Object3D,
  sideMesh: (side: PackageSide, texture: Texture) => Object3D,
  dielineMesh: (texture: Texture) => Object3D
}