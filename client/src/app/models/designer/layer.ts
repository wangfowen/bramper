import {ContentJson} from "./content";
import {PackageSide} from "./packaging";
import {BackgroundJson} from "./background";

export type LayerId = string;

export enum LayerType {
  Content = "Content",
  Background = "Background"
}

export type SelectedLayer = {
  id: LayerId | PackageSide,
  type: LayerType,
  json: ContentJson | BackgroundJson
}
