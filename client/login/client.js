/// <reference types="@altv/types-client" />
/// <reference types="@altv/types-natives" />
import * as alt from 'alt-client'
import * as native from "natives";
import { Camera } from '../utility/camera.js';

var charInfoCreator = undefined;
let camera
var isCutscenePlaing = false;


const cameraPoint = {
    x: -763.26,
    y: 328.72,
    z: 199.99
};

//const panel = new alt.WebView("http://resource/client/login/html/index.html");

let discordAuthView;
let discordURL;


alt.onServer('panelLogowania', () => {
    showPanel();
    //alt.log("Panel Logowania");
});

alt.on('auth:Authorize', handleDiscordAuth);
alt.onServer('auth:Authorize', handleDiscordAuth);
alt.on("auth:exitAuth", handleExitAuth)
alt.onServer("auth:exitAuth", handleExitAuth)

function handleDiscordAuth(url){
    //alt.log(url)
    if (discordAuthView && discordAuthView.destroy) {
        discordAuthView.destroy()
    }

    discordURL = url
    discordAuthView = new alt.WebView('http://resource/client/login/html/discord_auth/index.html');
    discordAuthView.focus()

    discordAuthView.on("auth:ready", () => {
        if (!discordAuthView) {
            return;
        }
        discordAuthView.emit("auth:ready", discordURL);
        discordAuthView.focus()
        //alt.log(discordURL)
    });

    discordAuthView.on("auth:noURL", () => {
        discordAuthView.emit("auth:ready", discordURL);
        discordAuthView.focus()
    });
    
    alt.showCursor(true);
/*
    alt.setTimeout(() => { 
        discordAuthView.on("auth:ready", () => {
            if (!discordAuthView) {
                return;
            }
            discordAuthView.emit("auth:ready", discordURL);
            //alt.log(discordURL)
        });
        alt.showCursor(true);
    }, 15);*/
}

function handleExitAuth() {
    if (discordAuthView && discordAuthView.destroy) {
        discordAuthView.unfocus()
        discordAuthView.destroy()
    }
    alt.showCursor(false);
    alt.Player.local.setMeta("isAnyUIOpen", false)
}

