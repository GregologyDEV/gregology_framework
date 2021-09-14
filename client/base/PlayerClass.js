import * as alt from 'alt-client'
import * as native from 'natives';

export class Player {
    constructor(uID, scriptID, playerInfoJSON) {
        let playerInfo = JSON.parse(playerInfoJSON);
        this._uID = uID;
        this._scriptID = scriptID;
    }
    
}