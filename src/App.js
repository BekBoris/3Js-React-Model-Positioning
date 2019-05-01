import './style.css'
import React from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import fileGlb from './meat.glb'

class App extends React.Component {
  constructor(props) {
    super(props);
    // STATE FOR UPDATING INPUTS VALUE AND SET MODEL POSITION
    this.state = {cameraPosition: { x: 0, y: 0, z: 0.35 },
                  position: { x: 0, y: 0, z: 0 },
                  rotation: { x: 0.9, y: 0, z: 0 },
                  scale: { x: 1, y: 1, z: 1 } }
  }
  // FUNCTION FOR SAVE VALUES FORM INPUT AND MOUSE POINTER
  stateUpdate = (event, direction, axis, ajustFunc) => {
    // CHANGING EVENT TO MOUSE DATA IF...
    const targetValue = typeof event === "number" ? event : event.target.value;
    const isNum = targetValue === "" ? "" : Number(targetValue);
    this.setState(state => {
      return state[direction] = { ...state[direction], [axis]: isNum }
    }, () => ajustFunc(direction, axis));
  };

  // FUNCTION TO DO STAFF BEFORE RENDERING ELEMENTS
  componentDidMount = () => {
    const width = this.mount.clientWidth;
    const height = this.mount.clientHeight;
    //ADD SCENE
    this.scene = new THREE.Scene();
    //ADD CAMERA
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    this.camera.position.x = 0;
    this.camera.position.y = 0;
    this.camera.position.z = 0.35; // ADD LIGHT
    // LIGHT
    var light = new THREE.AmbientLight(0xffffff, 3.3);
    this.scene.add(light);
    //ADD RENDERER
    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setClearColor('#dbdbdb');
    this.renderer.setSize(width, height);
    this.renderer.gammaFactor = 1.5;
    this.renderer.gammaOutput = true;
    this.mount.appendChild(this.renderer.domElement);
    // ADDING MOUSE EVENT LISTNER TO GET MOUSE POSITION DATA
    const addSmt = this.mount.appendChild(this.renderer.domElement);
    addSmt.addEventListener('mousemove', this.onMouseMove, false);
    // LODING GLB FILE FROM ROOT FOLDER
    this.loader = new GLTFLoader();
    this.loader.load(fileGlb, gltf => {
      // FIRST MODEL POSITION INITIALIZATION
      this.scene.add(gltf.scene);
      gltf.scene.position.x = 0;
      gltf.scene.position.y = 0;
      gltf.scene.position.z = 0;
      gltf.scene.rotation.x = 0.9;
      gltf.scene.rotation.y = 0;
      gltf.scene.rotation.z = 0;
      gltf.scene.scale.x = 1;
      gltf.scene.scale.y = 1;
      gltf.scene.scale.z = 1;
      this.renderer.render(this.scene, this.camera);
    }, undefined, error => {
      console.error(error);
    });
  };
  // CAMERA MOVE INITIALIZATION X Y Z AND RENDERING
  cameraMove = (direction, axis) => {
    this.camera.position[axis] = this.state[direction][axis];
    this.renderer.render(this.scene, this.camera);
  };
  // POSITION INITIALIZATION X Y Z AND RENDERING
  objPosition = (direction, axis) => {
    this.scene[direction][axis] = this.state[direction][axis];
    this.renderer.render(this.scene, this.camera);
  };
  // ROTATION INITIALIZATION X Y Z AND RENDERING
  objRotation = (direction, axis) => {
    this.scene[direction][axis] = this.state[direction][axis];
    this.renderer.render(this.scene, this.camera);
  };
  // SCALE INITIALIZATION X Y Z AND RENDERING
  objScale = (direction, axis) => {
    this.scene[direction][axis] = this.state[direction][axis];
    this.renderer.render(this.scene, this.camera);
  };

