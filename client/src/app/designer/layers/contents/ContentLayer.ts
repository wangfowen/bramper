import uuid from 'uuid/v1';

import {Text} from "./Text";
import {ContentJson, ContentType} from "app/models/designer/content";
import {LayerId} from "app/models/designer/layer";
import {DielineCoords} from "app/models/designer/packaging";
import {Layer} from "../Layer";

export interface ContentLayer extends Layer {
  name: string,
  id: LayerId
}

export const ContentHelper = {
  newContent: (contentJson: ContentJson, existingId?: LayerId): ContentLayer => {
    const id = existingId || uuid();
    switch (contentJson.type) {
      case ContentType.Text:
        return Text.fromJson(contentJson, id)
    }
  },

  //TODO(click): implement
  getContentAt: (contents: ContentLayer[], coord: DielineCoords): ContentLayer | undefined => {
    return undefined
  }
};
