import './style.css'
import React from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import  TransformControls  from './TransformControls.js'
import fileGlb from './bread.glb' // GLB FILE

class App extends React.Component {
  constructor(props) {
    super(props);
    // STATE FOR UPDATING INPUTS VALUE AND SET MODEL POSITION
    this.state = {position: { x: 0, y: 0, z: 0 },
                  rotation: { x: 0, y: 0, z: 0 },
                  scale: { x: 3, y: 3, z: 3 } }
  }
  // FUNCTION FOR SAVE VALUES FORM INPUTS
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
    //ADD RENDERER
    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setClearColor('#dbdbdb');
    this.renderer.setSize(width, height);
    this.renderer.gammaFactor = 1.5;
    this.renderer.gammaOutput = true;
    this.mount.appendChild(this.renderer.domElement);

    //ADD CAMERA
    this.camera = new THREE.PerspectiveCamera( 75, width / height, 0.1, 10000 );

    //ADD SCENE
    this.scene = new THREE.Scene();

    // LIGHT
    this.light = new THREE.AmbientLight(0xffffff, 3.3);
    this.scene.add(this.light);

    // ADD GRID HELPER
    const size = 10;
    const divisions = 25;
    const gridHelper = new THREE.GridHelper( size, divisions );
    this.scene.add( gridHelper );




    //ADD TRANSFORM CONTROL FROM INDEX.HTML
    this.control = new TransformControls( this.camera, this.renderer.domElement );
    this.control.setSize(1);

    // ADD EVENT LISTNER TO MOVE MODEL AND CHANGE REACT STATE TO CHANGE VALUSE IN INPUTS
    this.control.addEventListener( 'change', () => { this.renderer.render(this.scene, this.camera); });




    // EVENT LISTNER TO DISABLE ORBIT MOVE
    this.control.addEventListener( 'dragging-changed', ( event ) => {
      this.updateSetState();
      this.orbit.enabled = ! event.value});

    // ORBIT CONTROL
    this.orbit = new OrbitControls( this.camera, this.renderer.domElement );
    this.camera.position.set( 0, 2, 2 );
    this.orbit.update();

    //EVENT LISTNER TO VIEW MODEL IN DIFFERENT POSITIONS
    this.orbit.addEventListener("change", () => this.renderer.render(this.scene, this.camera));

    // ADD LOADER FROM NPM FOLDER
    this.loader = new GLTFLoader();

    // LODING GLB FILE FROM SRC FOLDER
    this.loader.load(fileGlb, gltf => {
      this.gltf = gltf.scene

      // ADD MODEL TO THE SCENE
      this.scene.add(gltf.scene);

      // ATTACH MODEL TO TRANSFORM CONTROL
      this.control.attach( gltf.scene );
			this.scene.add( this.control );

      //
      gltf.scene.scale.set(3, 3, 3)
      this.orbit.update();

      this.renderer.render(this.scene, this.camera);
    }, undefined,

    error => {
      console.log(error);
    });

  };

  // UPDATE REACT STATE AND INPUT VALUE
  updateSetState = () => {
    if (this.gltf !== undefined) {
      this.setState((state) => {
        const gltf = this.gltf[this.valType.value]
        return state[this.valType.value] = {x:gltf.x, y:gltf.y, z:gltf.z,}
      });
    };
  }


  // GETING DATA FORM SELECT ELEMENT TO SET POSITION SCALE OR ROTATION IN TRANSFORMCONTROL
  posRotScale = () => {
      switch (this.valType.value) {

        case "position":
          this.control.setMode( "translate" );
          break;

        case "rotation":
          this.control.setMode( "rotate" );
          break;

        case "scale":
          this.control.setMode( "scale" );
          break;

        default:;

    }
  };

  // MODEL POSITION CHANGE VIA POSITION INPUT
  objPosition = (direction, axis) => {
    this.gltf[direction][axis] = this.state[direction][axis];
    this.renderer.render(this.scene, this.camera);
  };
  // MODEL ROTATION CHANGE VIA ROTATION INPUT
  objRotation = (direction, axis) => {
    this.gltf[direction][axis] = this.state[direction][axis];
    this.renderer.render(this.scene, this.camera);
  };
  // MODEL SCALE CHAGE VIA SCALE INPUT
  objScale = (direction, axis) => {
    this.gltf[direction][axis] = this.state[direction][axis];
    this.renderer.render(this.scene, this.camera);
  };

  render() {
    return (
      <div className="cont">
        <div className="inputDiv">
            <div
              style={{width: "500px", height: "500px"}}
              ref={mount => this.mount = mount}>
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
                    onChange={event => this.stateUpdate(event, "rotation", "x", this.objRotation)}/>
                  <input type="number" value={this.state.rotation.y}
                    onChange={event => this.stateUpdate(event, "rotation", "y", this.objRotation)}/>
                  <input type="number" value={this.state.rotation.z}
                    onChange={event => this.stateUpdate(event, "rotation", "z", this.objRotation)}/>
          </div>
          </div>

          <div>
          <div>
            <p>Scale</p>
            <input type="number" value={this.state.scale.x}
                    onChange={event => this.stateUpdate(event, "scale", "x", this.objScale)}/>
            <input type="number" value={this.state.scale.y}
                    onChange={event => this.stateUpdate(event, "scale", "y", this.objScale)}/>
            <input type="number" value={this.state.scale.z}
                    onChange={event => this.stateUpdate(event, "scale", "z", this.objScale)}/>
          </div>
          </div>

          <div>
            <p>Position Rotation Scaled Selector</p>
            <select onChange={this.posRotScale} ref={valType => this.valType = valType}>
              <option value="position">position</option>
              <option value="rotation">rotation</option>
              <option value="scale">scale</option>
            </select>
          </div>

        </div>
      </div>
    );
  }
}

export default App