alt.onServer("openCharInfoCreator", () => {
    charInfoCreator = new alt.WebView("http://resource/client/login/html/char_info/index.html");
    charInfoCreator.focus();
    alt.showCursor(true);

    camera = new Camera(cameraPoint, 28);
    camera.pointAtBone(alt.Player.local.scriptID, 31086, 0.05, 1.0, 0.0);
    camera.playerControlsEntity(alt.Player.local.scriptID, true);
    let camOnFace = false;

    let maleModel = native.getHashKey("mp_m_freemode_01");
    let femaleModel = native.getHashKey("mp_f_freemode_01");
    native.requestModel(maleModel);
    native.requestModel(femaleModel);
    alt.loadModel(maleModel);
    alt.loadModel(femaleModel);


    native.networkOverrideClockTime(12, 0, 0);
    native.requestIpl("apa_v_mp_h_08_b");
    const position = new alt.Vector3(-763.678, 330.319, 198.486);
    native.setEntityCoords(alt.Player.local.scriptID, -763.678, 330.319, 198.486, true, false, false, false);
    native.setEntityRotation(alt.Player.local.scriptID, 0, 0, 180, 2, true);
    native.freezeEntityPosition(alt.Player.local.scriptID, true);
    native.disableAllControlActions(0);
    native.clearPedTasksImmediately(alt.Player.local.scriptID);
    
    native.setPedDefaultComponentVariation(alt.Player.local.scriptID);
    native.clearPedBloodDamage(alt.Player.local.scriptID);
    native.clearPedDecorations(alt.Player.local.scriptID);
    native.setPedHeadBlendData(alt.Player.local.scriptID, 0, 0, 0, 0, 0, 0, 0, 0, 0, false);

    //var isVisible = charInfoCreator.isVisible();
    
    // if (isVisible === true) {
    //     alt.showCursor(true);
    // }

    //Tu ma isc event ktory ustawi slidery, radia i inne na takie jakie ma postac

    charInfoCreator.on("documentReady", (gender) => {
        /*
        let makeupColors = native.getNumMakeupColors();
        let i
        for (i = 0; i <= makeupColors; i++) {
            let [_, r, g, b] = native.getPedMakeupRgbColor(i);
            //alt.log(r, g, b);

            //charInfoCreator.emit("insertMakeupColor", i, r, g, b);
        }

        let hairColors = native.getNumHairColors();
        let h
        for (h = 0; h <= hairColors; h++) {
            let [_, r, g, b] = native.getPedHairRgbColor(h);
            //alt.log(h, r, g, b);
            //charInfoCreator.emit("insertHairColor", h, r, g, b);
        }
        */

        //let maxOverlay = native.getNumHeadOverlayValues(2);

        //alt.log(`BRWI: ${maxOverlay}`);

    });


    charInfoCreator.on("register_player_character", (char_firstname, char_lastname, char_birthdate, char_height, char_weight, char_sex, char_info) => {
        let PlayerClothes = savePlayerClothes()
        //alt.log(char_firstname, char_lastname, char_birthdate, char_height, char_weight, char_sex, char_info, PlayerClothes)
        alt.emitServer("register_player_character_server", char_firstname, char_lastname, char_birthdate, char_height, char_weight, char_sex, char_info, PlayerClothes);
    });

    charInfoCreator.on("changeSex", (gender) => {
        
        var playerGender = String(gender)

        if (playerGender == "male") {
            let model = native.getHashKey("mp_m_freemode_01");
            native.setPlayerModel(alt.Player.local.scriptID, model);
            //player.model = "mp_m_freemode_01";
        } else {
            let model = native.getHashKey("mp_f_freemode_01");
            native.setPlayerModel(alt.Player.local.scriptID, model);
            //player.model = "mp_f_freemode_01";
        }
        
        native.setPedHeadBlendData(alt.Player.local.scriptID, 0, 0, 0, 0, 0, 0, 0, 0, 0, false);

        //alt.emitServer("changeSexServer", gender);
    });

    charInfoCreator.on("updatePedHeadBlendData", (dadFace, momFace, podobienstwo, kolorSkory) => {
        //alt.log("updateSetPedHeadBlendData");  alt.Player.local.scriptID
    
        //let playerPed = native.getPlayerPed(-1);
        let playerModel = native.getEntityModel(alt.Player.local.scriptID);
        //alt.log(playerModel);
        //alt.log(playerPed, dadFace, momFace, dadFace, kolorSkory, kolorSkory, kolorSkory, podobienstwo * 0.1, podobienstwo * 0.1, 1.0);

        if (playerModel == "2627665880") { //baba
            native.setPedHeadBlendData(alt.Player.local.scriptID, momFace, dadFace, momFace, kolorSkory, kolorSkory, kolorSkory, podobienstwo * 0.01, podobienstwo * 0.01, 0.0, false);
            setMaxComponetVariarions()
        } else { //chlop
            native.setPedHeadBlendData(alt.Player.local.scriptID, dadFace, momFace, dadFace, kolorSkory, kolorSkory, kolorSkory, podobienstwo * 0.01, podobienstwo * 0.01, 0.0, false);
            setMaxComponetVariarions()
        }        
    });

    charInfoCreator.on("updatePedHair", (hairStyle) => {
        let playerPed = native.getPlayerPed(-1);
        native.setPedComponentVariation(playerPed, 2, hairStyle, 0, 2);
    });

    charInfoCreator.on("updatePedHairColor", (hairColor) => {
        let playerPed = native.getPlayerPed(-1);
        native.setPedHairColor(playerPed, hairColor, hairColor);
        //alt.log(playerPed, hairColor)
    });

    charInfoCreator.on("updatePedEyeColor", (eyeColor) => {
        let playerPed = native.getPlayerPed(-1);
        native.setPedEyeColor(playerPed, eyeColor);
    });

    charInfoCreator.on("updatePedRumience", (rumience, rumienceIntensywnosc) => {
        let playerPed = native.getPlayerPed(-1);
        native.setPedHeadOverlay(alt.Player.local.scriptID, 5, rumience, rumienceIntensywnosc * 0.1)
    });

    charInfoCreator.on("updatePedRumienceColor", (rumienceColor) => {
        let playerPed = native.getPlayerPed(-1);
        native.setPedHeadOverlayColor(alt.Player.local.scriptID, 5, 2, rumienceColor, rumienceColor)
    });

    charInfoCreator.on("updatePedSkazy", (skazy, skazyIntenstywnosc) => {
        let playerPed = native.getPlayerPed(-1);
        native.setPedHeadOverlay(alt.Player.local.scriptID, 0, skazy, skazyIntenstywnosc * 0.1);
    });

    charInfoCreator.on("updatePedZmarszczki", (zmarszczki, zmarszczkiIntenstywnosc) => {
        let playerPed = native.getPlayerPed(-1);
        //native.setPedHeadOverlay(alt.Player.local.scriptID, 0, zmarszczki, zmarszczkiIntenstywnosc * 0.1); jaki overlayID?
    });

    charInfoCreator.on("updatePedPiegi", (piegi, piegiIntensywnosc) => {
        let playerPed = native.getPlayerPed(-1);
        native.setPedHeadOverlay(alt.Player.local.scriptID, 9, piegi, piegiIntensywnosc * 0.1);
    });

    charInfoCreator.on("updatePedMakijaz", (makijaz, makijazIntenstywnosc) => {
        let playerPed = native.getPlayerPed(-1);
        native.setPedHeadOverlay(alt.Player.local.scriptID, 4, makijaz, makijazIntenstywnosc * 0.1);
    });
    
    charInfoCreator.on("updatePedSzminka", (szminka, szminkaIntenstywnosc) => {
        let playerPed = native.getPlayerPed(-1);
        native.setPedHeadOverlay(alt.Player.local.scriptID, 8, szminka, szminkaIntenstywnosc * 0.1);
    });

    charInfoCreator.on("updatePedMakeupColor", (makeupColor) => {
        let playerPed = native.getPlayerPed(alt.Player.local.scriptID);
        native.setPedHeadOverlayColor(alt.Player.local.scriptID, 8, 2, makeupColor, makeupColor);
        //alt.log("Otrzymano: updatePedMakeupColor");
    });

    charInfoCreator.on("updatePedBrwi", (brwi, brwiGrubosc) => {
        let playerPed = native.getPlayerPed(-1);
        native.setPedHeadOverlay(alt.Player.local.scriptID, 2, brwi, brwiGrubosc * 0.1);
    });

    charInfoCreator.on("updatePedBrwiColor", (kolor) => {
        let playerPed = native.getPlayerPed(-1);
        native.setPedHeadOverlayColor(alt.Player.local.scriptID, 2, 1, kolor, kolor);
    });

    charInfoCreator.on("updatePedBroda", (broda, brodaGestosc) => {
        let playerPed = native.getPlayerPed(-1);
        native.setPedHeadOverlay(alt.Player.local.scriptID, 1, broda, brodaGestosc * 0.1);
    });

    charInfoCreator.on("updatePedBrodaColor", (brodaColor) => {
        let playerPed = native.getPlayerPed(-1);
        native.setPedHeadOverlayColor(alt.Player.local.scriptID, 1, 1, brodaColor, brodaColor);
    });

    charInfoCreator.on("updatePedPostarzenie", (postarzenie, postarzenieIntensywnosc) => {
        let playerPed = native.getPlayerPed(-1);
        native.setPedHeadOverlay(alt.Player.local.scriptID, 3, postarzenie, postarzenieIntensywnosc * 0.1);
    });

    charInfoCreator.on("updatePedComponent", (componetID, drawableID) => {
        native.setPedComponentVariation(alt.Player.local.scriptID, componetID, drawableID, 0, 0);

        let maxComponentTextures = native.getNumberOfPedTextureVariations(alt.Player.local.scriptID, componetID, drawableID);
        charInfoCreator.emit("setMaxNumberOfPedTextureVariations", componetID, drawableID, maxComponentTextures);
    });

    charInfoCreator.on("updatePedComponentVariations", (componetID, drawableID, textureID) => {
        native.setPedComponentVariation(alt.Player.local.scriptID, componetID, drawableID, textureID, 0);
    });

    charInfoCreator.on("updatePedProp", (componetID, drawableID) => {
        native.setPedPropIndex(alt.Player.local.scriptID, componetID, drawableID, 0, true);

        let maxComponentTextures = native.getNumberOfPedPropTextureVariations(alt.Player.local.scriptID, componetID, drawableID);
        charInfoCreator.emit("setMaxNumberOfPedPropTextureVariations", componetID, drawableID, maxComponentTextures);
    });

    charInfoCreator.on("updatePedPropVariations", (componetID, drawableID, textureID) => {
        native.setPedPropIndex(alt.Player.local.scriptID, componetID, drawableID, textureID, true);
    });

    charInfoCreator.on("setPedRotation", (rotation) => {
        native.setEntityHeading(alt.Player.local.scriptID, rotation);
    });

    charInfoCreator.on("setPedCamHeight", (height) => {
        let zPos = parseFloat(height) * 0.01
        if (!camOnFace) {
            camera.position(cameraPoint.x, cameraPoint.y, cameraPoint.z + zPos)
        }
    });

    charInfoCreator.on("changeCameraEntity", () => {
        camera.pointAtEntity(alt.Player.local.scriptID, 0.0, 0.0, 0.0);
        camera.fov(60);
        camOnFace = false;
    });

    charInfoCreator.on("changeCameraTwarz", () => {
        camera.pointAtBone(alt.Player.local.scriptID, 31086, 0.05, 0.0, 0.0);
        camera.fov(30);
        camOnFace = true;
    });

    alt.on('keydown', (key) => {
        if (key === 82) { // R
            //charInfoCreator.emit("reload");
            //savePlayerApperance();
        }
    });

    

    function setMaxComponetVariarions() {
        let maxTorso = native.getNumberOfPedDrawableVariations(alt.Player.local.scriptID, 3);
        let maxLegs = native.getNumberOfPedDrawableVariations(alt.Player.local.scriptID, 4);
        let maxBags = native.getNumberOfPedDrawableVariations(alt.Player.local.scriptID, 5);
        let maxShoes = native.getNumberOfPedDrawableVariations(alt.Player.local.scriptID, 6);
        let maxAccesories = native.getNumberOfPedDrawableVariations(alt.Player.local.scriptID, 7);
        let maxUndershirts = native.getNumberOfPedDrawableVariations(alt.Player.local.scriptID, 8);
        let maxArmors = native.getNumberOfPedDrawableVariations(alt.Player.local.scriptID, 9);
        let maxDecals = native.getNumberOfPedDrawableVariations(alt.Player.local.scriptID, 10);
        let maxTops = native.getNumberOfPedDrawableVariations(alt.Player.local.scriptID, 11);     
        let maxHats = native.getNumberOfPedPropDrawableVariations(alt.Player.local.scriptID, 0);
        let maxGlasses = native.getNumberOfPedPropDrawableVariations(alt.Player.local.scriptID, 1);
        let maxEars = native.getNumberOfPedPropDrawableVariations(alt.Player.local.scriptID, 2);
        let maxHairs = native.getNumberOfPedDrawableVariations(alt.Player.local.scriptID, 2);

        let stringify = {maxTorso: maxTorso, maxLegs: maxLegs, maxBags: maxBags, maxShoes: maxShoes, maxAccesories: maxAccesories, maxUndershirts: maxUndershirts, maxArmors: maxArmors, maxDecals: maxDecals, maxTops: maxTops, maxHats: maxHats, maxGlasses: maxGlasses, maxEars: maxEars, maxHairs: maxHairs};
        let maxValues2 = JSON.stringify(stringify);
        //let maxValues = JSON.parse(`{"maxTorso"}:${maxTorso}, {"maxLegs"}:${maxLegs}, {"maxBags"}:${maxBags}, {"maxShoes"}:${maxShoes}, {"maxAccesories"}:${maxAccesories}, {"maxUndershirts"}:${maxUndershirts}, {"maxArmors"}:${maxArmors}, {"maxDecals"}:${maxDecals}, {"maxTops"}:${maxTops}, {"maxHats"}:${maxHats}, {"maxGlasses"}:${maxGlasses}, {"maxEars"}:${maxEars}, {"maxHairs"}:${maxHairs}`);

        charInfoCreator.emit("setMaxComponetVariarions", maxValues2);
    }    
});


