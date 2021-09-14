/// <reference types="@altv/types-server" />
import * as alt from 'alt-server'
import { isFactionAndGradeValid } from "../utility/FactionsHandler.js"

alt.Player.prototype.save = function save() {
    
}

alt.Player.prototype.getByUID = (uid) => {
    if (uid && uid > 0) {
        let player = alt.Player.all.find(p => p.data.uID)
        if (player && player.valid) {
            return player
        } else return null
    } else return null
    //alt.log(`playerUID:${uid}`)
}

alt.Player.prototype.giveBankMoney = function giveBankMoney(amount) {
    if (isNaN(amount) || amount < 0 || !amount) return;

}

alt.Player.prototype.removeBankMoney = function removeBankMoney(amount) {
    if (isNaN(amount) || amount < 0 || !amount) return;

}

alt.Player.prototype.hasBankMoney = function hasBankMoney(amount) {
    if (isNaN(amount) || amount < 0 || !amount) return;

}

alt.Player.prototype.setFaction = function save(faction, grade) {
    const [valid_faction, valid_grade] = isFactionAndGradeValid(faction, grade)
    if (valid_faction && valid_grade) {
        
    }
}


console.log("Załadowano => [server/base/playerPrototype.js");