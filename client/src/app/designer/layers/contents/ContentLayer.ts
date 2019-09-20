import uuid from 'uuid/v1';

import {Text} from "./Text";
import {ContentJson, ContentType} from "app/models/designer/content";
import {LayerId} from "app/models/designer/layer";
import {DielineCoords} from "app/models/designer/packaging";
import {Layer} from "../Layer";

export interface ContentLayer extends Layer {
  origin: DielineCoords,
  name: string,
  id: LayerId,
  collides: (coord: DielineCoords, context: CanvasRenderingContext2D) => boolean
}

export const ContentHelper = {
  newContent: (contentJson: ContentJson, existingId?: LayerId): ContentLayer => {
    const id = existingId || uuid();
    switch (contentJson.type) {
      case ContentType.Text:
        return Text.fromJson(contentJson, id)
    }
  },

  //top-most layer first to collide
  getContentAt: (contents: ContentLayer[], coord: DielineCoords, context: CanvasRenderingContext2D): ContentLayer | undefined => {
    for (let i = contents.length - 1; i >= 0; i--) {
      const content = contents[i];
      const collided = content.collides(coord, context);
      if (collided) {
        return content;
      }
    }

    return undefined
  }
};
