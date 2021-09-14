import * as EntitySync from "./entitysync";

export { EntitySync };

// ***** EXAMPLE ***** 
// Remove this if you don't want to use the example

import * as alt from "alt-server";
import Textlabel from "./textlabel";
import Ped from "./ped"
import { pedType } from "../utility/misc";
import chat from "../chat/index.js";
import Marker from "./marker";
import { markerTypes } from "../../shared/data/misc";

alt.on("playerConnect", (player) => {
    //player.model = "mp_m_freemode_01";
    //player.spawn(0, 0, 70); // Spawns the player
    player.label = new Textlabel(`~g~${player.name} dołączył`, 4, 0.5, player.pos); // Creates a new textlabel with the player name as the text
    let ped = new Ped("mp_m_freemode_01", pedType.PED_TYPE_NETWORK_PLAYER, new alt.Vector3(216.5933, -809.4857, 30.712), 0);
    let marker = new Marker(markerTypes.VerticalCylinder, new alt.Vector3(218.5933, -809.4857, 30.712), new alt.Vector3(0.0, 0.0, 0.0), new alt.Vector3(0.0, 0.0, 0.0), new alt.Vector3(1.0, 1.0, 1.0), new alt.RGBA(255, 0, 0, 255))
});

console.log("Zaladowano => [server/entitysync/index.js]")