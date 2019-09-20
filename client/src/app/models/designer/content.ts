export enum ContentType {
  Text = "Text"
}

interface IContentJson {
  name: string,
  origin: {x: number, y: number}
}

export interface TextJson extends IContentJson {
  type: ContentType.Text,
  text: string
  fontFamily: string,
  fontSize: number,
}

export type ContentJson = TextJson

