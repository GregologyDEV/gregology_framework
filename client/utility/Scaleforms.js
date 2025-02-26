import alt from 'alt'
import game from 'natives'

export class Scaleforms {
  
  constructor (scaleform, name) {
    this.scaleform = game.requestScaleformMovieInstance(scaleform)
    this.queue = new Map()
    this.renderTargetID = -1
  }
  
  get isLoaded () {
    return game.hasScaleformMovieLoaded(this.scaleform)
  }

  get isValid () {
    return this.scaleform !== 0
  }

  call (name, ...args) {
    if(this.isLoaded && this.isValid) {

      game.beginScaleformMovieMethod(this.scaleform, name)

      args.forEach(arg => {
        switch(typeof arg) {
          case 'string': 
            game.scaleformMovieMethodAddParamPlayerNameString(arg)
            break

          case 'boolean':
            game.scaleformMovieMethodAddParamBool(arg)
            break

          case 'number':
            if(Number(arg) === arg && arg % 1 !== 0) {
              game.scaleformMovieMethodAddParamFloat(arg)
            } else {
              game.scaleformMovieMethodAddParamInt(arg)
            }
        }
      })
      game.endScaleformMovieMethod()
    } else {
      this.queue.set(name, args)
    }
  }

  onUpdate () {
    if(this.isLoaded && this.isValid) {
      this.queue.forEach((args, name) => {
        this.call(name, ...args)
        this.queue.delete(name)
      })
    }
  }

  renderOnUpdate (render, methodName, ...args) {
    alt.on('update', () => {
      if(render) {
        this[methodName].call(this, ...args)
      }
    })
  }

  render2D (x = 0, y = 0, width = 1, height = 1) {
    this.onUpdate()

    if(this.isLoaded && this.isValid) {
      if(this.renderTargetID !== -1) {
        game.setTextRenderId(this.renderTargetID)
      }

      if(typeof x === 'boolean') {
        game.drawScaleformMovieFullscreen(this.scaleform, 255, 255, 255, 255, false)
      } else {
        game.drawScaleformMovie(this.scaleform, x, y, width, height, 255, 255, 255, 255, 0)
      }

      if(this.renderTargetID !== -1) {
        game.setTextRenderId(1)
      }
    }
  }

  render3D (position, rotation, scale) {
    this.onUpdate()

    if(this.isLoaded && this.isValid) {
      if(this.renderTargetID !== -1) {
        game.setTextRenderId(this.renderTargetID)
      }
      game.drawScaleformMovie3dNonAdditive(this.scaleform, position.x, position.y, position.z, rotation.x, rotation.y, rotation.z, 2, 2, 1, scale.x, scale.y, scale.z, 2)

      if(this.renderTargetID !== -1) {
        game.setTextRenderId(1)
      }
    }
  }

  render3DAdditive (position, rotation, scale) {
    this.onUpdate()
    if(this.isLoaded && this.isValid) {
      if(this.renderTargetID !== -1) {
        game.setTextRenderId(this.renderTargetID)
      }
      game.drawScaleformMovie3d(this.scaleform, position.x, position.y, position.z, rotation.x, rotation.y, rotation.z, 2, 2, 1, scale.x, scale.y, scale.z, 2)
      if(this.renderTargetID !== -1) {
        game.setTextRenderId(1)
      }
    }
  }

  destroy() {
    game.setScaleformMovieAsNoLongerNeeded(this.scaleform)
  }

  /**
   * Create a render target
   * 
   * @param name 
   * @param model 
   */
  createRenderTarget (name, model) {
    let modelHash = game.getHashKey(model)
  
    if(!game.isNamedRendertargetRegistered(name)) {
      game.registerNamedRendertarget(name)
    }
  
    if(!game.isNamedRendertargetLinked(modelHash)) {
      game.linkNamedRendertarget(modelHash)
    }
  
    if(game.isNamedRendertargetRegistered(name)) {
      this.renderTargetID = game.getNamedRendertargetRenderId(name)
    }
  }
}