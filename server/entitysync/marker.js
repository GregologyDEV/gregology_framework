import * as alt from "alt-server";
import * as EntitySync from "./entitysync.js";
import { markerTypes } from "../../shared/data/misc.js";

const MARKER_ENTITY_TYPE = 3;

export default class Marker extends EntitySync.Entity {
    /**
     * Creates instance of Marker
     * @param {markerTypes} markerType 
     * @param {alt.Vector3} pos 
     * @param {alt.Vector3} dir 
     * @param {alt.Vector3} rot 
     * @param {alt.Vector3} scale 
     * @param {alt.RGBA} color 
     */
    constructor (markerType, pos, dir, rot, scale, color, dimension = 0, range = 100) {
        super(MARKER_ENTITY_TYPE, pos, dimension, {markerType: markerType, dir: dir, rot: rot, scale: scale, r: color.r, g: color.g, b: color.b, a: color.a}, range)
    }

    get markerType() {
        return this.getData("markerType")
    }

    /**
     * @param {markerTypes} val 
     */
    set markerType(val) {
        this.setData("markerType", val)
    }

    get dir() {
        return this.getData("dir")
    }

    /**
     * @param {alt.Vector3} val 
     */
    set dir(val) {
        this.setData("dir", val)
    }

    get rot() {
        return this.getData("rot")
    }
    /**
     * @param {alt.Vector3} val 
     */
    set rot(val) {
        this.setData("rot", val)
    }

    get color() {
        return new alt.RGBA(
            this.getData("r"),
            this.getData("g"),
            this.getData("b"),
            this.getData("a")
        );
    }

    /**
     * @param {alt.RGBA} val 
     */
    set color(val) {
        this.setData("r", val.r),
        this.setData("g", val.g),
        this.setData("b", val.b),
        this.setData("a", val.a)
    }

    get scale() {
        return this.getData("scale")
    }

    /**
     * @param {alt.Vector3} val 
     */
    set scale(val) {
        this.setData("scale", val)
    }
}