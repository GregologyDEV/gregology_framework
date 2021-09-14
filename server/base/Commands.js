import * as alt from 'alt-server'
import chat from "../chat/index.js";
import { lspd } from "../utility/FactionsHandler.js"
import { getFaction } from "../utility/FactionsHandler.js"
import { isFactionAndGradeValid } from "../utility/FactionsHandler.js"
import { getItem, isItemValid, getMatchingComponentForWeapon } from "../inventory/InventoryItems.js"
import { subVector } from "../utility/functions.js"

chat.registerCmd("revive", (player, args) => {
    if (player.data.adminLvl > 0) {
        if (args[0] !== null && !isNaN(args[0])) {
            let playerToRevive = alt.Player.all.find((player) => player.data.uID == args[0])
            if (playerToRevive !== undefined) {
                playerToRevive.spawn(player.pos.x, player.pos.y, player.pos.z, 0);
                playerToRevive.setSyncedMeta('death', false);
            } else {
                chat.send(player, 'Nie znaleziono gracza');
            }
        } else {
            player.spawn(player.pos.x, player.pos.y, player.pos.z, 0);
            player.setSyncedMeta('death', false);
        }
    } else {
        chat.send(player, 'Nie masz uprawnień do używania tej komendy!');
    }
});

chat.registerCmd("setfaction", (player, args) => {
    let target = alt.Player.all.find((player) => player.data.uID == args[0])
    //alt.log(args[0])
    let isValid = isFactionAndGradeValid(args[1], args[2]);
    setTimeout(() => {
        if (target && args[1] && args[2] && isValid[0] === true && isValid[1] === true) {
            if (player.data.adminLvl > 5) {
                target.data.setfaction(args[1], args[2]);
                chat.send(target, `Ustawiono frakcję na: {00E30A} ${getFaction(args[1]).label} - ${getFaction(args[1]).getGradeLabel(args[2])}`);
                alt.emit("factions:playerFactionChanged", target)
            } else {
                chat.send(player, 'Nie masz uprawnień do używania tej komendy!');
            }
        } else {
            chat.send(player, 'Nieprawidłowy format komendy lub błęda nazwa / stopień lub nie znaleziono gracza');
        }
    }, 400);
});

chat.registerCmd("kill", (player, args) => {
    if (player.data.adminLvl > 0) {
        if (args[0] !== null && !isNaN(args[0])) {
            let playerToKill = alt.Player.all.find((player) => player.data.uID == args[0])
            if (playerToKill !== undefined) {
                playerToKill.health = 0;
            } else {
                chat.send(player, 'Nie znaleziono gracza');
            }
        } else {
            player.health = 0;
        }
    } else {
        chat.send(player, 'Nie masz uprawnień do używania tej komendy!');
    }
});

chat.registerCmd("heal", (player, args) => {
    if (player.data.adminLvl > 0) {
        if (args[0] !== null && !isNaN(args[0])) {
            let playerToKill = alt.Player.all.find((player) => player.data.uID == args[0])
            if (playerToKill !== undefined) {
                playerToKill.health = 200;
                playerToKill.armour = 100;
            } else {
                chat.send(player, 'Nie znaleziono gracza');
            }
        } else {
            player.health = 200;
            player.armour = 100;
        }
    } else {
        chat.send(player, 'Nie masz uprawnień do używania tej komendy!');
    }
});

chat.registerCmd("tp", (player, args) => {
    if (player.data.adminLvl > 0) {
        if (args[0] !== null && args[1] !== null && args[2] !== null && !isNaN(args[0]) && !isNaN(args[1]) && !isNaN(args[2])) {
            player.pos = {x: args[0], y: args[1], z: args[2]}
        }
    } else {
        chat.send(player, 'Nie masz uprawnień do używania tej komendy!');
    }
});

chat.registerCmd("noclip", (player) => {
    if (player.data.adminLvl > 0) {
        alt.emitClient(player, 'base:toggleNoclip');
    } else {
        chat.send(player, 'Nie masz uprawnień do używania tej komendy!');
    }
});

chat.registerCmd("skin", (player) => {
    if (player.data.adminLvl > 0) {
        alt.emitClient(player, 'base:openSkinMenu');
    } else {
        chat.send(player, 'Nie masz uprawnień do używania tej komendy!');
    }
});

chat.registerCmd("pos", (player) => {
    if (player.data.adminLvl > 0) {
        chat.send(player, `${player.pos.x}, ${player.pos.y}, ${player.pos.z}`);
        alt.log(`${player.pos.x}, ${player.pos.y}, ${player.pos.z}`)
    } else {
        chat.send(player, 'Nie masz uprawnień do używania tej komendy!');
    }
});

