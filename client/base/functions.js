import * as alt from 'alt-client'
import * as native from 'natives';

export function getVehicleInDirection(coordFrom, coordTo) {
    let rayHandle = native.startShapeTestRay(coordFrom.x, coordFrom.y, coordFrom.z, coordTo.x, coordTo.y, coordTo.z, 10, native.getPlayerPed(-1), 0);
    let _, _, _, _, vehicle = native.getShapeTestResult(rayHandle);
    return vehicle
}
