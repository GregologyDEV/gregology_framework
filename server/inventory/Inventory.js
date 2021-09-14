import * as alt from 'alt-server'
import { Items, isItemValid, getItem } from "./InventoryItems.js"

/* Items array
[
    {
        item: ItemScriptName
        amount: int
    },
    {
        item: ItemScriptName
        amount: int
    }
]
*/

/**
 * 
 * @param {string} item 
 * @param {number} amount 
 */
alt.Player.prototype.addItem = function addItem(item, amount) {
    var itemToAdd = getItem(item);
    if (!itemToAdd) throw new Error("Błędna nazwa przedmiotu");
    if (!amount || amount < 1) throw new Error("Ilość jest mniejsza od 1");
    var inventory = this.inventory;
    var itemInInventory = inventory.find((item1) => item1.itemScriptName === item);
    if (itemInInventory) {
        var amountInInventory = itemInInventory.amount;
        var amountToAssign = amountInInventory + amount;
        itemInInventory.amount = amountToAssign;
    } else {
        inventory.push({itemScriptName: item, amount: amount});
        this.inventory = inventory;
    }
    alt.emit("updatePlayerDatabase", this.data.uID)
    alt.emit("inv:updateInventory", this)
}

alt.Player.prototype.getItemAmount = function getItemAmount(itemScriptName) {
    var playerItems = this.inventory;
    var itemToFound = playerItems.find((item) => item.itemScriptName === itemScriptName);
    if (!itemToFound) return undefined
    return itemToFound.amount
}

/**
 * 
 * @param {string} item 
 * @param {number} amountToRemove 
 * @returns {void}
 */
alt.Player.prototype.removeItem = function removeItem(item, amountToRemove) {
    var playerItems = this.inventory;
    var itemToRemove = getItem(item);
    if(!itemToRemove) throw new Error("Błędna nazwa przedmiotu")
    if(!this.inventory) throw new Error("Nie można odczytać ekwipunku")
    if (!amountToRemove || amountToRemove < 1) throw new Error("Ilość jest mniejsza od 1");
    var itemInInventory = this.inventory.find((item1) => item1.itemScriptName === item);
    if (!itemInInventory) return;
    var itemAmountInInventory = itemInInventory.amount;
    var itemIndex = this.inventory.indexOf(itemInInventory)
    if (amountToRemove === itemAmountInInventory) {
        this.inventory.splice(itemIndex, 1)
    } else if (amountToRemove < itemAmountInInventory) {
        var newAmount = itemAmountInInventory - amountToRemove;
        itemInInventory.amount = newAmount;
        //this.inventory[itemIndex].amount = newAmount
        //console.log(`newAmount: ${newAmount}, amount: ${amountToRemove}, itemAmountInInventory: ${itemAmountInInventory}`)
    } else throw new Error("Nieprawidłowa ilość przedmiotu do usunięcia");

    alt.emit("updatePlayerDatabase", this.data.uID)
    alt.emit("inv:updateInventory", this)
}

alt.Player.prototype.hasItem = function hasItem(item, amountToCheck) {
    if (isItemValid(item) && amountToCheck > 0) {
        let playerItems = this.inventory;
        let itemInInventory = playerItems.find((item1) => item1.itemScriptName === item);
        if (itemInInventory && itemInInventory.amount >= amountToCheck) {
            return true
        } else {
            return false
        }
    } else throw new Error("Błędna nazwa przedmiotu")
}