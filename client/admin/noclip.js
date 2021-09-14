/// <reference types="@altv/types-client" />
/// <reference types="@altv/types-natives" />
import * as alt from 'alt-client'
import * as native from 'natives';

export default class Noclip {
    static enabled = false;
    static speed = 2.0;
    static everyTick = null;

    static start() {
        if (Noclip.enabled) return;
        Noclip.enabled = true;
        native.freezeEntityPosition(alt.Player.local.scriptID, true);
        this.everyTick = alt.everyTick(Noclip.keyHandler);
    }

    static stop() {
        if (!Noclip.enabled) return;
        Noclip.enabled = false;
        native.freezeEntityPosition(alt.Player.local.scriptID, false);
        alt.clearEveryTick(this.everyTick);
    }

    static KEYS = {
        FOWARD: 32,
        BACKWARD: 33,
        LEFT: 34,
        RIGHT: 35,
        UP: 22,
        DOWN: 36,
        SHIFT: 21,
    }

    static keyHandler() {
        let currentPos = alt.Player.local.pos;
        let speed = Noclip.speed;
        let rot = native.getGameplayCamRot(2);
        let dirForward = camVectorForward(rot);
        let dirRight = camVectorRight(rot);

        if (native.isDisabledControlPressed(0, Noclip.KEYS.SHIFT)) {
            speed = speed * 5
        }
        if (native.isDisabledControlPressed(0, Noclip.KEYS.FOWARD)) {
            currentPos = addSpeedToVector(currentPos, dirForward, speed)
        }
        if (native.isDisabledControlPressed(0, Noclip.KEYS.BACKWARD)) {
            currentPos = addSpeedToVector(currentPos, dirForward, -speed)
        }
        if (native.isDisabledControlPressed(0, Noclip.KEYS.LEFT)) {
            currentPos = addSpeedToVector(currentPos, dirForward, -speed, true)
        }
        if (native.isDisabledControlPressed(0, Noclip.KEYS.RIGHT)) {
            currentPos = addSpeedToVector(currentPos, dirForward, speed, true)
        }
        let zModifier = 0;
        if (native.isDisabledControlPressed(0, Noclip.KEYS.UP)) {
            zModifier += speed;
        }
        if (native.isDisabledControlPressed(0, Noclip.KEYS.DOWN)) {
            zModifier -= speed;
        }

        if (!isVectorEqual(new alt.Vector3(currentPos.x, currentPos.y, currentPos.z + zModifier), alt.Player.local.pos)) {
            alt.emitServer("noclip:setPos", currentPos.x, currentPos.y, currentPos.z + zModifier)
        }
    }
}

function addSpeedToVector(vec1, vec2, speed, lr = false) {
    return new alt.Vector3(
        vec1.x + vec2.x * speed,
        vec1.y + vec2.y * speed,
        lr === true ? vec1.z : vec1.z + vec2.z * speed
    )
}

function camVectorForward(camRot) {
    let rotInRad = {
        x: camRot.x * (Math.PI / 180),
        y: camRot.y * (Math.PI / 180),
        z: camRot.z * (Math.PI / 180) + Math.PI / 2,
    };

    let camDir = {
        x: Math.cos(rotInRad.z),
        y: Math.sin(rotInRad.z),
        z: Math.sin(rotInRad.x)
    }

    return camDir;
}

function camVectorRight(camRot) {
    let rotInRad = {
        x: camRot.x * (Math.PI / 180),
        y: camRot.y * (Math.PI / 180),
        z: camRot.z * (Math.PI / 180),
    };

    let camDir = {
        x: Math.cos(rotInRad.z),
        y: Math.sin(rotInRad.z),
        z: Math.sin(rotInRad.x)
    }

    return camDir;
}

function isVectorEqual(vec1, vec2) {
    return (vec1.x === vec2.x && vec1.y === vec2.y && vec1.z === vec2.z);
}

alt.on("keydown", (key) => {
    // Key = F1
    if (key === 112) {
        if (!Noclip.enabled) {
            Noclip.start();
        } else {
            Noclip.stop();
        }
    }
})