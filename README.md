# Pixi3D
Pixi3D is a JavaScript library which makes it possible to render 3D graphics on 
the web using PixiJS. Because Pixi3D is built on top of PixiJS, it plays nice 
with the already established and easy to use PixiJS API. Pixi3D works for both 
desktop and mobile web browsers and includes several components which makes it 
easy to create nice looking 3D scenes out-of-the-box:

* Load models from file or create procedural generated meshes
* Supports physically-based rendering (PBR) and image-based lighting (IBL)
* Morphing and rotation/translation/scale animations
* Customizable materials and shaders
* Built on top of the already familiar PixiJS API

# Getting started
Let's create a simple application which renders a rotating cube. Start by [getting the latest version of Pixi3D](https://github.com/jnsmalm/pixi3d/releases). Also [get an up-to-date version of PixiJS](https://github.com/pixijs/pixi.js/releases) (v5.2+) which is needed to use Pixi3D.

Next, create a file *app.js* with the following contents.

```javascript
let app = new PIXI.Application({
  backgroundColor: 0xdddddd, resizeTo: window, antialias: true
})
document.body.appendChild(app.view)

let mesh = app.stage.addChild(PIXI3D.Mesh3D.createCube())

let rotation = 0
app.ticker.add(() => {
  mesh.rotationQuaternion.setEulerAngles(0, rotation++, 0)
})
```

Then create *index.html* and include the required scripts.

```html
<!doctype html>
<html lang="en">
<body>
  <script type="text/javascript" src="pixi.js"></script>
  <script type="text/javascript" src="pixi3d.js"></script>
  <script type="text/javascript" src="app.js"></script>
</body>
</html>
```

### Install with npm
Pixi3D is also available as a npm package, to install the latest release you
can run the following command:

`npm install pixi3d --save-dev`

This requires that an up-to-date version of Node.js is already installed.

### Examples
Included with the source code is a set of examples which shows how to use some 
of the different features of Pixi3D. The examples can be found in the folder
*examples/src* and can be run by using the *serve* script.

For example, to run the *getting-started* application:

`npm run serve -- --env.example=getting-started`

The *serve* script can also be used for trying out Pixi3D without having to do 
any additional setup. Just create a new file i.e. *testing-feature.js* in the 
examples folder and run it with the *serve* script:

`npm run serve -- --env.example=testing-feature`

# Overview
The overall goal of Pixi3D is to make it simple to render 3D graphics in a 
project which has already invested in using PixiJS (which focuses on 2D 
graphics). PixiJS is a established rendering library and contains a lot of 
functionality for making stuff easier. Such features could be loading assets, 
having a scene graph or handling user interaction. Because Pixi3D is built on 
top of PixiJS, all of those features are available in Pixi3D as well. 

Some of the concepts explained requires a basic understanding about PixiJS. For 
more information and to learn more about PixiJS go to https://www.pixijs.com

### Position, rotation and scale in 3D
A core concept in PixiJS is the idea of a scene graph, that is an object 
hierarchy with parent-child relations. Containers can be created which can have 
a number of children, and those children can have children of their own and so 
on. All objects have a transform which is used to be able to set the position, 
rotation and scale of that object. The transform of an object is always relative 
to it's parent transform. That means that when moving the parent object, all of 
it's children will move as well (same goes for rotation and scaling).

The transform object in PixiJS is intended for 2D graphics, so to be able to 
transform objects in 3D a few additions and changes is needed. First is 
*position* and *scale*, which both has been extended with the z-axis.

```javascript
object.position.z = 10
```

Next is *rotation* which must be able to rotate in all three axes instead of 
just one (which is the case when using 2D). So when rotating an object in 3D, 
*rotationQuaternion* is used instead of the regular *rotation* available in 
PixiJS. The easiest way to set the rotation of an object is by using the 
*setEulerAngles* method:

```javascript
// Sets the rotation of an object to 45 degrees around the y-axis.
object.rotationQuaternion.setEulerAngles(0, 45, 0)
```

### Geometry, mesh and model
The geometry is what defines the shape of an object. But it can also include 
other kind of information such as texture coordinates, colors or normals. The 
different attributes of the geometry is set depending on the desired visual 
effect and which material/shader is used. The attributes are being represented 
as a list of numbers using typed arrays (i.e. *Float32Array* or *Uint32Array*).

A mesh is an object which can be added to the scene graph. It contains geometry 
and has a material which is used to render the mesh. A mesh can be created with 
procedural geometry or be a part of a model containing many meshes.

A model is a container for mesh objects but can also include animations for 
those meshes. Models are generally being loaded from a file which has been 
created in a 3D modeling tool like Maya or Blender. Pixi3D supports loading of 
models using the glTF file format.

```javascript
let app = new PIXI.Application({
  backgroundColor: 0xdddddd, resizeTo: window, antialias: true
})
app.loader.add("assets/model.gltf")

app.loader.load(() => {
  let model = PIXI3D.Model3D.from("assets/model.gltf")
})
```

> glTF™ (GL Transmission Format) is a royalty-free specification for the 
> efficient transmission and loading of 3D scenes and models by applications. 
> glTF minimizes both the size of 3D assets, and the runtime processing needed 
> to unpack and use those assets. glTF defines an extensible, common publishing 
> format for 3D content tools and services that streamlines authoring workflows 
> and enables interoperable use of content across the industry.

Learn more about glTF at https://www.khronos.org/gltf/

### Material and shader
A material is what defines and renders the geometry of a mesh. Which material 
to use depends on the requirements of how the object should be displayed. By 
using customized materials, it is possible to create any desired graphical 
effect. A material uses a shader program to describe the visual output.

Shader programs are written using OpenGL Shading Language (GLSL) which runs on 
the GPU. The shader interprets the data of the mesh geometry and describes how 
that data should be rendered on screen. There are two types of shaders in 
Pixi3D, vertex shaders and fragment shaders. Vertex shaders are used to control 
where vertices end up on the screen and pixel shaders are used to set the color 
of a pixel.

# Building

Build *pixi3d.js* to *dist* folder with production settings.
```
> npm run build
```