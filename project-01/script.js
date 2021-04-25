/* Single Points Vertex source t.ly/Stek */

/**
 * HELPERS
 */

// Debug UI
const gui = new dat.GUI({closed: true, width: 300});
//gui.hide(); // Press twice to show

// // Debug change color Rewatch threejs-journey.xyz/lessons/10
// const parameters = {
//     color: 0xff0000
// } // Empty object 

// gui.addColor(parameters, 'color').onChange(() => {
//     material.color.set(parameters.color)
// });



/**
 * SETUP
 */

// Canvas
const canvas = document.querySelector('canvas.webgl')

// 01 Declare scene
const scene = new THREE.Scene();

// 02 Declare camera
const camera = new THREE.PerspectiveCamera( 50, window.innerWidth/window.innerHeight, 0.1, 1000 );

// 03 Declare renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setClearColor(0xcccccc); // Background color 0x25252f
  document.body.appendChild( renderer.domElement );

// 00 Re-Sizes Viewport
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})


/**
 * EVENTS
 */

// Mouse Vanilla JS 
const mouse = new THREE.Vector2();

// This makes it cartesian cooridinates -1 to 1
window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX / sizes.width * 2 - 1;
    mouse.y = - (event.clientY / sizes.height) * 2 + 1;
    //console.log(mouse.y)
})

/* Raycaster */
const raycaster = new THREE.Raycaster()



/**
 * GEOMETRY
 */

// Box Geometry
const boxGeometry = new THREE.BoxGeometry( 2, 0.01, 2 );
const boxMaterial = new THREE.MeshBasicMaterial( {} );
const cube = new THREE.Mesh( boxGeometry, boxMaterial );
scene.add( cube );

cube.position.set(0, 0, 0); // Original position

// datGUI

const folder1 = gui.addFolder('Cube Plane');
  folder1.add(cube.position, 'x').min(- 3).max(3).step(0.01).name('Axis X'); // Method chaining version range
  folder1.add(cube.position, 'y').min(- 3).max(3).step(0.01).name('Axis Y');
  folder1.add(cube.position, 'z').min(- 3).max(3).step(0.01).name('Axis Z'); 
  folder1.add(boxMaterial, 'wireframe').name('Wireframe');
folder1.open(); // .close on load

// geometry.normalize();
// MeshNormalMaterial

// Sphere
const sphereGeometry = new THREE.SphereGeometry( 0.25, 32, 32 );
const sphereMaterial = new THREE.MeshBasicMaterial( {} );
const sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
scene.add( sphere );

sphere.position.set(1, 1, 0); // Original position

const folder2 = gui.addFolder('Sphere');
  folder2.add(sphere.position, 'x').min(- 3).max(3).step(0.01).name('Axis X'); // Method chaining version range
  folder2.add(sphere.position, 'y').min(- 3).max(3).step(0.01).name('Axis Y');
  folder2.add(sphere.position, 'z').min(- 3).max(3).step(0.01).name('Axis Z'); 
  folder2.add(sphereMaterial, 'wireframe').name('Wireframe');
folder2.open(); // .close on load


// Cone
const coneGeometry = new THREE.ConeGeometry( 0.25, 0.75, 8 );
const coneMaterial = new THREE.MeshBasicMaterial( {} ); // {color: 0xffcccc, wireframe: true }
const cone = new THREE.Mesh( coneGeometry, coneMaterial );
scene.add( cone );

cone.position.set(- 0.5, 0.5, 0); // Original position

const folder3 = gui.addFolder('Cone');
  folder3.add(cone.position, 'x').min(- 3).max(3).step(0.01).name('Axis X'); // Method chaining version range
  folder3.add(cone.position, 'y').min(- 3).max(3).step(0.01).name('Axis Y');
  folder3.add(cone.position, 'z').min(- 3).max(3).step(0.01).name('Axis Z'); 
  folder3.add(coneMaterial, 'wireframe').name('Wireframe');
folder3.open(); // .close on load


// Points
const dotGeometry = new THREE.Geometry();

dotGeometry.vertices.push(new THREE.Vector3(0, 1, 0));
dotGeometry.vertices.push(new THREE.Vector3(0, 0.8, 0.5));
dotGeometry.vertices.push(new THREE.Vector3(-1, 0.5, 0.1));
dotGeometry.vertices.push(new THREE.Vector3(1, 0.4, 0.3));
dotGeometry.vertices.push(new THREE.Vector3(0.5, -0.4, 0.1));

const dotMaterial = new THREE.PointsMaterial({
    size: 3,
    size: 0.05,
    sizeAttenuation: true, // This make bigger on zoom. false to turn off
});

const dot = new THREE.Points(dotGeometry, dotMaterial);
scene.add(dot);



/**
 * CAMERA
 */

// Add Orbit Controls
const controls = new THREE.OrbitControls( camera, renderer.domElement );
controls.enableDamping = true;
camera.position.z = 5;
camera.position.y = 1;

//controls.update();

// datGUI
const folder4 = gui.addFolder('Camera');
  folder4.add(camera.position, 'x').min(- 10).max(10).step(0.01).name('Axis X'); // Method chaining version range
  folder4.add(camera.position, 'y').min(- 10).max(10).step(0.01).name('Axis Y');
  folder4.add(camera.position, 'z').min(- 10).max(10).step(0.01).name('Axis Z'); 
folder4.open(); // .close on load


/**
 * TICK
 */

// Render the animation at default 60fps
const animate = function () {
  requestAnimationFrame( animate );
  
  /* Animate cube */
  cube.rotation.x += 0.0; // Pitch
  cube.rotation.y -= 0.0005; // Yaw
  cube.rotation.z += 0.0; // Roll
  
  // Dots
    cone.rotation.x += 0.0; // Pitch
	cone.rotation.y += 0.02; // Yaw
	cone.rotation.z += 0.0; // Roll

  // Cast Ray from Camera
    raycaster.setFromCamera(mouse, camera);
    const objectsToTest = [cube, sphere, cone, dot];
    const intersects = raycaster.intersectObjects(objectsToTest); // This is for many objects

    // This changes color when it intersect the Ray
    for(const object of objectsToTest)
    {
        object.material.color.set('#000033') // This sets the default colour 
    };

    for(const intersect of intersects)
    {
        intersect.object.material.color.set('#ff00ff') // This sets the colour when active
    };
  
  // Update controls damping
    controls.update();

  renderer.render( scene, camera );
  };

animate();