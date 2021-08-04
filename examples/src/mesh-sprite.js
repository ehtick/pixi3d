let app = new PIXI.Application({
  backgroundColor: 0xdddddd, resizeTo: window, antialias: true
})
document.body.appendChild(app.view)

document.getElementById("message").style.display = "block"
document.getElementById("message").innerText = "Click to render object and update texture for sprite at top left"

app.loader.add("diffuse.cubemap", "assets/environments/autumn/diffuse.cubemap")
app.loader.add("specular.cubemap", "assets/environments/autumn/specular.cubemap")
app.loader.add("suzanne.gltf", "assets/models/suzanne/suzanne.gltf")

// The aspect ratio of the camera being used should be the same as width/height
// of the mesh sprite.
PIXI3D.Camera.main.aspect = 1

app.loader.load((loader, resources) => {
  // Creates the model which will be used to render to sprite.
  let model = PIXI3D.Model.from(resources["suzanne.gltf"].gltf)
  model.scale.set(1.8)

  for (let mesh of model.meshes) {
    mesh.material.metallic = 0
    mesh.material.roughness = 0.5
  }

  let imageBasedLighting = new PIXI3D.ImageBasedLighting(
    resources["diffuse.cubemap"].cubemap,
    resources["specular.cubemap"].cubemap)

  PIXI3D.LightingEnvironment.main =
    new PIXI3D.LightingEnvironment(app.renderer, imageBasedLighting)

  // Create first mesh sprite which will be used to render the object each frame.
  let sprite1 = app.stage.addChild(new PIXI3D.MeshSprite(app.renderer, model, {
    width: 256, height: 256
  }))
  sprite1.tint = 0x00ff22

  // Create second mesh sprite which will be used to render the object only when
  // user clicks on the window.
  let sprite2 = app.stage.addChild(new PIXI3D.MeshSprite(app.renderer, model, {
    width: 256, height: 256, autoRenderObject: false
  }))
  sprite2.tint = 0xff00ff

  document.addEventListener("pointerdown", () => {
    // Render object to sprite and update texture
    sprite2.renderObject()
  })

  let velocity = { x: 1, y: 2 }
  let rotation = 0

  app.ticker.add(() => {
    model.rotationQuaternion.setEulerAngles(0, rotation++, 0)
    sprite1.position.set(sprite1.x + velocity.x, sprite1.y + velocity.y)
    if (sprite1.x < 0) {
      sprite1.x = 0
      velocity.x = -velocity.x
    }
    if (sprite1.x + sprite1.width > app.renderer.width) {
      sprite1.x = app.renderer.width - sprite1.width
      velocity.x = -velocity.x
    }
    if (sprite1.y < 0) {
      sprite1.y = 0
      velocity.y = -velocity.y
    }
    if (sprite1.y + sprite1.height > app.renderer.height) {
      sprite1.y = app.renderer.height - sprite1.height
      velocity.y = -velocity.y
    }
  })
})