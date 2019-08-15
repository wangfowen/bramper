import uuid from 'uuid/v1';
import {ColoredBackgroundProperty, GradientBackgroundProperty} from "./background";

export type CategoryId = string;
export type ToolId = string;
export type LayerId = string;

//a tool is something that can appear on a packaging
export interface ToolCategory {
  id: CategoryId,
  name: string,
  icon: string
}

//TODO(generalize): how do?
export type Property = ColoredBackgroundProperty | GradientBackgroundProperty

export enum ApplicableSurface {
  All = "All",
  Sides = "Sides",
  Tops  = "Tops"
}

//what shows up in the expanded menu
export interface ToolJson {
  id: ToolId,
  name: string,
  categoryId: CategoryId,
  image: string,
  [ApplicableSurface.All]?: Property,
  [ApplicableSurface.Sides]?: Property,
  [ApplicableSurface.Tops]?: Property
}

export interface Tool {
  id: ToolId,
  categoryId: CategoryId,
  property: Property
}

//a layer is an actual usage of the tool - has an id unique to the user and a name they can edit
export interface Layer {
  id: LayerId,
  name: string,
  tool: Tool,
  above?: LayerId,
  below?: LayerId
}

export const LayerHelper = {
  toolFromJson: (json: ToolJson, surface: ApplicableSurface): Tool => {
    return {
      id: json.id,
      categoryId: json.categoryId,
      property: json[surface] as Property
    }
  },
  newLayer: (tool: Tool): Layer => {
    return {
      id: uuid(),
      name: "Unnamed layer",
      tool: tool
    }
  }
};