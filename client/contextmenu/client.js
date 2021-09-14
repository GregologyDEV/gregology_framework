/// <reference types="@altv/types-client" />
/// <reference types="@altv/types-natives" />
import * as alt from 'alt-client'
import * as native from 'natives';
import { showCursor } from "../utility/misc.js"

alt.log("Załadowano => [client/contextmenu/client.js]")

alt.Player.local.setMeta("isContextMenuOpen", false)

const menuWebView = new alt.WebView("http://resource/client/contextmenu/html/index.html")
let menuState = false

export class ContextMenu {
    /**
     * @param {string} title Displayed title of context menu
     * @param {string} eventsGroup Begining of event sended after selected option **alt.emit([eventsGroup]:[eventName], data)**
     * @param {Array} options Array of options e.g. [{name: "Example", eventName: "exampleAction"}]
     */
    constructor(title, eventsGroup, options) {
        this._title = title;
        this._eventsGroup = eventsGroup;
        this._options = options;
        this._formatedOptions = this._options.map(obj=> ({ ...obj, index: this._options.indexOf(obj) }));
    }

    get title() {
        return this._title
    }

    set title(newTitle) {
        this._title = newTitle
    }

    get eventsGroup() {
        return this._eventsGroup
    }

    set eventsGroup(newEventsGroup) {
        this._eventsGroup = newEventsGroup
    }

    get options() {
        return this._formatedOptions
    }

    set options(newOptions) {
        this._options = newOptions
        this._formatedOptions = newOptions.map(obj=> ({ ...obj, index: newOptions.indexOf(obj) }))
    }

    addOption(name, eventName) {
        const option = {index: this._options.length, name: name, eventName: eventName}
        this._formatedOptions.push(option)
        this._options.push({name: name, eventName: eventName})

    }

    removeOption(eventName) {
        for (let opt of this._formatedOptions) {
            if (opt.eventName === eventName) {
                let optionIndex = this._formatedOptions.indexOf(opt)
                this._formatedOptions.splice(optionIndex, 1)
                //alt.log("REMOVING: " + eventName)
                let optionIndex2 = this._options.indexOf(opt)
                this._options.splice(optionIndex2, 1)
            }
        }
    }


    open(x, y) {
        if (!menuState) {
            const menu = { title: this._title, eventsGroup: this._eventsGroup, options: this._formatedOptions }
            menuWebView.emit("contextMenu:mount", menu, x, y)
            menuWebView.focus()
            showCursor(true)
            menuState = true
            alt.Player.local.setMeta("isContextMenuOpen", true)
        }
    }

    close() {
        menuWebView.emit("contextMenu:dismount")
        menuWebView.unfocus()
        showCursor(false)
        menuState = false
        alt.Player.local.setMeta("isContextMenuOpen", false)
    }

}

//menuWebView.on("contextMenu:Selected", ContextMenu.onSelect)


menuWebView.on("contextMenu:Selected", (eventsGroup, data) => {
    alt.emit(`${eventsGroup}:${data.eventName}`)
});

menuWebView.on("contextMenu:nothingSelected", (eventsGroup) => {
    alt.emit(`${eventsGroup}:nothingSelected`)
});

/*
const test1 = new ContextMenu("Pojazd", "vehicle", [{name: "Otwórz pojazd", eventName: "unlockVehicle"}, {name: "Otwórz drzwi", eventName: "openClosestVehicleDoor"}, {name: "[POLICJA] Przeszukaj pojazd", eventName: "policeSearchVehicle"}])
alt.setTimeout(() => {
    test1.open(25, 25)
}, 15000)

alt.on("vehicle:unlockVehicle", () => {
    alt.log("DZIALA")
})
*/
//alt.log(`TEST OPTIONS: ${test1.options[0].index}`)