chat.registerCmd("uid", (player) => {
    chat.send(player, `Twój unikalny identyfikator to: ${player.data.uID}`);
});

chat.registerCmd("inventory", (player) => {
    var x = player.hasItem("firstAidKit", 21);
    alt.setTimeout(() => {
        chat.send(player, `${x}`);
        //chat.send(player, `${player.inventory[0].amount}`);
        console.log(player.inventory)
    }, 1000);
});

chat.registerCmd("radio", (player) => {
    if (player.hasItem("radiophone", 1)) {
        alt.emitClient(player, "radio:openRadiophoneUI")
    } else {
        chat.send(player, "Nie posiadasz radiotelefonu")
    }
});

// /giveitem [target_uID] [itemname] [amount]
chat.registerCmd("giveitem", (player, args) => {
    if (player.data.adminLvl > 0) {
        if (args[0] == null || args[1] == null ||args[2] == null) return chat.send(player, 'Nie podano poprawnych argumentów');
        let playerToFind = alt.Player.all.find((player) => player.data.uID == args[0])
        if (playerToFind == undefined) return chat.send(player, 'Nie znaleziono gracza');
        if (!isItemValid(String(args[1]))) return chat.send(player, 'Nieprawidłowa nazwa przedmiotu');
        if (isNaN(args[2]) || args[2] <= 0) return chat.send(player, 'Nieprawidłowa ilość');
        playerToFind.addItem(String(args[1]), parseInt(args[2]))
    } else {
        chat.send(player, 'Nie masz uprawnień do używania tej komendy!');
    }
});

chat.registerCmd("car", (player, args) => {
    if (player.data.adminLvl > 0) {
        var car = new alt.Vehicle(args[0], player.pos.x, player.pos.y, player.pos.z, player.rot.x, player.rot.y, player.rot.z);
        car.numberPlateText = "AGENT";
        
        setTimeout(function() {
            alt.emitClient(player, "warpIntoVehicle", car)
        }, 800);
    } else {
        chat.send(player, 'Nie masz uprawnień do używania tej komendy!');
    }
});

chat.registerCmd("admin", (player) => {
    var playerAdminLvl = player.data.adminLvl;
    switch(playerAdminLvl) {
        case 0:
            chat.send(player, "Poziom uprawnień: {6CD9FF} UŻYTKOWNIK");
            break;
        case 1:
            chat.send(player, "Poziom uprawnień: {FF2727} TRIAL SUPPORT");
            break;
        case 2:
            chat.send(player, "Poziom uprawnień: {FF2727} SUPPORT");
            break;
        case 3:
            chat.send(player, "Poziom uprawnień: {FF2727} SUPPORT SUPERVISOR");
            break;
        case 4:
            chat.send(player, "Poziom uprawnień: {FF2727} ADMIN");
            break;
        case 5:
            chat.send(player, "Poziom uprawnień: {FF2727} SUPER ADMIN");
            break;
        case 6:
            chat.send(player, "Poziom uprawnień: {FF2727} GAMEMASTER");
            break;
        case 7:
            chat.send(player, "Poziom uprawnień: {FF2727} TECHNIK");
            break;
        case 8:
            chat.send(player, "Poziom uprawnień: {FF2727} DEVELOPER");
            break;
        
    }
});

chat.registerCmd("dv", (player, args) => {
    if (player.data.adminLvl > 0) {
        let radius = 2
        if (args[0] !== null && !isNaN(args[0])) {
            radius = args[0];
        }
        for(let veh of alt.Vehicle.all){
            let vehiclePosVector = new alt.Vector3(veh.pos.x, veh.pos.y, veh.pos.z);
            let playerPosVector = new alt.Vector3(player.pos.x, player.pos.y, player.pos.z);
            let distance = subVector(vehiclePosVector, playerPosVector);
            if (distance.x < radius && distance.y < radius && distance.z < radius) {
                veh.destroy();
            }
        }
    } else {
        chat.send(player, 'Nie masz uprawnień do używania tej komendy!');
    }
    
});

chat.registerCmd("inventory2", (player) => {
    console.log(player.inventory)
    alt.emitClient(player, "inv:openHUD")
});

chat.registerCmd("test", (player) => {
    //player.getByUID(12)
    //alt.log(getMatchingComponentForWeapon("weapon_pistol_mk2", "weaponComponent_suppressor"))
});


console.log("Załadowano => [server/base/Commands.mjs");