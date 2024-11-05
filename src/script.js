import * as THREE from "three";

//fetch the canvas where the animation lives
const canvas = document.getElementsByClassName("webgl")[0];

//set sizes for later
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

//build the scene
const scene = new THREE.Scene();

//set the camera
const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  1,
  1000
);
scene.add(camera);

//get the renderer and render
const renderer = new THREE.WebGLRenderer({ canvas });
//this line adds an inline style with width and height properties for the canvas
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

//resize support
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  //update camera aspect ratio
  camera.aspect = sizes.width / sizes.height;
  //must updata projection matrix every time you change a camera param
  camera.updateProjectionMatrix();

  //update canvas element size
  renderer.setSize(sizes.width, sizes.height);

  //this is for devices that have a pixel ratio above 1, like apple products
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  //re render scene
  renderer.render(scene, camera);
});

//fulscreen support
window.addEventListener("dblclick", () => {
  //add support for safari
  const fullScreenElement =
    document.fullscreenElement || document.webkitFullScreenElement;

  if (fullScreenElement) {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullScreenElement) {
      document.webkitExitFullScreenElement();
    }
  } else {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen();
    } else if (canvas.webkitRequestFullScreen) {
      canvas.webkitRequestFullScreen();
    }
  }
});
