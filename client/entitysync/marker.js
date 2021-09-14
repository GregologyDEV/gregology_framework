/// <reference types="@altv/types-client" />
/// <reference types="@altv/types-natives" />
import * as alt from 'alt-client'
import * as native from 'natives';
import { markerTypes } from '../../shared/data/misc';
import { Entity } from "./entitysync";


const MARKER_ENTITY_TYPE = 3;

export default class Marker extends Entity {
    constructor (id, type, pos, data) {
        super(id, type, pos, data)
        this.show()
        alt.log(this.data.color)
    }

    get markerType() {
        return this.data.markerType
    }

    get dir() {
        return this.data.dir
    }

    get rot() {
        return this.data.rot
    }

    get color() {
        return new alt.RGBA(this.data.r, this.data.g, this.data.b, this.data.a);
    }

    get scale() {
        return this.data.scale
    }

    show() {
        this._tick = alt.everyTick(this.render.bind(this))
    }

    hide() {
        alt.clearEveryTick(this._tick);
        this._tick = null;
    }

    render() {
        drawMarker(this.markerType, this.pos, this.dir, this.rot, this.scale, this.color)
    }

    destroy() {
        super.destroy()
        if (this._tick) alt.clearEveryTick(this._tick)
    }
}
/**
 * Draw a marker. Requires alt.everyTick or alt.setInterval
 *
 * @param  {markerTypes} type The marker type to draw
 * @param  {alt.Vector3} pos Position
 * @param  {alt.Vector3} dir Direction vector of marker or 0.0 to use rot
 * @param  {alt.Vector3} rot Rotation vector of marker only used if dir is 0.0
 * @param  {alt.Vector3} scale Scale vector of marker
 * @param  {alt.RGBA} color Color of marker in RGBA
 */
 export function drawMarker(type, pos, dir, rot, scale, color) {
    native.drawMarker(
        type,
        pos.x,
        pos.y,
        pos.z,
        dir.x,
        dir.y,
        dir.z,
        rot.x,
        rot.y,
        rot.z,
        scale.x,
        scale.y,
        scale.z,
        color.r,
        color.g,
        color.b,
        color.a,
        false,
        true,
        2,
        false,
        undefined,
        undefined,
        false
    );
}

Entity.addType(MARKER_ENTITY_TYPE, Marker)