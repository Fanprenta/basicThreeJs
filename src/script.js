import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import gsap from "gsap";

//-----------------GUI SETUP-----------------------//

const gui = new dat.GUI({
  width: 350,
  title: "First app",
});
const torusTweaks = gui.addFolder("torusTweaks");
torusTweaks.close();
gui.close();
gui.hide();

//fetch the canvas where the animation lives
const canvas = document.getElementsByClassName("webgl")[0];

//build the scene
const scene = new THREE.Scene();

//set sizes for later
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const cursor = {
  x: 0,
  y: 0,
};

const debug = {
  sphereColor: "red",
  spin: () => {
    gsap.to(group.rotation, {
      duration: 1,
      y: group.rotation.y + Math.PI * 2,
    });
  },
  torusSubdivisions: 22,
  torusArc: 22,
};

//create objects that will be seen on the scene:
const sphereMaterial = new THREE.MeshBasicMaterial({
  color: debug.sphereColor,
});
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 20, 20),
  sphereMaterial
);

const box = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1, 4, 4),
  new THREE.MeshBasicMaterial({
    color: "red",
    wireframe: true,
  })
);
box.scale.set(0.5, 0.5, 0.5);
box.position.set(2, 0, 0);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(
    0.5,
    0.5,
    debug.torusSubdivisions,
    debug.torusSubdivisions,
    debug.torusArc
  ),
  new THREE.MeshBasicMaterial({
    color: "yellow",
    // wireframe: true,
  })
);
torus.position.setZ(-1);

const group = new THREE.Group();
group.add(sphere, box, torus);
scene.add(group);

//first tweak: position
gui.add(group.position, "x").max(2).min(0).step(0.5).name("group-position");

//second tweak: color
gui
  .addColor(debug, "sphereColor")
  .onChange((c) => sphereMaterial.color.set(debug.sphereColor))
  .name("sphere-color");

//third tweak: execute a function
gui.add(debug, "spin").name("spin");

//fourth tweak: modifiy a geomtry
torusTweaks
  .add(debug, "torusSubdivisions")
  .min(10)
  .max(90)
  .step(10)
  .name("torus-subdivisions")
  .onFinishChange((a) => {
    torus.geometry.dispose();
    torus.geometry = new THREE.TorusGeometry(
      0.5,
      0.5,
      debug.torusSubdivisions,
      debug.torusSubdivisions,
      debug.torusArc
    );
  });

torusTweaks
  .add(debug, "torusArc")
  .min(10)
  .max(50)
  .step(2)
  .name("torus-arc")
  .onFinishChange((a) => {
    torus.geometry.dispose();
    torus.geometry = new THREE.TorusGeometry(
      0.5,
      0.5,
      debug.torusSubdivisions,
      debug.torusSubdivisions,
      debug.torusArc
    );
  });
gui.add(torus.material, "wireframe").name("torus-wireframe");

//add a camera
const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  1,
  1000
);
camera.position.set(0, 0, 5);
scene.add(camera);

//get the renderer and render
const renderer = new THREE.WebGLRenderer({ canvas });
//this line adds an inline style with width and height properties for the canvas
renderer.setSize(sizes.width, sizes.height);

let now = Date.now();
let clock = new THREE.Clock();

//gui events
window.addEventListener("keydown", (e) => {
  const key = e.key;
  if (key === "s") {
    gui.show(gui._hidden);
  }
});

//animation
const tick = () => {
  //using date object (native js)
  const deltaNow = Date.now() - now;

  //using THREE clock
  const delta = clock.getElapsedTime();

  //modify position
  sphere.position.set(
    0,
    Math.cos(/*delta*/ (deltaNow * Math.PI) / 2000) * 2,
    Math.sin(/*delta*/ (deltaNow * Math.PI) / 2000) * 2
  );

  //native js controls
  // camera.position.set(
  //   Math.cos(Math.PI * cursor.x * 2) * 2,
  //   camera.position.y,
  //   Math.sin(Math.PI * cursor.y * 2) * 2
  // );
  // camera.lookAt(group.position);

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();

//controls (native js)
window.addEventListener("mousemove", (e) => {
  cursor.x = e.clientX / sizes.width - 0.5;
  cursor.y = -(e.clientY / sizes.height - 0.5);
  // console.log(cursor);
});

const controls = new OrbitControls(camera, canvas);

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
