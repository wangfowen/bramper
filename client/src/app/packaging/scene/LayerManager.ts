import * as THREE from "three";

import {LayerMap, LayerMaps} from "../duck/reducers";
import Packaging, {MeshSide} from "./Packaging";
import {PackageSide} from "app/models/packaging";
import {Layer, LayerId} from "app/models/tools/tools";
import {
  ColoredBackgroundId, ColoredBackgroundProperty, GradientBackgroundId,
  GradientBackgroundProperty
} from "app/models/tools/background";

export const LayerManagerHelper = {
  diffMap: (newMap: LayerMap, oldMap: LayerMap): Map<LayerId, Layer> => {
    if (oldMap === undefined) {
      return newMap.map;
    }

    const newLayers: Map<LayerId, Layer> = new Map();

    newMap.map.forEach((layer) => {
      const existing = oldMap.map.get(layer.id);
      if (existing === undefined) {
        newLayers.set(layer.id, layer);
      }
    });

    return newLayers;
  },

  //TODO(generalize): how do?
  applyLayer: (sideMesh: MeshSide, layer: Layer) => {
    //right now just apply on top, but need to insert layer in between the correct layers
    if (layer.tool.id === ColoredBackgroundId) {
      const backgroundProperty = layer.tool.property as ColoredBackgroundProperty;
      const color = parseInt(backgroundProperty.color, 16);
      const material = new THREE.MeshBasicMaterial({color});
      sideMesh.mesh.material = material;

    } else if (layer.tool.id === GradientBackgroundId) {
      const backgroundProperty = layer.tool.property as GradientBackgroundProperty;
      const startColor = parseInt(backgroundProperty.startColor, 16);
      const endColor = parseInt(backgroundProperty.endColor, 16);
      const material = new THREE.ShaderMaterial({
        uniforms: {
          color1: {
            value: new THREE.Color(startColor)
          },
          color2: {
            value: new THREE.Color(endColor)
          }
        },
        vertexShader: `
          varying vec2 vUv;

          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 color1;
          uniform vec3 color2;
        
          varying vec2 vUv;
          
          void main() {
            
            gl_FragColor = vec4(mix(color1, color2, vUv.y), 1.0);
          }
        `,
      });
      sideMesh.mesh.material = material;

    }
  }
};

export default class LayerManager {
  private packaging: Packaging;
  private appliedLayers: LayerMaps;

  constructor(packaging: Packaging) {
    this.packaging = packaging;
    this.appliedLayers = {}
  }

  applyLayers(layerMaps: LayerMaps) {
    Object.keys(layerMaps).forEach((side) => {
      const packageSide = PackageSide[side];
      const layerMap: LayerMap = Object.assign({}, layerMaps[side]);

      const sideMesh = this.packaging.getSide(packageSide);
      const newLayers = LayerManagerHelper.diffMap(layerMap, this.appliedLayers[packageSide]);

      newLayers.forEach((layer) => {
        LayerManagerHelper.applyLayer(sideMesh, layer);
      });

      this.appliedLayers[packageSide] = layerMap;
    });

  }
}