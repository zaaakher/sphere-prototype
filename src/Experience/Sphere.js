import * as THREE from "three";
import Experience from "./Experience";
import vertexShader from "./shaders/sphere/vertex.glsl";
import fragmentShader from "./shaders/sphere/fragment.glsl";

export default class Sphere {
  constructor() {
    this.experience = new Experience();
    this.debug = this.experience.debug;
    this.scene = this.experience.scene;
    this.time = this.experience.time;

    this.timeFrequency = 0.0003;
    this.elapsedTime = 0;

    if (this.debug) {
      this.debugFolder = this.debug.addFolder({
        title: "sphere",
        expanded: true,
      });

      this.debugFolder.addInput(this, "timeFrequency", {
        min: 0,
        max: 0.001,
        step: 0.000001,
      });
    }

    this.setVariations();
    this.setGeometry();
    this.setLights();
    this.setOffset();
    this.setMaterial();
    this.setMesh();
  }

  setVariations() {
    this.variations = {};

    this.variations.volume = {};
    this.variations.volume.target = 0;
    this.variations.volume.current = 0;
    this.variations.volume.upEasing = 0.03;
    this.variations.volume.downEasing = 0.002;

    this.variations.volume.getDefault = () => {
      return Math.random();
    };

    this.variations.lowLevel = {};
    this.variations.lowLevel.target = 0;
    this.variations.lowLevel.current = 0;
    this.variations.lowLevel.upEasing = 0.005;
    this.variations.lowLevel.downEasing = 0.002;

    this.variations.lowLevel.getDefault = () => {
      return Math.random();
    };

    this.variations.mediumLevel = {};
    this.variations.mediumLevel.target = 0;
    this.variations.mediumLevel.current = 0;
    this.variations.mediumLevel.upEasing = 0.008;
    this.variations.mediumLevel.downEasing = 0.004;

    this.variations.mediumLevel.getDefault = () => {
      return Math.random() * 4;
    };

    this.variations.highLevel = {};
    this.variations.highLevel.target = 0;
    this.variations.highLevel.current = 0;
    this.variations.highLevel.upEasing = 0.02;
    this.variations.highLevel.downEasing = 0.001;

    this.variations.highLevel.getDefault = () => {
      return Math.random();
    };
  }

  setLights() {
    this.lights = {};

    // Light A
    this.lights.a = {};

    this.lights.a.intensity = 1.85;

    this.lights.a.color = {};
    this.lights.a.color.value = "#ff3e00";
    this.lights.a.color.instance = new THREE.Color(this.lights.a.color.value);

    this.lights.a.spherical = new THREE.Spherical(1, 0.615, 2.049);

    // Light B
    this.lights.b = {};

    this.lights.b.intensity = 1.4;

    this.lights.b.color = {};
    this.lights.b.color.value = "#0063ff";
    this.lights.b.color.instance = new THREE.Color(this.lights.b.color.value);

    this.lights.b.spherical = new THREE.Spherical(1, 2.561, -1.844);

    // Debug
    if (this.debug) {
      for (const _lightName in this.lights) {
        const light = this.lights[_lightName];

        const debugFolder = this.debugFolder.addFolder({
          title: _lightName,
          expanded: true,
        });

        debugFolder
          .addInput(light.color, "value", { view: "color", label: "color" })
          .on("change", () => {
            light.color.instance.set(light.color.value);
          });

        debugFolder
          .addInput(light, "intensity", { min: 0, max: 10 })
          .on("change", () => {
            this.material.uniforms[
              `uLight${_lightName.toUpperCase()}Intensity`
            ].value = light.intensity;
          });

        debugFolder
          .addInput(light.spherical, "phi", {
            label: "phi",
            min: 0,
            max: Math.PI,
            step: 0.001,
          })
          .on("change", () => {
            this.material.uniforms[
              `uLight${_lightName.toUpperCase()}Position`
            ].value.setFromSpherical(light.spherical);
          });

        debugFolder
          .addInput(light.spherical, "theta", {
            label: "theta",
            min: -Math.PI,
            max: Math.PI,
            step: 0.001,
          })
          .on("change", () => {
            this.material.uniforms.uLightAPosition.value.setFromSpherical(
              light.spherical
            );
          });
      }
    }
  }

  setOffset() {
    this.offset = {};
    this.offset.spherical = new THREE.Spherical(
      1,
      Math.random() * Math.PI,
      Math.random() * Math.PI * 2
    );
    this.offset.direction = new THREE.Vector3();
    this.offset.direction.setFromSpherical(this.offset.spherical);
  }

  setGeometry() {
    this.geometry = new THREE.SphereGeometry(1, 512, 512);
    this.geometry.computeTangents();
  }

  setMaterial() {
    let date = new Date();
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        // uLightAColor: { value: "#0063ff" },
        uLightAColor: { value: this.lights.a.color.instance },
        uLightAPosition: { value: new THREE.Vector3(1, 1, 0) },
        uLightAIntensity: { value: this.lights.a.intensity },

        // uLightBColor: { value: "#0063ff" },
        // uLightBColor: { value: this.lights.b.color.instance },
        uLightBPosition: { value: new THREE.Vector3(-1, -1, 0) },
        uLightBIntensity: { value: this.lights.b.intensity },

        uSubdivision: {
          value: new THREE.Vector2(
            this.geometry.parameters.widthSegments,
            this.geometry.parameters.heightSegments
          ),
        },

        uOffset: { value: new THREE.Vector3() },
        // Math.random() * 10
        uDistortionFrequency: { value: 1.5 },
        uDisplacementFrequency: { value: 2.12 },
        uDisplacementStrength: { value: 0.152 },
        uDistortionStrength: { value: 0.5 },
        
        // uFresnelOffset: { value: -1.609 },
        // uFresnelMultiplier: { value: 3.587 },
        // uFresnelPower: { value: 1.793 },

        uHighColor: { value: new THREE.Vector3(5.1, 0.907, 0.01) },
        uLowColor: { value: new THREE.Vector3(0.6, 0.08, 0.01) },
        // uStartColor: { value: new THREE.Vector3(0.569, 0.796, 0.243) },
        // uEndColor: { value: new THREE.Vector3(0.675, 0.824, 0.929) },

        uTime: { value: date.getSeconds() * date.getMinutes() },
      },
      defines: {
        USE_TANGENT: "",
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    });

    // this.material.uniforms.uLightAPosition.value.setFromSpherical(
    //   this.lights.a.spherical
    // );
    // this.material.uniforms.uLightBPosition.value.setFromSpherical(
    //   this.lights.b.spherical
    // );
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  update() {}
}
