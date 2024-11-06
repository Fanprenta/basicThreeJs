import * as THREE from "three";

//fetch the canvas where the animation lives
const canvas = document.getElementsByClassName("webgl")[0];

//build the scene
const scene = new THREE.Scene();

//set sizes for later
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

//create object that will be seen on the scene:
const geometry = new THREE.SphereGeometry(0.5, 20, 20);

const colors = ["red", "green", "blue"];

//object 1
const ob1 = new THREE.Mesh(
  geometry,
  new THREE.MeshBasicMaterial({
    color: "blue",
  })
);
ob1.position.set(-2, 0, 0);

//object 2
const ob2 = new THREE.Mesh(
  geometry,
  new THREE.MeshBasicMaterial({
    color: "red",
  })
);
ob2.scale.set(0.5, 0.5);

ob2.position.set(2, 0, 0);

//object 3
const ob3 = new THREE.Mesh(
  geometry,
  new THREE.MeshBasicMaterial({
    color: "yellow",
  })
);

scene.add(ob1, ob2, ob3);

// for (let i = 0; i < 12; i++) {
//   const colorIndex = (i + 3) % 3;
//   const material = new THREE.MeshBasicMaterial({
//     color: colors[colorIndex],
//   });
//   const sphere = new THREE.Mesh(geometry, material);

//   sphere.position.set(
//     (colorIndex + Math.random()) *
//       Math.random() *
//       Math.cos(colorIndex * Math.PI * i),
//     (colorIndex + Math.random()) *
//       colorIndex *
//       Math.random() *
//       Math.sin(-colorIndex),
//     (colorIndex + Math.random()) *
//       colorIndex *
//       Math.random() *
//       Math.cos(colorIndex)
//   );
//   sphere.scale.set(
//     (colorIndex + Math.random()) *
//       Math.random() *
//       Math.cos(colorIndex * Math.PI * i),
//     (colorIndex + Math.random()) *
//       colorIndex *
//       Math.random() *
//       Math.sin(-colorIndex),
//     (colorIndex + Math.random()) *
//       colorIndex *
//       Math.random() *
//       Math.cos(colorIndex)
//   );
//   console.log(colorIndex * Math.random() * Math.cos(colorIndex));
//   scene.add(sphere);
// }

//set the camera
const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  1,
  1000
);
camera.position.set(0, 0, 8);
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
