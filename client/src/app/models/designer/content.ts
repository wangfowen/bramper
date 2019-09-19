export enum ContentType {
  Text = "Text"
}
export interface TextJson {
  type: ContentType.Text,
  text: string
  fontFamily: string,
  fontSize: number,
  origin: {x: number, y: number}
}

export type ContentJson = TextJson

