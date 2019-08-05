export enum DesignerMode {
  Side = "Side",
  Box = "Box",
  Flat = "Flat"
}

export enum PackageSide {
  Front = "Front",
  Back = "Back",
  Left = "Left",
  Right = "Right",
  Top = "Top",
  Bottom = "Bottom"
}

export interface Tool {
  name: string,
  icon: string
}

export const BackgroundTool: Tool = {
  name: "Background",
  icon: "TODO(menu)"
}

export interface Layer {
  id: string,
}

export interface Background extends Layer {
}
