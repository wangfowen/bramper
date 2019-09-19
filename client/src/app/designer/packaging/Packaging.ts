import {Object3D, Texture} from "three";
import {PackageSide} from "app/models/designer/packaging";
import {BackgroundMap} from "../duck/reducers";
import {CanvasCoords} from "app/models/designer/content";

export interface Packaging {
  getSides: () => PackageSide[],
  dielineSize: () => {width: number, height: number},

  drawDieline: (context: CanvasRenderingContext2D, backgroundLayers: BackgroundMap) => void,
  translateCoords: (relativeCoords: CanvasCoords, side?: PackageSide) => CanvasCoords,
  sideAtCoords: (coords: CanvasCoords) => PackageSide,

  mesh: (texture: Texture) => Object3D,
  sideMesh: (side: PackageSide, texture: Texture) => Object3D,
  dielineMesh: (texture: Texture) => Object3D
}