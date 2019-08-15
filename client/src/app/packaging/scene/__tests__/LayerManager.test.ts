import {LayerMap, LayersStruct} from "app/packaging/duck/reducers";
import {LayerManagerHelper} from "../LayerManager";

const newLayer = (id: string) => {
  return {
    id,
    name: "test",
    tool: {
      id: "1",
      categoryId: "1",
      property: {
        color: "0xffffff"
      }
    }
  }
};

describe('diffMap', () => {
  const layer1 = newLayer("a");
  const oldMap: LayersStruct = {
    bottom: "a",
    top: "a",
    map: {a: layer1}
  };

  it('returns new if no old', () => {
    expect(LayerManagerHelper.diffMap(oldMap, undefined)).toEqual({a: layer1})
  });

  it('diffs as expected', () => {
    const layer2 = newLayer("b");

    const newMap: LayersStruct = {
      bottom: "a",
      top: "b",
      map: {b: layer2, a: layer1}
    };

    expect(LayerManagerHelper.diffMap(newMap, oldMap)).toEqual({b: layer2})
  });
});