alt.onServer("zamknijPanel", () => {
    //native.doScreenFadeIn(300);
    alt.showCursor(false);
    panel.unfocus();
    panel.destroy();
    //native.doScreenFadeOut(300);
});

alt.onServer("zamknijPanelPostaci", () => {
    alt.showCursor(false);
    charInfoCreator.unfocus();
    charInfoCreator.destroy();
    charInfoCreator = undefined;
    native.freezeEntityPosition(alt.Player.local.scriptID, false);
    native.enableAllControlActions(0);
    camera.destroy();
    native.setEntityCoords(alt.Player.local.scriptID, 159.91, -907.05, 30.63, true, false, false, false);

    /*
    if (!isCutscenePlaing) {
        taxiCutscene();
    }
    */

});

// alt.on("update", () => {
//      if (panelActive) {
//          game.showCursorThisFrame();
//      }
// });

alt.onServer("grl_login:nieznany_blad", () => {
    panel.emit("nieznany_blad");
});

alt.onServer("login_zajety", () => {
    panel.emit("loginNiedostepnyAlert");
});

alt.onServer("loginError", () => {
   panel.emit("loginError") 
});

alt.onServer("zarejestrowano", () => {
    panel.emit("zarejestrowano") 
    
});

alt.onServer('grl_login:setPlayerPedApperance', (char_sex, char_skinJSON, char_clothesJSON) => {
    //alt.log("grl_login:setPlayerPedApperance")
    var char_skin = JSON.parse(char_skinJSON);
    var char_clothes = JSON.parse(char_clothesJSON);
    //let maleModel = native.getHashKey("mp_m_freemode_01");
    //let femaleModel = native.getHashKey("mp_f_freemode_01");
    let playerSex = char_sex.toString();
    //native.requestModel(maleModel);
    //native.requestModel(femaleModel);
    switch (playerSex) {
        case "male":
            //native.setPlayerModel(alt.Player.local.scriptID, maleModel);
            native.setPedHeadBlendData(alt.Player.local.scriptID, parseInt(char_skin.dadFace), parseInt(char_skin.momFace), parseInt(char_skin.dadFace), parseInt(char_skin.kolorSkory), parseInt(char_skin.kolorSkory), parseInt(char_skin.kolorSkory), parseInt(char_skin.podobienstwo) * 0.01, parseInt(char_skin.podobienstwo) * 0.01, 0.0, false);
            alt.setTimeout(() => {
                native.setPedComponentVariation(alt.Player.local.scriptID, 2, parseInt(char_skin.hair), 0, 2);
                native.setPedHairColor(alt.Player.local.scriptID, parseInt(char_skin.hairColor), parseInt(char_skin.hairColor));
                native.setPedEyeColor(alt.Player.local.scriptID, parseInt(char_skin.eyeColor));
                native.setPedHeadOverlay(alt.Player.local.scriptID, 5, parseInt(char_skin.rumience), parseInt(char_skin.rumienceOpacity) * 0.1);
                native.setPedHeadOverlayColor(alt.Player.local.scriptID, 5, 2, parseInt(char_skin.rumienceColor), parseInt(char_skin.rumienceColor));
                native.setPedHeadOverlay(alt.Player.local.scriptID, 0, parseInt(char_skin.skazy), parseInt(char_skin.skazyIntenstywnosc) * 0.1);
                native.setPedHeadOverlay(alt.Player.local.scriptID, 9, parseInt(char_skin.piegi), parseInt(char_skin.piegiIntensywnosc) * 0.1);
                native.setPedHeadOverlay(alt.Player.local.scriptID, 4, parseInt(char_skin.makijaz), parseInt(char_skin.makijazIntenstywnosc) * 0.1);
                native.setPedHeadOverlay(alt.Player.local.scriptID, 8, parseInt(char_skin.szminka), parseInt(char_skin.szminkaIntenstywnosc) * 0.1);
                native.setPedHeadOverlayColor(alt.Player.local.scriptID, 8, 2, parseInt(char_skin.szminkaColor), parseInt(char_skin.szminkaColor));
                native.setPedHeadOverlay(alt.Player.local.scriptID, 2, parseInt(char_skin.brwi), parseInt(char_skin.brwiGrubosc) * 0.1);
                native.setPedHeadOverlayColor(alt.Player.local.scriptID, 2, 1, parseInt(char_skin.brwiColor), parseInt(char_skin.brwiColor));
                native.setPedHeadOverlay(alt.Player.local.scriptID, 1, parseInt(char_skin.broda), parseInt(char_skin.brodaGestosc) * 0.1);
                native.setPedHeadOverlayColor(alt.Player.local.scriptID, 1, 1, parseInt(char_skin.brodaColor), parseInt(char_skin.brodaColor));
                native.setPedHeadOverlay(alt.Player.local.scriptID, 3, parseInt(char_skin.postarzenie), parseInt(char_skin.postarzenieIntensywnosc) * 0.1);
            }, 100);
            alt.setTimeout(() => {
                native.setPedComponentVariation(alt.Player.local.scriptID, 3, char_clothes.torso, char_clothes.torso2, 0);
                native.setPedComponentVariation(alt.Player.local.scriptID, 4, char_clothes.legs, char_clothes.legs2, 0);
                native.setPedComponentVariation(alt.Player.local.scriptID, 5, char_clothes.bags, char_clothes.bags2, 0);
                native.setPedComponentVariation(alt.Player.local.scriptID, 6, char_clothes.shoes, char_clothes.shoes2, 0);
                native.setPedComponentVariation(alt.Player.local.scriptID, 7, char_clothes.accesories, char_clothes.accesories2, 0);
                native.setPedComponentVariation(alt.Player.local.scriptID, 8, char_clothes.undershirts, char_clothes.undershirts2, 0);
                native.setPedComponentVariation(alt.Player.local.scriptID, 9, char_clothes.armor, char_clothes.armor2, 0);
                native.setPedComponentVariation(alt.Player.local.scriptID, 10, char_clothes.decals, char_clothes.decals2, 0);
                native.setPedComponentVariation(alt.Player.local.scriptID, 11, char_clothes.tops, char_clothes.tops2, 0);
                native.setPedPropIndex(alt.Player.local.scriptID, 0, char_clothes.hats, char_clothes.hats2, true);
                native.setPedPropIndex(alt.Player.local.scriptID, 1, char_clothes.glasses, char_clothes.glasses2, true);
                native.setPedPropIndex(alt.Player.local.scriptID, 2, char_clothes.ears, char_clothes.ears2, true);
            }, 150)
            break;
        case "female":
            //native.setPlayerModel(alt.Player.local.scriptID, femaleModel);
            native.setPedHeadBlendData(parseInt(alt.Player.local.scriptID), parseInt(char_skin.momFace), parseInt(char_skin.dadFace), parseInt(char_skin.momFace), parseInt(char_skin.kolorSkory), parseInt(char_skin.kolorSkory), parseInt(char_skin.kolorSkory), parseInt(char_skin.podobienstwo) * 0.01, parseInt(char_skin.podobienstwo) * 0.01, 0.0, false);
            //native.setPedHeadBlendData(alt.Player.local.scriptID, char_skin.momFace, char_skin.dadFace, char_skin.momFace, char_skin.kolorSkory, char_skin.kolorSkory, char_skin.kolorSkory, char_skin.podobienstwo * 0.01, char_skin.podobienstwo * 0.01, 0.0, false);
            alt.setTimeout(() => {
                native.setPedComponentVariation(alt.Player.local.scriptID, 2, parseInt(char_skin.hair), 0, 2);
                native.setPedHairColor(alt.Player.local.scriptID, char_skin.hairColor, char_skin.hairColor);
                native.setPedEyeColor(alt.Player.local.scriptID, char_skin.eyeColor);
                native.setPedHeadOverlay(alt.Player.local.scriptID, 5, char_skin.rumience, char_skin.rumienceOpacity * 0.1);
                native.setPedHeadOverlayColor(alt.Player.local.scriptID, 5, 2, char_skin.rumienceColor, char_skin.rumienceColor);
                native.setPedHeadOverlay(alt.Player.local.scriptID, 0, char_skin.skazy, char_skin.skazyIntenstywnosc * 0.1);
                native.setPedHeadOverlay(alt.Player.local.scriptID, 9, char_skin.piegi, char_skin.piegiIntensywnosc * 0.1);
                native.setPedHeadOverlay(alt.Player.local.scriptID, 4, char_skin.makijaz, char_skin.makijazIntenstywnosc * 0.1);
                native.setPedHeadOverlay(alt.Player.local.scriptID, 8, char_skin.szminka, char_skin.szminkaIntenstywnosc * 0.1);
                native.setPedHeadOverlayColor(alt.Player.local.scriptID, 8, 2, char_skin.szminkaColor, char_skin.szminkaColor);
                native.setPedHeadOverlay(alt.Player.local.scriptID, 2, char_skin.brwi, char_skin.brwiGrubosc * 0.1);
                native.setPedHeadOverlayColor(alt.Player.local.scriptID, 2, 1, char_skin.brwiColor, char_skin.brwiColor);
                native.setPedHeadOverlay(alt.Player.local.scriptID, 1, char_skin.broda, char_skin.brodaGestosc * 0.1);
                native.setPedHeadOverlayColor(alt.Player.local.scriptID, 1, 1, char_skin.brodaColor, char_skin.brodaColor);
                native.setPedHeadOverlay(alt.Player.local.scriptID, 3, char_skin.postarzenie, char_skin.postarzenieIntensywnosc * 0.1);
            }, 100);/*
            alt.setTimeout(() => {
                native.setPedComponentVariation(alt.Player.local.scriptID, 3, char_clothes.torso, char_clothes.torso2, 0);
                native.setPedComponentVariation(alt.Player.local.scriptID, 4, char_clothes.legs, char_clothes.legs2, 0);
                native.setPedComponentVariation(alt.Player.local.scriptID, 5, char_clothes.bags, char_clothes.bags2, 0);
                native.setPedComponentVariation(alt.Player.local.scriptID, 6, char_clothes.shoes, char_clothes.shoes2, 0);
                native.setPedComponentVariation(alt.Player.local.scriptID, 7, char_clothes.accesories, char_clothes.accesories2, 0);
                native.setPedComponentVariation(alt.Player.local.scriptID, 8, char_clothes.undershirts, char_clothes.undershirts2, 0);
                native.setPedComponentVariation(alt.Player.local.scriptID, 9, char_clothes.armor, char_clothes.armor2, 0);
                native.setPedComponentVariation(alt.Player.local.scriptID, 10, char_clothes.decals, char_clothes.decals2, 0);
                native.setPedComponentVariation(alt.Player.local.scriptID, 11, char_clothes.tops, char_clothes.tops2, 0);
                native.setPedPropIndex(alt.Player.local.scriptID, 0, char_clothes.hats, char_clothes.hats2, true);
                native.setPedPropIndex(alt.Player.local.scriptID, 1, char_clothes.glasses, char_clothes.glasses2, true);
                native.setPedPropIndex(alt.Player.local.scriptID, 2, char_clothes.ears, char_clothes.ears2, true);
            }, 150)*/
            break;
    }
    /*
    if (char_sex.toString() === "male") {
        native.setPlayerModel(alt.Player.local.scriptID, maleModel);
        native.setPedHeadBlendData(alt.Player.local.scriptID, char_skin.dadFace, char_skin.momFace, char_skin.dadFace, char_skin.kolorSkory, char_skin.kolorSkory, char_skin.kolorSkory, char_skin.podobienstwo * 0.01, char_skin.podobienstwo * 0.01, 0.0, false);
        native.setPedComponentVariation(alt.Player.local.scriptID, 2, char_skin.hair, 0, 2);
        native.setPedHairColor(alt.Player.local.scriptID, char_skin.hairColor, char_skin.hairColor);
        native.setPedEyeColor(alt.Player.local.scriptID, char_skin.eyeColor);
        native.setPedHeadOverlay(alt.Player.local.scriptID, 5, char_skin.rumience, char_skin.rumienceOpacity * 0.1);
        native.setPedHeadOverlayColor(alt.Player.local.scriptID, 5, 2, char_skin.rumienceColor, char_skin.rumienceColor);
        native.setPedHeadOverlay(alt.Player.local.scriptID, 0, char_skin.skazy, char_skin.skazyIntenstywnosc * 0.1);
        native.setPedHeadOverlay(alt.Player.local.scriptID, 9, char_skin.piegi, char_skin.piegiIntensywnosc * 0.1);
        native.setPedHeadOverlay(alt.Player.local.scriptID, 4, char_skin.makijaz, char_skin.makijazIntenstywnosc * 0.1);
        native.setPedHeadOverlay(alt.Player.local.scriptID, 8, char_skin.szminka, char_skin.szminkaIntenstywnosc * 0.1);
        native.setPedHeadOverlayColor(alt.Player.local.scriptID, 8, 2, char_skin.szminkaColor, char_skin.szminkaColor);
        native.setPedHeadOverlay(alt.Player.local.scriptID, 2, char_skin.brwi, char_skin.brwiGrubosc * 0.1);
        native.setPedHeadOverlayColor(alt.Player.local.scriptID, 2, 1, char_skin.brwiColor, char_skin.brwiColor);
        native.setPedHeadOverlay(alt.Player.local.scriptID, 1, char_skin.broda, char_skin.brodaGestosc * 0.1);
        native.setPedHeadOverlayColor(alt.Player.local.scriptID, 1, 1, char_skin.brodaColor, char_skin.brodaColor);
        native.setPedHeadOverlay(alt.Player.local.scriptID, 3, char_skin.postarzenie, char_skin.postarzenieIntensywnosc * 0.1);
        native.setPedComponentVariation(alt.Player.local.scriptID, 3, char_clothes.torso, char_clothes.torso2, 0);
        native.setPedComponentVariation(alt.Player.local.scriptID, 4, char_clothes.legs, char_clothes.legs2, 0);
        native.setPedComponentVariation(alt.Player.local.scriptID, 5, char_clothes.bags, char_clothes.bags2, 0);
        native.setPedComponentVariation(alt.Player.local.scriptID, 6, char_clothes.shoes, char_clothes.shoes2, 0);
        native.setPedComponentVariation(alt.Player.local.scriptID, 7, char_clothes.accesories, char_clothes.accesories2, 0);
        native.setPedComponentVariation(alt.Player.local.scriptID, 8, char_clothes.undershirts, char_clothes.undershirts2, 0);
        native.setPedComponentVariation(alt.Player.local.scriptID, 9, char_clothes.armor, char_clothes.armor2, 0);
        native.setPedComponentVariation(alt.Player.local.scriptID, 10, char_clothes.decals, char_clothes.decals2, 0);
        native.setPedComponentVariation(alt.Player.local.scriptID, 11, char_clothes.tops, char_clothes.tops2, 0);
        native.setPedPropIndex(alt.Player.local.scriptID, 0, char_clothes.hats, char_clothes.hats2, true);
        native.setPedPropIndex(alt.Player.local.scriptID, 1, char_clothes.glasses, char_clothes.glasses2, true);
        native.setPedPropIndex(alt.Player.local.scriptID, 2, char_clothes.ears, char_clothes.ears2, true);
    } else {
        native.setPlayerModel(alt.Player.local.scriptID, femaleModel);
        native.setPedHeadBlendData(alt.Player.local.scriptID, char_skin.momFace, char_skin.dadFace, char_skin.momFace, char_skin.kolorSkory, char_skin.kolorSkory, char_skin.kolorSkory, char_skin.podobienstwo * 0.01, char_skin.podobienstwo * 0.01, 0.0, false);
        native.setPedComponentVariation(alt.Player.local.scriptID, 2, char_skin.hair, 0, 2);
        native.setPedHairColor(alt.Player.local.scriptID, char_skin.hairColor, char_skin.hairColor);
        native.setPedEyeColor(alt.Player.local.scriptID, char_skin.eyeColor);
        native.setPedHeadOverlay(alt.Player.local.scriptID, 5, char_skin.rumience, char_skin.rumienceOpacity * 0.1);
        native.setPedHeadOverlayColor(alt.Player.local.scriptID, 5, 2, char_skin.rumienceColor, char_skin.rumienceColor);
        native.setPedHeadOverlay(alt.Player.local.scriptID, 0, char_skin.skazy, char_skin.skazyIntenstywnosc * 0.1);
        native.setPedHeadOverlay(alt.Player.local.scriptID, 9, char_skin.piegi, char_skin.piegiIntensywnosc * 0.1);
        native.setPedHeadOverlay(alt.Player.local.scriptID, 4, char_skin.makijaz, char_skin.makijazIntenstywnosc * 0.1);
        native.setPedHeadOverlay(alt.Player.local.scriptID, 8, char_skin.szminka, char_skin.szminkaIntenstywnosc * 0.1);
        native.setPedHeadOverlayColor(alt.Player.local.scriptID, 8, 2, char_skin.szminkaColor, char_skin.szminkaColor);
        native.setPedHeadOverlay(alt.Player.local.scriptID, 2, char_skin.brwi, char_skin.brwiGrubosc * 0.1);
        native.setPedHeadOverlayColor(alt.Player.local.scriptID, 2, 1, char_skin.brwiColor, char_skin.brwiColor);
        native.setPedHeadOverlay(alt.Player.local.scriptID, 1, char_skin.broda, char_skin.brodaGestosc * 0.1);
        native.setPedHeadOverlayColor(alt.Player.local.scriptID, 1, 1, char_skin.brodaColor, char_skin.brodaColor);
        native.setPedHeadOverlay(alt.Player.local.scriptID, 3, char_skin.postarzenie, char_skin.postarzenieIntensywnosc * 0.1);
        native.setPedComponentVariation(alt.Player.local.scriptID, 3, char_clothes.torso, char_clothes.torso2, 0);
        native.setPedComponentVariation(alt.Player.local.scriptID, 4, char_clothes.legs, char_clothes.legs2, 0);
        native.setPedComponentVariation(alt.Player.local.scriptID, 5, char_clothes.bags, char_clothes.bags2, 0);
        native.setPedComponentVariation(alt.Player.local.scriptID, 6, char_clothes.shoes, char_clothes.shoes2, 0);
        native.setPedComponentVariation(alt.Player.local.scriptID, 7, char_clothes.accesories, char_clothes.accesories2, 0);
        native.setPedComponentVariation(alt.Player.local.scriptID, 8, char_clothes.undershirts, char_clothes.undershirts2, 0);
        native.setPedComponentVariation(alt.Player.local.scriptID, 9, char_clothes.armor, char_clothes.armor2, 0);
        native.setPedComponentVariation(alt.Player.local.scriptID, 10, char_clothes.decals, char_clothes.decals2, 0);
        native.setPedComponentVariation(alt.Player.local.scriptID, 11, char_clothes.tops, char_clothes.tops2, 0);
        native.setPedPropIndex(alt.Player.local.scriptID, 0, char_clothes.hats, char_clothes.hats2, true);
        native.setPedPropIndex(alt.Player.local.scriptID, 1, char_clothes.glasses, char_clothes.glasses2, true);
        native.setPedPropIndex(alt.Player.local.scriptID, 2, char_clothes.ears, char_clothes.ears2, true);
    }*/
    
    //alt.log(char_clothes.torso);
});

