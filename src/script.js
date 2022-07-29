import "./style.css";
import * as THREE from "three";
import JSZip from "jszip";
import FileSaver from "file-saver";
import { OrbitControls } from "./XanaNavigationControls";

import vertexShader from "./shaders/mapShader/landFacesVertex.glsl";
import fragmentShader from "./shaders/mapShader/landFacesFragment.glsl";
import manualInput from "./manualInput";

// Canvas
const canvas = document.querySelector("canvas.webgl");

/*\/\/*********** DETECT SCREENSHOT */
const screenshotButton = document.querySelector("#screenshot");
const repositionAndSave = () => {
  /*** */

  let noOfSideTiles = 13;
  const noOfSideParcels = 390;
  let camSideLength = noOfSideParcels / noOfSideTiles;

  camera.left = camSideLength / -2;
  camera.right = camSideLength / 2;
  camera.top = camSideLength / 2;
  camera.bottom = camSideLength / -2;
  camera.near = 1;
  camera.far = 100;
  camera.zoom = 1;
  camera.updateProjectionMatrix();

  /*** */
  const zip = new JSZip();
  //y iterator
  for (let i = 0; i < noOfSideTiles; i++) {
    //x iterator
    for (let j = 0; j < noOfSideTiles; j++) {
      const factorX = i % noOfSideTiles;
      const factorY = j % noOfSideTiles;
      const xPos =
        noOfSideParcels / -2 + camSideLength / 2 + factorX * camSideLength;
      const yPos =
        noOfSideParcels / 2 - camSideLength / 2 - factorY * camSideLength;

      camera.position.set(xPos, yPos, 20);
      render();
      canvas.toBlob((blob, callback) => {
        //to do
        zip.file(`z${noOfSideTiles}_y${j}_x${i}.png`, blob);

        if (i == j && j == noOfSideTiles - 1) {
          zip.generateAsync({ type: "blob" }).then(function (content) {
            FileSaver.saveAs(content, "download.zip");
          });
        }
      });
    } //x iterator end
  } //y iterator end
};

screenshotButton.addEventListener("click", repositionAndSave);
/*/\/\****************** */

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */

/*\/\/*** CREATE LANDS **************** */
const gridGeo = new THREE.PlaneGeometry(390, 390, 272 /** 2*/, 275 /** 2*/);
// manualInput(gridGeo);
const [newLandsGeo2, locationsIndex2] = manualInput(gridGeo);
// console.log(newLandsGeo2);

const gridMat = new THREE.ShaderMaterial({
  depthWrite: false,
  // blending: THREE.AdditiveBlending,
  vertexColors: true,
  vertexShader,
  fragmentShader,
  uniforms: {
    uZoom: { value: 1.0 },
  },
});

const points = new THREE.Mesh(newLandsGeo2, gridMat);
scene.add(points);
/*/\/\*** END OF LANDS CREATE ********* */

/**
 * Sizes
 */
const sizes = {
  // width: 256,
  // height: 256,
  width: 512,
  height: 512,
};

/**
 * Camera
 */
// const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
// Camera

const frustumSize = 390 / 13;
const aspect = 1;
const h = frustumSize;
const w = frustumSize * aspect;

const camera = new THREE.OrthographicCamera();
camera.left = w / -2;
camera.right = w / 2;
camera.top = h / 2;
camera.bottom = h / -2;
camera.near = 1;
camera.far = 100;

const noOfSideTiles = 13;
const noOfSideParcels = 390;
// parcels/2 splits to negative and positive coords, - sends us to leftmost
// parcels/ tiles gives size of one tile. divide by 2 to place at center of zoom level
//addition moves us in positive increments from left to right
const xPos = noOfSideParcels / -2 + noOfSideParcels / (noOfSideTiles * 2);
// parcels/2 splits to negative and positive coords , + sends us to topmost
// parcels/ tiles gives size of one tile. divide by 2 to place at center of zoom level
//subtraction moves us in negative decrements from top to bottom
const yPos = noOfSideParcels / 2 - noOfSideParcels / (noOfSideTiles * 2);
camera.position.set(xPos, yPos, 20);
camera.zoom = 1;
camera.updateProjectionMatrix();
// camera.zoom = 50;
scene.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
const controls = new OrbitControls(camera, renderer.domElement);
const render = () => {
  controls.update();
  renderer.render(scene, camera);
};
render();
// console.log(scene);

const tick = () => {
  render();
  window.requestAnimationFrame(tick);
};
tick();
