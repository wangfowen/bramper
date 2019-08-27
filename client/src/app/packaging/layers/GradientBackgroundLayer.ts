import * as THREE from "three";

import {Layer} from "app/models/tools/tools";
import {GradientBackgroundJson, GradientBackgroundType} from "app/models/tools/background";
import {MeshSide} from "../scene/Packaging";

export class GradientBackgroundLayer implements Layer {
  public name: string;
  private startColor: number;
  private endColor: number;

  constructor(json: GradientBackgroundJson) {
    this.name = "Test";
    this.startColor = parseInt(json.startColor, 16);
    this.endColor = parseInt(json.endColor, 16);
  }

  render(side: MeshSide) {
    const material = new THREE.ShaderMaterial({
      uniforms: {
        color1: {
          value: new THREE.Color(this.startColor)
        },
        color2: {
          value: new THREE.Color(this.endColor)
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
    side.mesh.material = material;
    side.mesh.userData = this.toJson();
  }

  toJson(): GradientBackgroundJson {
    return {
      type: GradientBackgroundType,
      startColor: this.startColor.toString(16),
      endColor: this.endColor.toString(16)
    }
  }
}
