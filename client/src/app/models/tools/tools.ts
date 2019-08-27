import {ColoredBackgroundJson, GradientBackgroundJson} from "./background";
import {MeshSide} from "../../packaging/scene/Packaging";

export type CategoryId = string;
export type ToolId = string;

//a tool is something that can appear on a packaging
export interface ToolCategory {
  id: CategoryId,
  name: string,
  icon: string
}

export type LayerJson = ColoredBackgroundJson | GradientBackgroundJson

export enum ApplicableSurface {
  All = "All",
  Sides = "Sides",
  Tops  = "Tops"
}

//what shows up in the expanded menu
export interface ToolJson {
  id: ToolId,
  name: string,
  image: string,
  [ApplicableSurface.All]?: LayerJson,
  [ApplicableSurface.Sides]?: LayerJson,
  [ApplicableSurface.Tops]?: LayerJson
}

export interface Tool {
  id: ToolId,
  layerJson: LayerJson
}

export interface Layer {
  name: string,
  render: (side: MeshSide) => void,
  toJson: () => LayerJson
}

