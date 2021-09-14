/// <reference types="@altv/types-client" />
/// <reference types="@altv/types-natives" />

import * as alt from 'alt-client'
import * as native from 'natives';

var mdt = undefined


alt.onServer('police:openMDT', () => {
    if (mdt === undefined) {
        mdt = new alt.WebView("http://resource/client/police/html/mdt/mdt/dist/index.html");
        mdt.focus()
        alt.showCursor(true);
    } else if (mdt) {
        mdt.emit("mdt:showMDT");
        mdt.focus()
        alt.showCursor(true);
    }

    mdt.on("mdt:requestCitizenDatabaseByName", (citizenName) => {
        alt.emitServer("police:requestCitizenDatabaseByNameServer", citizenName)
    });

    mdt.on("mdt:requestCitizenDatabaseByCitizenUID", (citizenUID) => {
        alt.emitServer("police:requestCitizenDatabaseByUIDServer", citizenUID)
    });

    mdt.on("mdt:requestCitizenData", (citizenID) => {
        //alt.log(citizenID)
        alt.emitServer("police:requestCitizenDataServer", citizenID);
    });

    mdt.on("mdt:closeMDT", () => {
        mdt.unfocus();
        alt.showCursor(false);        
    });
});

alt.onServer('police:citizenDataCallback', (result) => {
    mdt.emit("mdt:citizenDataCallback", result)
    alt.log(JSON.stringify(result))
});

alt.onServer('police:citizensArrayCallback', (result) => {
    mdt.emit("mdt:citizensArrayCallback", result)
});

alt.onServer('police:citizenDatabaseCallback', (result) => {
    alt.log(JSON.stringify(result))
    mdt.emit("mdt:citizenDatabaseCallback", result)
});