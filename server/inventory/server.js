/// <reference types="@altv/types-server" />
import * as alt from 'alt-server'
import { getItem, getMatchingComponentForWeapon } from "./InventoryItems.js"

alt.on("inv:updateInventory", (player) => {
    var playerItems = player.inventory
    var parsedItems = []

    for (let i = 0; i < playerItems.length; i++) {
        var obj = {index: i, scriptName: playerItems[i].itemScriptName, label: getItem(playerItems[i].itemScriptName).label, amount: playerItems[i].amount}
        parsedItems.push(obj)
    }

    alt.emitClient(player, "inv:updateInventoryHUD", parsedItems)
})

alt.onClient('inv:equipWeapon', (player, weapon) => {
    player.giveWeapon(alt.hash(weapon), 255, false)
});

alt.onClient('inv:equipComponent', (player, weapon, component) => {
    const matchingComponent = getMatchingComponentForWeapon(weapon, component)
    //alt.log(matchingComponent, weapon)
    if (matchingComponent) {
        player.addWeaponComponent(alt.hash(weapon.toUpperCase()), alt.hash(matchingComponent))
    } else return;
});

alt.onClient('inv:removeWeaponComponent', (player, weapon, component) => {
    const matchingComponent = getMatchingComponentForWeapon(weapon, component)
    //alt.log(matchingComponent, weapon)
    if (matchingComponent) {
        player.removeWeaponComponent(alt.hash(weapon.toUpperCase()), alt.hash(matchingComponent))
    } else return;
});

alt.onClient('inv:removeWeapon', (player, weapon) => {
    player.removeWeapon(alt.hash(weapon))
});