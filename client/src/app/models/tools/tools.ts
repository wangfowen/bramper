export type ToolId = string;

//a property is something that can appear on a packaging
export interface Tool {
  id: ToolId,
  name: string,
  icon: string
}

//a sample is an example usage of a property, what shows up in the expanded menu
export interface Sample {
  id: string,
  name: string,
  toolId: ToolId,
  sampleImage: string,
  //
  All?: {
  },
  Side?: {
  },
  Top?: {
  }
}

//a layer is an actual usage of the sample - has an id unique to the user and a name they can edit
export interface Layer {
  id: string,
  name: string,
  toolId: ToolId
}
