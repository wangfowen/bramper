import {ContentJson} from "./content";
import {BackgroundJson} from "./background";
import {LayerType} from "./layer";
import {DielineCoords} from "./packaging";

export type CategoryId = string;

export interface ToolCategoryJson {
  id: CategoryId,
  name: string,
  icon: string
}

export interface ContentTool {
  name: string,
  image: string,
  type: LayerType.Content,
  props: ContentJson
}

export interface BackgroundTool {
  name: string,
  image: string,
  type: LayerType.Background,
  props: BackgroundJson
}

export type ToolJson = ContentTool | BackgroundTool;
