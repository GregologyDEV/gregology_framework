/// <reference types="@altv/types-client" />
/// <reference types="@altv/types-natives" />
import * as alt from 'alt-client'
import * as native from 'natives';
import { showCursor } from "../utility/misc.js"

let isInventoryOpen = false;

var invHUD = new alt.WebView("http://resource/client/inventory/html/index.html");
/*
alt.onServer('inv:createHUD', () => {
    invHUD = new alt.WebView("http://resource/client/inventory/html/index.html");
    //invHUD.focus()
    //alt.showCursor(true);    
});
*/

alt.onServer("inv:updateInventoryHUD", (items) => {
    invHUD.emit("inv_hud:loadInventory", items)
});

alt.onServer("inv:openHUD", openInventoryHUD)

function openInventoryHUD() {
    native.triggerScreenblurFadeIn(500);
    invHUD.emit("inv_hud:showInventory")
    invHUD.focus()
    showCursor(true);
    alt.toggleGameControls(false);
    isInventoryOpen = true;
    alt.Player.local.setMeta("isAnyUIOpen", true)
}

invHUD.on("inv_hud:hideHUD", () => {
    native.triggerScreenblurFadeOut(500);
    invHUD.unfocus()
    showCursor(false);
    alt.toggleGameControls(true);
    isInventoryOpen = false;
    alt.Player.local.setMeta("isAnyUIOpen", false)
});

invHUD.on("inv_hud:useItem", (itemIndex, itemScriptName) => {
    // itemIndex - item index in inventory array
});

invHUD.on("inv_hud:throwOutItem", (itemIndex, itemScriptName, amount) => {
    // itemIndex - item index in inventory array
});

invHUD.on("inv_hud:weaponEquiped", (weapon) => {
    alt.emitServer("inv:equipWeapon", String(weapon))
});

invHUD.on("inv_hud:weaponRemoved", (weapon) => {
    alt.emitServer("inv:removeWeapon", String(weapon))
});

invHUD.on("inv_hud:weaponComponentEquiped", (weapon, component) => {
    if (!weapon || !component || weapon === "") {
        return; 
    } else {
        alt.emitServer("inv:equipComponent", String(weapon), String(component))  
    } 
});

invHUD.on("inv_hud:weaponComponentRemoved", (weapon, component) => {
    if (!weapon || !component || weapon === "") {
        return; 
    } else {
        alt.emitServer("inv:removeWeaponComponent", String(weapon), String(component))  
    } 
});

alt.on("keydown", (key) => {
    if (key === 113 && !alt.Player.local.getMeta("isAnyUIOpen")) { // F2 key
        openInventoryHUD();
    };

    if (key === 27) { // ESC key
        invHUD.emit("inv_hud:forceHideHUD");
    };
})

alt.everyTick(() => {
    if (isInventoryOpen) {
        native.disableControlAction(0, 200, true) // ESC
    }
})