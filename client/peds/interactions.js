import * as alt from 'alt-client'
import * as native from 'natives';
import { ContextMenu } from "../contextmenu/client.js"
import { distance } from "../utility/misc.js"


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
    let dist = distance(raycastInfo.endCoords, alt.Player.local.pos);
    if (raycastInfo.entityType === 1 && dist < 4) {

    }
});