/// <reference types="@altv/types-client" />
/// <reference types="@altv/types-natives" />
import * as alt from 'alt-client'
import * as native from 'natives';
import * as skinMenu from "./skinMenu.js"
import { getVehiclePlateType } from "../utility/misc.js"

var noclip = false;


//const userUIPage = new alt.WebView("http://resource/client/base/html/user_info.html");

/*
alt.onServer('openUserUI', () => {
    userUIPage.focus();
});
*/

alt.onServer("UserUI_content", (player_char_fullname, player_cash, player_bank) => {
    alt.log("UserUI_content")
    alt.log(player_char_fullname);
    let uID = alt.Player.local.getSyncedMeta('uID');
    //alt.log(uID);
    native.displayCash(true);
    

    //userUIPage.emit("update_char_info", uID, player_char_fullname, player_cash, player_bank);
});


alt.onServer("warpIntoVehicle", (car) => {
    native.setPedIntoVehicle(alt.Player.local.scriptID, car.scriptID, -1);
});

// r, g, b, a
const moneyColor = [97, 175, 97, 255];
const bankColor = []
const moneyNegativeColor = [224, 50, 50, 255];
const moneyChangePlus = [240, 240, 240, 255];
const moneyChangeMinus = [194, 80, 80, 255];
const drawX = 0.9999;
const drawY = 0.04;
const fontScale = 0.562;
const diffDisplayTime = 3500; // in milliseconds
let currentMoney = 0;
let currentMoneyText = "$0";
let changeColor = moneyChangePlus;
let changeText = "";
let changeTime = 0;


function drawText(text, posX, posY, font, color, scale) {
    native.beginTextCommandDisplayText("STRING");
    native.addTextComponentSubstringPlayerName(text);
    native.setTextFont(font);
    native.setTextScale(scale, scale);
    native.setTextColour(color[0], color[1], color[2], color[3]);
    native.setTextRightJustify(true);
    native.setTextWrap(0, posX);
    native.setTextOutline();
    native.setTextDropShadow();
    native.endTextCommandDisplayText(posX, posY, 0);
}

/*
alt.everyTick(() => {
    native.hideHudComponentThisFrame(3); // HUD_CASH

    let safeZone = native.getSafeZoneSize();
    let finalDrawX = drawX - (1.0 - safeZone) * 0.5;
    let finalDrawY = drawY + (1.0 - safeZone) * 0.5;

    drawText(currentMoneyText, finalDrawX, finalDrawY, 7, (currentMoney < 0) ? moneyNegativeColor : moneyColor, fontScale)
});
*/

/*
alt.setInterval(() => { 
    alt.emit("everySecondEvent");
}, 1000);


alt.on("everySecondEvent", () => {
    alt.log("Co sekunde sie pokazuje");
});
*/

alt.onServer('base:toggleNoclip', () => {
    noclip = !noclip
});



console.log(`Załadowano => [client/base/client.mjs]`)