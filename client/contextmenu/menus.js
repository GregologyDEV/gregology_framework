/// <reference types="@altv/types-client" />
/// <reference types="@altv/types-natives" />
import * as alt from 'alt-client'
import * as native from 'natives';
import { showCursor } from "../utility/misc.js"
import { screenToWorld, rotationToDirection } from "../utility/screen2world.js"
import { materials } from "../contextmenu/materials.js"

const raycastFlags = 1 | 2 | 4 | 8 | 16 | 32 | 64 | 128 | 256;
let altKeyDown = false;
let mouseButtonEveryTick;
let disabledKeysEveryTick;
let raycastInfo;
let raycastEndPoint;
let clickScreenCoords;
let lastRayCast = Date.now();
let clickCooldown = Date.now();


function handleMenu() {
    let invalid = false
    if (alt.Player.local.vehicle === null || !alt.Player.local.getSyncedMeta('death') || !alt.Player.local.getMeta('isChatOpened')) invalid = true
    if (invalid) {
        raycastInfo = null;
        raycastEndPoint = null;
        return;
    }

    native.disableControlAction(0, 19, true)
    if (native.isDisabledControlJustReleased(0, 19)) {
        raycastInfo = null;
        raycastEndPoint = null;
        return;
    }

    if (native.isDisabledControlReleased(0, 19)) {
        raycastInfo = null;
        raycastEndPoint = null;
        return;
    }

    native.disableControlAction(0, 1, true) // MOUSE RIGHT
    native.disableControlAction(0, 2, true) // MOUSE DOWN
    native.disableControlAction(0, 24, true) // LEFT MOUSE BUTTON
    native.disableControlAction(0, 25, true) // RIGHT MOUSE BUTTON
    native.disableControlAction(0, 30, true) // MOVE LEFT - RIGHT
    native.disableControlAction(0, 31, true) // MOVE UP - DOWN
    native.disablePlayerFiring(alt.Player.local.scriptID, true);
   
}

alt.on('keydown', (key) => {
    if (key === 18 && alt.Player.local.vehicle === null && !alt.Player.local.getSyncedMeta('death') && !alt.Player.local.getMeta('isChatOpened') && !alt.Player.local.getMeta('isAnyUIOpen')) { // Alt key
        altKeyDown = true
        showCursor(true)/*
        native.disableControlAction(0, 1, true) // MOUSE RIGHT
        native.disableControlAction(0, 2, true) // MOUSE DOWN
        native.disableControlAction(0, 24, true) // LEFT MOUSE BUTTON
        native.disableControlAction(0, 25, true) // RIGHT MOUSE BUTTON
        native.disablePlayerFiring(alt.Player.local.scriptID, true);*/
        //mouseClickHander()
    }
});

alt.on('keyup', (key) => {
    if (key === 18) { // Alt key
        altKeyDown = false
        if (!alt.Player.local.getMeta("isContextMenuOpen")) {
            showCursor(false)    
        }
        //raycastInfo = null;
        //raycastEndPoint = null
        /*native.disableControlAction(0, 1, false) // MOUSE RIGHT
        native.disableControlAction(0, 2, false) // MOUSE DOWN
        native.disableControlAction(0, 24, false) // LEFT MOUSE BUTTON
        native.disableControlAction(0, 25, false) // RIGHT MOUSE BUTTON
        native.disablePlayerFiring(alt.Player.local.scriptID, false);*/
    }
});


//function mouseClickHander() {
    mouseButtonEveryTick = alt.everyTick(() => {
        if (native.isDisabledControlJustReleased(0, 24) && altKeyDown && !alt.Player.local.getMeta("isContextMenuOpen")) {
            if (Date.now() > lastRayCast && Date.now() > clickCooldown) {
                lastRayCast = Date.now() + 50
                startRaycast()
            }
            //alt.log("KLIKLES")
            !altKeyDown
            //alt.clearEveryTick(mouseButtonEveryTick)
        }
    })
//}

disabledKeysEveryTick = alt.everyTick(() => {
    if (altKeyDown) {
        if (!alt.isGameFocused()) {
            altKeyDown = false
            showCursor(false)
        }
        native.disableControlAction(0, 1, true) // MOUSE RIGHT
        native.disableControlAction(0, 2, true) // MOUSE DOWN
        native.disableControlAction(0, 24, true) // LEFT MOUSE BUTTON
        native.disableControlAction(0, 25, true) // RIGHT MOUSE BUTTON
        native.disableControlAction(0, 30, true) // MOVE LEFT - RIGHT
        native.disableControlAction(0, 31, true) // MOVE UP - DOWN
        native.disablePlayerFiring(alt.Player.local.scriptID, true);
    }
})


function startRaycast() {
    const [_, hit, endCoords, surfaceNormal, materialHash, entity] = screenToWorld(raycastFlags, -1)

    //alt.log([_, hit, endCoords, surfaceNormal, entity])
    if (!hit) {
        alt.log("RAYCAST DON'T HIT")
        raycastInfo = null;
        raycastEndPoint = null;
        return;
    }

    const materialName = materials.find((mat) => mat.Hash === materialHash).Name
    const entityType = native.getEntityType(entity)

    raycastInfo = {
        hit,
        endCoords,
        surfaceNormal,
        materialName,
        entity,
        entityType
    };
    raycastEndPoint = endCoords;
    clickScreenCoords = alt.getCursorPos()

    clickCooldown = Date.now() + 1000

    /*
    if (entityType === 0) {
        alt.log("NO ENTITY")
        raycastInfo = {
            hit,
            endCoords,
            surfaceNormal,
            materialName,
            entity,
            entityType
        };
        raycastEndPoint = endCoords;
        return;
    }

    raycastInfo = {
        hit,
        endCoords,
        surfaceNormal,
        materialName,
        entity,
        entityType
    }
    raycastEndPoint = endCoords*/

    alt.emit("raycast:selectedEntity", raycastInfo, clickScreenCoords)
    alt.log(raycastInfo)
}
