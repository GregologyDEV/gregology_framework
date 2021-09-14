import * as alt from 'alt-client'
import * as native from 'natives';
import * as NativeUI from '../includes/NativeUIMenu/NativeUi.js';
import { getClosestPlayers } from "../utility/misc.js"
//import { Scaleforms } from "../utility/Scaleforms.js"

//const hospitalBlip = new alt.PointBlip(300.342, -585.006, 42.282);


let deathScreen = native.requestScaleformMovie("MP_BIG_MESSAGE_FREEMODE");
var intervalDeathScreen;

alt.onServer("playerDeath", (killer, weaponHash) => {
    if (native.hasScaleformMovieLoaded(deathScreen)) {
        native.beginScaleformMovieMethod(deathScreen, "SHOW_SHARD_WASTED_MP_MESSAGE");
        native.scaleformMovieMethodAddParamPlayerNameString("~b~nieprzytomny");
        native.scaleformMovieMethodAddParamPlayerNameString("Straciłeś przytomność na skutek otrzymanych obrażeń");
        native.scaleformMovieMethodAddParamInt(0);
        native.scaleformMovieMethodAddParamBool(false);
        native.scaleformMovieMethodAddParamBool(true);
        native.endScaleformMovieMethod();
        

        /*
        native.beginScaleformMovieMethod(deathScreen, "TRANSITION_IN");
        native.scaleformMovieMethodAddParamInt(500);
        native.endScaleformMovieMethod();

        native.beginScaleformMovieMethod(deathScreen, "TRANSITION_OUT");
        native.scaleformMovieMethodAddParamInt(500);
        native.endScaleformMovieMethod();
        */
        
        intervalDeathScreen = alt.setInterval(() => {
            native.drawScaleformMovieFullscreen(deathScreen, 255, 255, 255, 255, 0);
        }, 0)
    }
});

alt.on("syncedMetaChange", (entity, key, value) => {
    alt.log(entity.scriptID)
    if (key === "death" && value === false && entity.scriptID === alt.Player.local.scriptID && intervalDeathScreen) {
        alt.clearInterval(intervalDeathScreen);
    } else return;
})



const emsUI = new NativeUI.Menu("EMS", "Menu interakcji dla służb ratunkowych", new NativeUI.Point(50, 50));

const emsUIInstuctionalButtonEnter = new NativeUI.InstructionalButton("Wybierz", NativeUI.Control.FrontendRdown);
const emsUIInstuctionalButtonBackspace = new NativeUI.InstructionalButton("Wstecz", NativeUI.Control.FrontendRright);

const emsUI_revive = new NativeUI.UIMenuItem("Reanimuj", "Rozpocznij reanimację osoby w pobliżu");
const emsUI_bill = new NativeUI.UIMenuItem("Rachunek", "Wystaw rachunek za leczenie.");
emsUI.AddItem(emsUI_revive);
emsUI.AddItem(emsUI_bill);
emsUI.AddInstructionalButton(emsUIInstuctionalButtonEnter);
emsUI.AddInstructionalButton(emsUIInstuctionalButtonBackspace);

/*
alt.on("keydown", (key) => {
    if (key === 117 && alt.Player.local.getSyncedMeta("faction") === "ems") {
        if (emsUI.Visible) {
            emsUI.Close()
        } else {
            emsUI.Open()
        }
    }
});
*/
emsUI.ItemSelect.on(item => {
    switch (item) {
        case emsUI_revive:
            alt.log(getClosestPlayers(alt.Player.local))
            break;
        case emsUI_bill:
            alt.log("bill");
            let billAmount = showInputBox("Kwota rachunku za opiekę medyczną").then(ammount => {
                alt.log(ammount)
            });
            
            break;
    }
})


function showInputBox(title = "", text = "", maxLength = 100) {
    return new Promise((resolve) => {
        alt.addGxtText("INPUT_BOX_CUSTOM_TITLE", title);
        native.displayOnscreenKeyboard(0, "INPUT_BOX_CUSTOM_TITLE", "", text, "", "", "", maxLength);

        let tick = alt.everyTick(() => {
            let state = native.updateOnscreenKeyboard();
            if(state === 0) return;
            let result = native.getOnscreenKeyboardResult();
            native.forceCloseTextInputBox();
            alt.clearEveryTick(tick);
            resolve(result);
        });
    });
}
//native.drawScaleformMovieFullscreen(deathScreen, 255, 255, 255, 255, 0);
