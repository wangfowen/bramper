import {Object3D, Texture} from "three";
import {PackageSide} from "app/models/packaging";
import {BackgroundMap} from "../duck/reducers";
import {CanvasCoords} from "app/models/layer";

export interface Packaging {
  getSides: () => PackageSide[],
  dielineSize: () => {width: number, height: number},

  drawDieline: (context: CanvasRenderingContext2D, backgrounds: BackgroundMap) => void,
  translateCoords: (coords: CanvasCoords, side?: PackageSide) => CanvasCoords,

  mesh: (texture: Texture) => Object3D,
  sideMesh: (side: PackageSide, texture: Texture) => Object3D,
  dielineMesh: (texture: Texture) => Object3D
}