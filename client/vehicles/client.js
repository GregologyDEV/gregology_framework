import * as alt from 'alt-client'
import * as native from 'natives';
import { getEntityFromRaycast } from "../utility/raycast.js"
import { ContextMenu } from "../contextmenu/client.js"
import { distance } from "../utility/misc.js"

const vehicleDoorsBonesLabelNames = {
    "handle_dside_f": "drzwi kierowcy",
    "handle_pside_f": "drzwi pasażera z przodu",
    "handle_dside_r": "drzwi pasażera tylne lewe",
    "handle_pside_r": "drzwi pasażera tylne prawe",
    "bonnet": "maskę pojazdu",
    "boot": "bagażnik"
}


const vehicleMenuOptions = [
    /*{
        name: "Otwórz drzwi", 
        eventName: "openClosestDoor"
    }*/
]
const vehicleMenu = new ContextMenu("Pojazd", "vehicle", vehicleMenuOptions)
let selectedVehicle;
let lastRaycastInfo;

/*
raycastInfo = {
    hit,
    endCoords,
    surfaceNormal,
    materialName,
    entity,
    entityType
};*/
alt.on("raycast:selectedEntity", (raycastInfo, clickScreenCoords) => {
    let distanceToVehicle = distance(raycastInfo.endCoords, alt.Player.local.pos)
    if (raycastInfo.entityType === 2 && distanceToVehicle < 5) {
        let closestDoor = getClosestDoor(raycastInfo.entity, raycastInfo.endCoords)
        let openDoorOption = {name: `Otwórz ${vehicleDoorsBonesLabelNames[closestDoor]}`, eventName: "openClosestDoor"}
        vehicleMenu.addOption(`Otwórz ${vehicleDoorsBonesLabelNames[closestDoor]}`, "openClosestDoor") 
        //alt.Player.local.setMeta("isContextMenuOpen", true)
        vehicleMenu.open(clickScreenCoords.x, clickScreenCoords.y);
        lastRaycastInfo = raycastInfo
        selectedVehicle = raycastInfo.entity
    }
});

const vehicleDoorsBones = [
    "handle_dside_f",
    "handle_pside_f",
    "handle_dside_r",
    "handle_pside_r",
    "bonnet",
    "boot"
]

alt.on("vehicle:openClosestDoor", () => {
    let closestDoor = getClosestDoor(selectedVehicle, lastRaycastInfo.endCoords)
    switch (closestDoor) {
        case "handle_dside_f":
            native.taskOpenVehicleDoor(alt.Player.local.scriptID, selectedVehicle, -1, -1, 1);
            break;
        
        case "handle_pside_f":
            native.taskOpenVehicleDoor(alt.Player.local.scriptID, selectedVehicle, -1, 0, 1);
            break;
        
        case "handle_dside_r":
            native.taskOpenVehicleDoor(alt.Player.local.scriptID, selectedVehicle, -1, 1, 1);
            break;

        case "handle_pside_r":
            native.taskOpenVehicleDoor(alt.Player.local.scriptID, selectedVehicle, -1, 2, 1);
            break;

        case "bonnet":
            //
            break;

        case "boot":
            //
            break;
    }
    vehicleMenu.removeOption("openClosestDoor")
    vehicleMenu.close()
    //getClosestDoor(selectedVehicle, lastRaycastInfo.endCoords)
    //alt.log(getClosestDoor(selectedVehicle, lastRaycastInfo.endCoords))
})

alt.on("vehicle:nothingSelected", () => {
    vehicleMenu.removeOption("openClosestDoor")
    vehicleMenu.close()
    //alt.log("NOTHING SELECTED")
})

alt.on("keydown", (key) => {
    if (key === 27) { // ESC key
        vehicleMenu.removeOption("openClosestDoor")
        vehicleMenu.close()
    };
})


function getClosestDoor(vehicleScriptID, rayCoords) {
    let closest;
    let lastDistance = 100;
    
    for (let bone of vehicleDoorsBones) {
        let boneIndex = native.getEntityBoneIndexByName(vehicleScriptID, bone.toString())
        let coords = native.getWorldPositionOfEntityBone(vehicleScriptID, boneIndex)
        let distanceRayToDoor = distance(rayCoords, coords)
        if (distanceRayToDoor < lastDistance) {
            lastDistance = distanceRayToDoor;
            closest = bone;
        }
        //alt.log(coords)
    }

    return closest
}














/*
let vehicle = undefined;
let fl_door_position
let can_open_door = false


alt.everyTick(() => {
    vehicle = getEntityFromRaycast(2, true);
    if (vehicle !== undefined) {
        var fl_door_boneIndex = native.getEntityBoneIndexByName(vehicle.scriptID, "door_dside_f");
        fl_door_position = native.getWorldPositionOfEntityBone(vehicle.scriptID, fl_door_boneIndex);
        let [_, screenResX, screenResY] = native.getActiveScreenResolution(0, 0);
        let centerX = screenResX/2;
        let centerY = screenResY/2;
        let [bool, screenCoordX, screenCoordY] = native.getScreenCoordFromWorldCoord(fl_door_position.x, fl_door_position.y, fl_door_position.z, 0, 0);
        let distanceToVehicle = native.getDistanceBetweenCoords(alt.Player.local.pos.x, alt.Player.local.pos.y, alt.Player.local.pos.z, vehicle.pos.x, vehicle.pos.y, vehicle.pos.z, false);
        if (screenCoordX > 0.45 && screenCoordX < 0.60 && screenCoordY > 0.40 && screenCoordY < 0.60 && distanceToVehicle < 3) {
            renderIcon();
            can_open_door = true
        } else {
            can_open_door = false
        }
        //alt.log(distanceToVehicle);
        // basejumping / arrow_pointer

    } else {
        return;
    }
});

alt.on('keydown', (key) => {
    if (key === 88 && can_open_door === true) {
        native.taskOpenVehicleDoor(alt.Player.local.scriptID, vehicle.scriptID, -1, 0, 10);
    }
});

function renderIcon() {
    if (!native.hasStreamedTextureDictLoaded("basejumping")) {
        native.requestStreamedTextureDict("basejumping", true);
    }
    if (native.hasStreamedTextureDictLoaded("basejumping")) {
        native.drawSprite("basejumping", "arrow_pointer", 0.5, 0.5, 0.006, 0.01, 0, 255, 255, 255, 100);
    }
}*/