function showPanel() {
//    const panel = new alt.WebView("http://resources/grl_login/client/html/index.html");

    panel.on("requestPlayerLogin", (login, password) => {
        alt.emitServer("requestPlayerLoginServer", login, password);
    });
    
    panel.on("createPlayerAccount", (password, login, email) => {
        
        if (login !== null && password !== null && email !== null) {
            alt.emitServer("createPlayerAccountServer", password, login, email);
        } else {
            return;
        }
    });

    panel.focus();
    alt.showCursor(true);
}

function savePlayerClothes() {
    let torso = native.getPedDrawableVariation(alt.Player.local.scriptID, 3);
    let torso2 = native.getPedTextureVariation(alt.Player.local.scriptID, 3);
    let legs = native.getPedDrawableVariation(alt.Player.local.scriptID, 4);
    let legs2 = native.getPedTextureVariation(alt.Player.local.scriptID, 4);
    let bags = native.getPedDrawableVariation(alt.Player.local.scriptID, 5);
    let bags2 = native.getPedTextureVariation(alt.Player.local.scriptID, 5);
    let shoes = native.getPedDrawableVariation(alt.Player.local.scriptID, 6);
    let shoes2 = native.getPedTextureVariation(alt.Player.local.scriptID, 6);
    let accesories = native.getPedDrawableVariation(alt.Player.local.scriptID, 7);
    let accesories2 = native.getPedTextureVariation(alt.Player.local.scriptID, 7);
    let undershirts = native.getPedDrawableVariation(alt.Player.local.scriptID, 8);
    let undershirts2 = native.getPedTextureVariation(alt.Player.local.scriptID, 8);
    let armor = native.getPedDrawableVariation(alt.Player.local.scriptID, 9);
    let armor2 = native.getPedTextureVariation(alt.Player.local.scriptID, 9);
    let decals = native.getPedDrawableVariation(alt.Player.local.scriptID, 10);
    let decals2 = native.getPedTextureVariation(alt.Player.local.scriptID, 10);
    let tops = native.getPedDrawableVariation(alt.Player.local.scriptID, 11);
    let tops2 = native.getPedTextureVariation(alt.Player.local.scriptID, 11);
    let hats = native.getPedPropIndex(alt.Player.local.scriptID, 0);
    let hats2 = native.getPedPropTextureIndex(alt.Player.local.scriptID, 0);
    let glasses = native.getPedPropIndex(alt.Player.local.scriptID, 1);
    let glasses2 = native.getPedPropTextureIndex(alt.Player.local.scriptID, 1);
    let ears = native.getPedPropIndex(alt.Player.local.scriptID, 2);
    let ears2 = native.getPedPropTextureIndex(alt.Player.local.scriptID, 2);

    let stringify = {torso: torso, torso2: torso2, legs: legs, legs2: legs2, bags: bags, bags2: bags2, shoes: shoes, shoes2: shoes2, accesories: accesories, accesories2: accesories2, undershirts: undershirts, undershirts2: undershirts2, armor: armor, armor2: armor2, decals: decals, decals2: decals2, tops: tops, tops2: tops2, hats: hats, hats2: hats2, glasses: glasses, glasses2: glasses2, ears: ears, ears2: ears2};

    let PlayerClothes = JSON.stringify(stringify);

    return PlayerClothes;
}

