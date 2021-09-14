import * as alt from 'alt-client'
import * as native from 'natives';
import { Scaleforms } from "../utility/Scaleforms.js"
import { requestTextureDict, draw3DSprite, drawText3D } from "../utility/misc.js"


const DEFAULT_PAGE = 1;
const PLAYERS_PER_PAGE = 16;
const SANITIZE_PATTERN = /[<>~]/g;

var scaleform = null;
var playersList = [];
var isPlayerListOpen = false;
var playerListCurPage = DEFAULT_PAGE;
var playerListMaxPage = 0


alt.on("keydown", (key) => {
    // [Z] key
    if (key === 90 && alt.Player.local.getMeta("isChatOpened") === false) {
        if (isPlayerListOpen) {
            if (scaleform) {
                scaleform.destroy()
                scaleform = null
                native.playSoundFrontend(-1, "BACK", "HUD_FRONTEND_DEFAULT_SOUNDSET", true);
            }
        } else {
            playersList = alt.Player.all
            playerListMaxPage = Math.ceil(playersList.length / PLAYERS_PER_PAGE)
            scaleform = new Scaleforms("MP_MM_CARD_FREEMODE")
            updateTitle()
            updateCard()
            playerListCurPage = DEFAULT_PAGE
            native.playSoundFrontend(-1, "LEADER_BOARD", "HUD_FRONTEND_DEFAULT_SOUNDSET", true);
        }

        isPlayerListOpen = !isPlayerListOpen
        alt.emitServer("playerList:changeMeta", isPlayerListOpen)
        
    }
})

alt.on("keydown", (key) => {
    // [Page UP] key
    if (key === 33 && alt.Player.local.getMeta("isChatOpened") === false && !isPlayerListOpen) {
        playerListCurPage++
        if (playerListCurPage > playerListMaxPage) {
            playerListCurPage = DEFAULT_PAGE
        }

        updateTitle()
        updateCard()

        native.playSoundFrontend(-1, "NAV_UP_DOWN", "HUD_FRONTEND_DEFAULT_SOUNDSET", true);
    }
})

alt.on("keydown", (key) => {
    // [Page DN] key
    if (key === 34 && alt.Player.local.getMeta("isChatOpened") === false && !isPlayerListOpen) {
        playerListCurPage--
        if (playerListCurPage <= 0) {
            playerListCurPage = playerListMaxPage
        }

        updateTitle()
        updateCard()

        native.playSoundFrontend(-1, "NAV_UP_DOWN", "HUD_FRONTEND_DEFAULT_SOUNDSET", true);
    }
})

function updateTitle() {
    if (!scaleform) return

    scaleform.call("SET_TITLE", `Gracze online: ${playersList.length}`, `Strona: ${playerListCurPage} / ${playerListMaxPage}`)
}

function updateCard() {
    if (!scaleform) return

    // 16 - Max number of players on page
    for (let i = 0; i < PLAYERS_PER_PAGE; i++) {
        scaleform.call("SET_DATA_SLOT_EMPTY", i)
    }

    const players = paginate(playersList, PLAYERS_PER_PAGE, playerListCurPage);
    players.forEach((player, index) => {
        if (player.getSyncedMeta("zalogowano") === true && player.getSyncedMeta("char_id") !== null) {
            var color
            const tag = player.getSyncedMeta("uID")
            if (player.getSyncedMeta('adminLevel') > 0) {
                color = 6
            } else {
                color = 116
            }

            scaleform.call("SET_DATA_SLOT", index, "", `${player.getSyncedMeta("username").replace(SANITIZE_PATTERN, "")}`, color, 0, "", "", `___${tag}`, 2,  "CHAR_DEFAULT", "CHAR_DEFAULT", "")
        }
    })

    scaleform.call("DISPLAY_VIEW")
}

function paginate(array, pageSize, pageNumber) {
    return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize)
}

await requestTextureDict("mphud")

alt.everyTick(() => {
    if (isPlayerListOpen && scaleform) {
        native.setScriptGfxAlign(76, 84);
        //scaleform.render2D(0.122, 0.3, 0.28, 0.6)
        scaleform.render2D(0.878, 0.3, 0.28, 0.6)
        native.resetScriptGfxAlign();
        let drawPosition = new alt.Vector3(alt.Player.local.pos.x, alt.Player.local.pos.y, alt.Player.local.pos.z + 1.3)
        draw3DSprite("mphud", "spectating", drawPosition)
        drawText3D(`${alt.Player.local.getSyncedMeta("username")} ~n~ ~h~[${alt.Player.local.getSyncedMeta("uID")}]`, drawPosition.x, drawPosition.y, drawPosition.z - 0.2, 0.5, 2, 255, 255, 255, 255, true, true)
    }
});

alt.everyTick(() => {
    if (isPlayerListOpen && scaleform) {
        for (let pl of alt.Player.streamedIn) {
            let drawPos = new alt.Vector3(pl.pos.x, pl.pos.y, pl.pos.z + 1.1)
            drawText3D(`${pl.getSyncedMeta("username")} ~n~ ~h~[${pl.getSyncedMeta("uID")}]`, drawPos.x, drawPos.y, drawPos.z, 1.0, 2, 255, 255, 255, 255, true, true) 
        } 
    } else {
        for (let pl of alt.Player.streamedIn) {
            if (pl.getStreamSyncedMeta("isPlayerListOpen")) {
                let drawPos = new alt.Vector3(pl.pos.x, pl.pos.y, pl.pos.z + 1.3)
                draw3DSprite("mphud", "spectating", drawPos)
            } 
        }
    }
});