  // GETING DATA FORM MOUSE POSITION AND SENDING TO STATEUPDATE TO SAVE IN STATE
  onMouseMove = event => {
    // getiong mouse cordinates from threejs canvas
    let mouseX = (event.clientX - event.target.getBoundingClientRect().left) / event.target.getBoundingClientRect().width * 2 - 1;
    let mouseY = (event.clientY - event.target.getBoundingClientRect().top) / event.target.getBoundingClientRect().height * 2 - 1;
    const xyAxis = this.valueAxis.value === "x" ? Math.round(mouseX * 1000) / 1000 : Math.round(mouseY * 1000) / 1000;
    if (event.which === 1) {
      switch (this.valType.value) {
        case "cameraPosition":
          this.stateUpdate(xyAxis, this.valType.value, this.valueAxis.value, this.cameraMove);
          break;

        case "position":
          this.stateUpdate(xyAxis, this.valType.value, this.valueAxis.value, this.objPosition);
          break;

        case "rotation":
          this.stateUpdate(xyAxis * 10, this.valType.value, this.valueAxis.value, this.objRotation);
          break;

        case "scale":
          this.stateUpdate(xyAxis, this.valType.value, this.valueAxis.value, this.objScale);
          break;

        default:;
      }
    }
  };

  render() {
    return (
      <div className="inputDiv">
        <div
          style={{width: "400px", height: "400px"}}
          ref={mount => this.mount = mount}>
        </div>

        <div>
          <p>Camera</p>
          <input type="number" value={this.state.cameraPosition.x}
                  onChange={event => this.stateUpdate(event, "cameraPosition", "x", this.cameraMove)}/>
          <input type="number" value={this.state.cameraPosition.y}
                  onChange={event => this.stateUpdate(event, "cameraPosition", "y", this.cameraMove)}/>
          <input type="number" value={this.state.cameraPosition.z}
                  onChange={event => this.stateUpdate(event, "cameraPosition", "z", this.cameraMove)}/>
        </div>

        <div>
        <div>
          <p>Position</p>
          <input type="number" value={this.state.position.x}
                  onChange={event => this.stateUpdate(event, "position", "x", this.objPosition)}/>
          <input type="number" value={this.state.position.y}
                  onChange={event => this.stateUpdate(event, "position", "y", this.objPosition)}/>
          <input type="number" value={this.state.position.z}
                  onChange={event => this.stateUpdate(event, "position", "z", this.objPosition)}/>
        </div>
        </div>

        <div>
        <div>
          <p>Rotation</p>
          <input type="number" value={this.state.rotation.x}
                  onChange={event => this.stateUpdate(event, "rotation", "x", this.cameraMove)}/>
          <input type="number" value={this.state.rotation.y}
                  onChange={event => this.stateUpdate(event, "rotation", "y", this.cameraMove)}/>
          <input type="number" value={this.state.rotation.z}
                  onChange={event => this.stateUpdate(event, "rotation", "z", this.cameraMove)}/>
        </div>
        </div>

        <div>
        <div>
          <p>Scale</p>
          <input type="number" value={this.state.scale.x}
                  onChange={event => this.stateUpdate(event, "scale", "x", this.cameraMove)}/>
          <input type="number" value={this.state.scale.y}
                  onChange={event => this.stateUpdate(event, "scale", "y", this.cameraMove)}/>
          <input type="number" value={this.state.scale.z}
                  onChange={event => this.stateUpdate(event, "scale", "z", this.cameraMove)}/>
        </div>
        </div>

        <p>Hold Left Click Down to movie the object</p>
        <div>
          <select ref={valType => this.valType = valType}>
            <option value="cameraPosition">camera</option>
            <option value="position">position</option>
            <option value="rotation">rotation</option>
            <option value="scale">scale</option>
          </select>
        </div>
        <div>
          <select ref={valueAxis => this.valueAxis = valueAxis}>
            <option value="x">x</option>
            <option value="y">y</option>
            <option value="z">z</option>
          </select>
        </div>

      </div>
    );
  }
}

export default App