function getPedHeadBlendData(ped) {

    const buffer = new alt.MemoryBuffer(68);

    game.getPedHeadBlendData(ped, buffer);

    const data = [
        buffer.int(0),
        buffer.int(8),
        buffer.int(16),
        buffer.int(24),
        buffer.int(32),
        buffer.int(40),
        buffer.floatLE(48),
        buffer.floatLE(56),
        buffer.floatLE(64)
    ];

    buffer.free();

    return data;
}


function showCharInfoCreator(charInfoCreator) {

    charInfoCreator.on("register_player_character", (char_firstname, char_lastname, char_sex, char_birthdate, char_height, char_weight) => {
        alt.emitServer("register_player_character_server", char_firstname, char_lastname, char_sex, char_birthdate, char_height, char_weight)
    });

    charInfoCreator.on("changeSex", (gender) => {
        //alt.log(gender)
        alt.emitServer("changeSexServer", gender);
    });

    charInfoCreator.focus();
    alt.showCursor(true);

    var isVisible = charInfoCreator.isVisible();

    alt.on("update", () => {
        if (isVisible) {
            native.showCursorThisFrame();
        } else {
            alt.showCursor(false);
        }
   });
}
/*
alt.on('keydown', (key) => {
    if (key === 88) { // X
        taxiCutscene();
    }
});
*/

