/// <reference types="@altv/types-client" />
/// <reference types="@altv/types-natives" />
import * as alt from 'alt-client'
import * as native from 'natives';
import { showCursor, animationsFlags } from "../utility/misc.js"

let radiophoneUIState = false;
let radiophonePower = false;
let isRadiophoneChannelSet = false;

const lockedFrequencies = [0, 1, 2, 3, 4, 5]

const lockedFrequenciesByJob = {
    0: "ems",
    1: "lspd",
    2: "bcso",
    3: "hwp",
    4: "fib",
    5: "iaa",
}

const radiophoneWebView = new alt.WebView("http://resource/client/voice/html/index.html", true)

native.requestAnimDict("random@arrests");

alt.onServer("radio:openRadiophoneUI", () => {
    if (!alt.Player.local.getMeta("isAnyUIOpen")) {
        radiophoneWebView.emit("webView::radio::toggleRadioDisplay")
        //radiophoneWebView.emit("webView::radio::setLockedFrequencies", lockedFrequencies)
    }
});

alt.onServer("radio:reciveTransmissionStarted", () => {
    radiophoneWebView.emit("webView::radio::reciveTransmissionStart")
});

alt.onServer("radio:reciveTransmissionEnded", () => {
    radiophoneWebView.emit("webView::radio::reciveTransmissionEnd")
});


radiophoneWebView.on("webview::radio:finishedLoading", () => {

});

radiophoneWebView.on("webView::radio::powerStatusChanged", (status) => {
    radiophonePower = status
});

radiophoneWebView.on("webView::radio::onChannelChange", (channel, subchannel) => {
    isRadiophoneChannelSet = true;
    if (!lockedFrequencies.includes(channel)) {
        radiophoneWebView.emit("webView::radio::markChannelAsLocked", 0)
        alt.emitServer("radio:channelChanged", channel, subchannel)
    } else if (lockedFrequencies.includes(channel) && lockedFrequenciesByJob[channel] === alt.Player.local.getSyncedMeta("faction")) {
        radiophoneWebView.emit("webView::radio::markChannelAsLocked", 1)
        alt.emitServer("radio:channelChanged", channel, subchannel)
    } else if (lockedFrequencies.includes(channel) && lockedFrequenciesByJob[channel] !== alt.Player.local.getSyncedMeta("faction")) {
        radiophoneWebView.emit("webView::radio::markChannelAsLocked", -1)
    }
    
});

radiophoneWebView.on("webView::radio::disableChannelSet", () => {

});

radiophoneWebView.on("webView::radio::transmissionStarted", () => {
    alt.emitServer("radio:transmissionStarted")
});

radiophoneWebView.on("webView::radio::transmissionEnded", () => {
    alt.emitServer("radio:transmissionEnded")
});

radiophoneWebView.on("webView::radio::setFocus", (state) => {
    if (state) {
        radiophoneWebView.focus()
        showCursor(true)
        radiophoneUIState = true
        alt.Player.local.setMeta("isAnyUIOpen", true)
    } else {
        radiophoneWebView.unfocus()
        showCursor(false)
        radiophoneUIState = false
        alt.Player.local.setMeta("isAnyUIOpen", false)
    }   
});

alt.everyTick(() => {
    if (radiophoneUIState) {
        native.disableControlAction(0, 1, true) // MOUSE RIGHT
        native.disableControlAction(0, 2, true) // MOUSE DOWN
        native.disableControlAction(0, 24, true) // LEFT MOUSE BUTTON
        native.disableControlAction(0, 25, true) // RIGHT MOUSE BUTTON
        //native.disableControlAction(0, 30, true) // MOVE LEFT - RIGHT
        //native.disableControlAction(0, 31, true) // MOVE UP - DOWN
        native.disablePlayerFiring(alt.Player.local.scriptID, true);
    }
})

alt.on("keydown", (key) => {
    if (key === 27 && radiophoneUIState) { // ESC key
        radiophoneWebView.emit("webView::radio::toggleRadioDisplay")
    };

    if (key === 192 && radiophonePower && isRadiophoneChannelSet) { // Tymczasowo tylda, docelowo ALT // NIE DZIAŁA KONTROLOWANIE ANIMACJI 
        if (!alt.Player.local.isAiming) {
            native.taskPlayAnim(alt.Player.local.scriptID, "random@arrests", "generic_radio_enter", 8.0, 1, 400, 50, 0, false, false, false);
            alt.setTimeout(() => {
                native.taskPlayAnim(alt.Player.local.scriptID, "random@arrests", "generic_radio_chatter", 8.0, 1, -1, 50, 0, false, false, false);
            }, 400)
        } else {
            native.taskPlayAnim(alt.Player.local.scriptID, "random@arrests", "radio_enter", 8.0, 1, -1, 32, 0, false, false, false);
            alt.setTimeout(() => {
                native.taskPlayAnim(alt.Player.local.scriptID, "random@arrests", "radio_chatter", 8.0, 1, -1, 32, 0, false, false, false);
            }, 400)
        }
        alt.setTimeout(() => {
            alt.emitServer("radio:transmissionStarted")
            radiophoneWebView.emit("webView::radio::startTransmission");
        }, 250);
    }
})

alt.on('keyup', (key) => {
    if (key === 192 && radiophonePower && isRadiophoneChannelSet) { // Tymczasowo tylda, docelowo ALT
        if (!alt.Player.local.isAiming) {
            native.taskPlayAnim(alt.Player.local.scriptID, "random@arrests", "generic_radio_exit", 8.0, 1, 400, 50, 0, false, false, false);
            alt.setTimeout(() => {
                native.clearPedTasks(alt.Player.local.scriptID);
            }, 450);
        } else {
            native.taskPlayAnim(alt.Player.local.scriptID, "random@arrests", "radio_exit", 8.0, 1, 400, 50, 0, false, false, false);
            alt.setTimeout(() => {
                native.clearPedTasks(alt.Player.local.scriptID)
            }, 450);
        }
        alt.emitServer("radio:transmissionEnded")
        radiophoneWebView.emit("webView::radio::endTransmission");
    }
});

alt.log("Załadowano => [client/voice/radio.js]")