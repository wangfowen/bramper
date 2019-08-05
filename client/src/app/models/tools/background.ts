import {Layer, Tool} from "./tools";

export const BackgroundTool: Tool = {
  id: "1",
  name: "Background",
  icon: "TODO(menu)"
}

export interface BackgroundLayer extends Layer {
  color: string
  //need a shader? for more complex backgrounds
}
