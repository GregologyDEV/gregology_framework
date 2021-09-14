import * as alt from "alt-client";
import * as native from "natives";
import { Entity } from "./entitysync";

const PED_ENTITY_TYPE = 2;

export default class Ped extends Entity {
    constructor(id, type, pos, data) {
        super(id, type, pos, data);
        this.show()
    }

    get pedModel() {
        return this.data.pedModel;
    }

    get pedType() {
        return this.data.pedType;
    }

    get heading() {
        return this.data.heading;
    }

    destroy() {
        super.destroy()
    }

    show() {
        this._scriptID = native.createPed(this.data.pedType, alt.hash(this.data.pedModel), this.pos.x, this.pos.y, this.pos.z, this.data.heading, false, false)
        // this.data.scriptID = this._scriptID;
        // super.data = this.data
        // alt.log(JSON.stringify(super.data))
    }

    hide() {
        native.deletePed(this._scriptID)
    }
}

Entity.addType(PED_ENTITY_TYPE, Ped)