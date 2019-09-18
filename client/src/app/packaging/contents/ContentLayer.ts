import uuid from 'uuid/v1';

import {Text} from "./Text";
import {CanvasCoords, ContentJson, ContentType} from "app/models/packaging/content";
import {LayerId, LayerType} from "app/models/packaging/layer";


export interface ContentLayer {
  type: LayerType.Content,
  name: string,
  id: LayerId,
  draw: (context: CanvasRenderingContext2D) => void,
  toJson: () => ContentJson,
  editForm: () => React.ReactNode
}

export const ContentHelper = {
  newContent: (contentJson: ContentJson): ContentLayer => {
    const id = uuid();
    switch (contentJson.type) {
      case ContentType.Text:
        return Text.fromJson(contentJson, id)
    }
  },

  //TODO(click): implement
  getContentAt: (contents: ContentLayer[], coord: CanvasCoords): ContentLayer | undefined => {
    return undefined
  }
};
