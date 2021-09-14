import * as alt from 'alt-server'
import { isFactionAndGradeValid } from "../utility/FactionsHandler.js"
import chat from "../chat/index.js";

export class ServerPlayer {
    constructor(uID, login, activeCharacerID, activeCharacerName, adminLvl, cash, bank, factionName, factionGrade, organistationName, organistationGrade, buissnesName, buissnesGrade) {
        this._uID = uID;
        this._login = login;
        this._activeCharacerID = activeCharacerID;
        this._activeCharacerName = activeCharacerName;
        this._adminLvl = adminLvl;
        this._cash = cash;
        this._bank = bank;
        this._factionName = factionName;
        this._factionGrade = factionGrade;
        this._organisationName = organistationName;
        this._organisationGrade = organistationGrade;
        this._buissnesName = buissnesName;
        this._buissnesGrade = buissnesGrade;
    }

    get uID() {
        return this._uID;
    }

    get login() {
        return this._login;
    }

    get activeCharacerID() {
        return this._activeCharacerID;
    }

    get activeCharacerName() {
        return this._activeCharacerName;
    }

    get adminLvl() {
        return this._adminLvl;
    }

    get cash() {
        return this._cash;
    }

    get bank() {
        return this._bank;
    }

    get factionName() {
        return this._factionName;
    }

    get factionGrade() {
        return this._factionGrade;
    }

    get organistationName() {
        return this._organisationName;
    }

    get organisationGrade() {
        return this._organisationGrade;
    }

    get buissnesName() {
        return this._buissnesName;
    }

    get buissnesGrade() {
        return this._buissnesGrade;
    }

    set adminLvl(x) {
        this._adminLvl = x;
        alt.emit("updatePlayerDatabase", this._uID)
    }

    setfaction(faction, grade) {
        let result = isFactionAndGradeValid(faction, grade)
        if (result[0] === true && result[1] === true) {
            this._factionName = faction;
            this._factionGrade = grade;
            alt.emit("updatePlayerDatabase", this._uID);
        } else {
            return;
        }
    }
}

console.log("Zaladowano => [server/base/PlayerClass.mjs]")