function taxiCutscene() {
    isCutscenePlaing = true
    let taxiModelHash = native.getHashKey("taxi");
    let taxiDriverHash = native.getHashKey("a_m_o_genstreet_01");
    native.requestModel(taxiModelHash);
    alt.loadModel(taxiModelHash);
    native.requestModel(taxiDriverHash);
    alt.loadModel(taxiDriverHash);

    //{ x: -490.822, y: -813.16, z: 29.9082 } Spawn taxi

    let taxi = native.createVehicle(taxiModelHash, -490.822, -813.16, 30.0, 0, false, false, false);
    let taxiDriver = native.createPed(5, taxiDriverHash, -490.822, -814.16, 30.0, 0, false, false);
    native.setPedIntoVehicle(taxiDriver, taxi, -1);

    // { x: -509.296, y: -749.51, z: 31.6491 } Miejsce docelowej jazdy taxi

    native.taskVehicleDriveToCoord(taxiDriver, taxi, -509.296, -749.51, 31.6491, 13.0, 3.0, taxiModelHash, 411, 3.0, 1);
    native.taskVehiclePark(taxiDriver, taxi, -511.627, -744.443, 31.8536, 37.961, 1, 3.0, true); //{ x: -511.627, y: -744.443, z: 31.8536 }
    //native.taskFollowNavMeshToCoord(taxiDriver, 223.046, -852.876, 29.5585, 10, 10, 0, false, 0);

    var parkPositionVector = new alt.Vector3(-514.588, -741.109, 31.9239);
    var distanceToPark

    const interval = alt.setInterval(() => {
        var taxiPos = native.getEntityCoords(taxi, false);
        var taxiPosVector = new alt.Vector3(taxiPos.x, taxiPos.y, taxiPos.z);
        distanceToPark = {
            x: parkPositionVector.x - taxiPosVector.x,
            y: parkPositionVector.y - taxiPosVector.y,
            z: parkPositionVector.y - taxiPosVector.y
        }

        if (distanceToPark.x < 0 && distanceToPark.y < 1 && distanceToPark.z < 1) {
            alt.clearInterval(interval);
        }
        
        //alt.log(distanceToPark.x, distanceToPark.y, distanceToPark.z);
    }, 100)

    alt.setTimeout(() => { 
        
    }, 10);


    //{ x: -514.385, y: -742.132, z: 31.9472 }
}

alt.onServer("setPlayerInvisibleToServer", (player) => {
    native.setEntityAlpha(player.scriptID, 255, false);
});

alt.onServer("setPlayerVisibleToServer", (player) => {
    native.setEntityAlpha(player.scriptID, 0, false);
});