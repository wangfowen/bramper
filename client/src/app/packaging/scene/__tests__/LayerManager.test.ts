import {LayerMap} from "app/packaging/duck/reducers";
import {LayerManagerHelper} from "../LayerManager";

const newLayer = (id: string) => {
  return {
    id,
    name: "test",
    tool: {
      id: "1",
      categoryId: "1"
    }
  }
};

describe('diffMap', () => {
  const layer1 = newLayer("1");
  const oldMap: LayerMap = {
    bottom: "1",
    top: "1",
    map: new Map([["1", layer1]])
  };

  it('returns new if no old', () => {
    expect(LayerManagerHelper.diffMap(oldMap, undefined)).toEqual(new Map([["1", layer1]]))
  });

  it('diffs as expected', () => {
    const layer2 = newLayer("2");

    const newMap: LayerMap = {
      bottom: "1",
      top: "2",
      map: new Map([["2", layer2], ["1", layer1]])
    };

    expect(LayerManagerHelper.diffMap(newMap, oldMap)).toEqual(new Map([["2", layer2]]))
  });
});
