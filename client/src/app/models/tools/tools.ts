import {ColoredBackgroundJson, GradientBackgroundJson} from "./background";

export type CategoryId = string;
export type LayerId = string;

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

export interface ToolJson {
  name: string,
  image: string,
  [ApplicableSurface.All]?: LayerJson,
  [ApplicableSurface.Sides]?: LayerJson,
  [ApplicableSurface.Tops]?: LayerJson
}

export interface LayerData {
  id: LayerId,
  json: LayerJson
}
