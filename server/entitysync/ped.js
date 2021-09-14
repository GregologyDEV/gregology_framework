import * as alt from "alt-server";
import * as EntitySync from "./entitysync.js";
import { pedType } from "../utility/misc.js";

const PED_ENTITY_TYPE = 2;

export default class Ped extends EntitySync.Entity {
    /**
     * Creates instance of Ped
     * @param {string} pedModel 
     * @param {pedType} pedType 
     * @param {alt.Vector3} pos 
     * @param {number} heading 
     * @param {number} dimension 
     */
    constructor (pedModel, pedType, pos, heading, dimension = 0, range = 100) {
        super (PED_ENTITY_TYPE, pos, dimension, {pedModel: pedModel, pedType: pedType, heading: heading}, range)
    }

    get pedModel() {
        return this.getData("pedModel")
    }

    set pedModel(val) {
        this.setData("pedModel", val)
    }

    get pedType() {
        return this.getData("pedType")
    }

    set pedType(val) {
        this.setData("pedType", val)
    }

    get heading() {
        return this.getData("heading")
    }

    set heading(val) {
        this.setData("heading", val)
    }
}