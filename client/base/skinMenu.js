import * as alt from 'alt-client'
import * as native from 'natives';
import * as NativeUI from '../includes/NativeUIMenu/NativeUi.js';

const menu = new NativeUI.Menu("Skin Menu", "Menu edycji ubioru postaci", new NativeUI.Point(50, 50))
const masksItemBind = new NativeUI.UIMenuItem("Maski", "") // componentID: 1
const torsosItemBind = new NativeUI.UIMenuItem("Torso", "")  // componentID: 3
const legsItemBind = new NativeUI.UIMenuItem("Spodnie", "")  // componentID: 4
const bagsItemBind = new NativeUI.UIMenuItem("Torby i plecaki", "")  // componentID: 5
const shoesItemBind = new NativeUI.UIMenuItem("Buty", "")  // componentID: 6
const accesoriesItemBind = new NativeUI.UIMenuItem("Akcesoria", "") // componentID: 7
const undershirtsItemBind = new NativeUI.UIMenuItem("Podkoszulki", "") // componentID: 8
const armorsItemBind = new NativeUI.UIMenuItem("Pancerze i kamizelki", "") // componentID: 9
const decalsItemBind = new NativeUI.UIMenuItem("Oznaczenia", "") // componentID: 10
const topsItemBind = new NativeUI.UIMenuItem("Topy", "") // componentID: 11


///////////////////////////////////////////////////////////////////////////////////////////////////////////
let maskDrawable = [];
let maskTextures = [];

for (let i = 0; i < native.getNumberOfPedDrawableVariations(alt.Player.local.scriptID, 1) + 1; i++) {
    maskDrawable.push(i.toString())
}

let maskTextureLimit = native.getNumberOfPedTextureVariations(alt.Player.local.scriptID, 1, native.getPedDrawableVariation(alt.Player.local.scriptID, 1));
for (let i = 0; i < maskTextureLimit +1; i++) {
    maskTextures.push(i.toString());
}

const maskMenu = new NativeUI.Menu("Maski", "", new NativeUI.Point(50, 50 ))
maskMenu.Visible = false;
menu.AddSubMenu(maskMenu, masksItemBind);

//let maskItem = new NativeUI.UIMenuAutoListItem("Maska", "", -800, 800, 1, native.getNumberOfPedDrawableVariations(alt.Player.local.scriptID, 1))
//let maskTextureItem = new NativeUI.UIMenuAutoListItem("Wariant maski", "", -800, 800, 1, native.getNumberOfPedTextureVariations(alt.Player.local.scriptID, 1, native.getPedDrawableVariation(alt.Player.local.scriptID, 1)))
let maskItem = new NativeUI.UIMenuListItem("Maska", "", new NativeUI.ItemsCollection(maskDrawable), 0)
let maskTextureItem = new NativeUI.UIMenuListItem("Wariant maski", "", new NativeUI.ItemsCollection(maskTextures))

maskMenu.AddItem(maskItem);
maskMenu.AddItem(maskTextureItem);

maskMenu.ListChange.on((selectedItem, selectedItemIndex) => {
    if (selectedItem === maskItem) {
        native.setPedComponentVariation(alt.Player.local.scriptID, 1, maskItem.SelectedValue, 0, 0);
        let maskTexturesArray = []
        let maskTextureLimit2 = native.getNumberOfPedTextureVariations(alt.Player.local.scriptID, 1, native.getPedDrawableVariation(alt.Player.local.scriptID, 1));
        for (let i = 0; i < maskTextureLimit2 +1; i++) {
            maskTexturesArray.push(i.toString());
        }
        maskTextureItem.Collection = new NativeUI.ItemsCollection(maskTexturesArray).getListItems()
    } else if (selectedItem === maskTextureItem) {
        native.setPedComponentVariation(alt.Player.local.scriptID, 1, maskItem.SelectedValue, maskTextureItem.SelectedValue, 0);
    }
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////
let torsoDrawable = [];
let torsoTextures = [];

for (let i = 0; i < native.getNumberOfPedDrawableVariations(alt.Player.local.scriptID, 3) + 1; i++) {
    torsoDrawable.push(i.toString())
}

let torsoTextureLimit = native.getNumberOfPedTextureVariations(alt.Player.local.scriptID, 3, native.getPedDrawableVariation(alt.Player.local.scriptID, 3));
for (let i = 0; i < torsoTextureLimit +1; i++) {
    torsoTextures.push(i.toString());
}

const torsoMenu = new NativeUI.Menu("Ramiona", "", new NativeUI.Point(50, 50))
torsoMenu.Visible = false;
menu.AddSubMenu(torsoMenu, torsosItemBind);

let torsoItem = new NativeUI.UIMenuListItem("Ramiona", "", new NativeUI.ItemsCollection(torsoDrawable), 0)
let torsoTextureItem = new NativeUI.UIMenuListItem("Wariant ramion", "", new NativeUI.ItemsCollection(torsoTextures))

torsoMenu.AddItem(torsoItem);
torsoMenu.AddItem(torsoTextureItem);

torsoMenu.ListChange.on((selectedItem, selectedItemIndex) => {
    if (selectedItem === torsoItem) {
        native.setPedComponentVariation(alt.Player.local.scriptID, 3, torsoItem.SelectedValue, 0, 0);
        let torsoTexturesArray = []
        let torsoTextureLimit2 = native.getNumberOfPedTextureVariations(alt.Player.local.scriptID, 3, native.getPedDrawableVariation(alt.Player.local.scriptID, 3));
        for (let i = 0; i < torsoTextureLimit2 +1; i++) {
            torsoTexturesArray.push(i.toString());
        }
        torsoTextureItem.Collection = new NativeUI.ItemsCollection(torsoTexturesArray).getListItems()
    } else if (selectedItem === torsoTextureItem) {
        native.setPedComponentVariation(alt.Player.local.scriptID, 3, torsoItem.SelectedValue, torsoTextureItem.SelectedValue, 0);
    }
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////
let legsDrawable = [];
let legsTextures = [];

for (let i = 0; i < native.getNumberOfPedDrawableVariations(alt.Player.local.scriptID, 4) + 1; i++) {
    legsDrawable.push(i.toString())
}

let legsTextureLimit = native.getNumberOfPedTextureVariations(alt.Player.local.scriptID, 4, native.getPedDrawableVariation(alt.Player.local.scriptID, 4));
for (let i = 0; i < legsTextureLimit +1; i++) {
    legsTextures.push(i.toString());
}

const legsMenu = new NativeUI.Menu("Spodnie", "", new NativeUI.Point(50, 50 ))
legsMenu.Visible = false;
menu.AddSubMenu(legsMenu, legsItemBind);

let legsItem = new NativeUI.UIMenuListItem("Spodnie", "", new NativeUI.ItemsCollection(legsDrawable), 0)
let legsTextureItem = new NativeUI.UIMenuListItem("Wariant spodnie", "", new NativeUI.ItemsCollection(legsTextures))

legsMenu.AddItem(legsItem);
legsMenu.AddItem(legsTextureItem);

legsMenu.ListChange.on((selectedItem, selectedItemIndex) => {
    if (selectedItem === legsItem) {
        native.setPedComponentVariation(alt.Player.local.scriptID, 4, legsItem.SelectedValue, 0, 0);
        let legsTexturesArray = []
        let legsTextureLimit2 = native.getNumberOfPedTextureVariations(alt.Player.local.scriptID, 4, native.getPedDrawableVariation(alt.Player.local.scriptID, 4));
        for (let i = 0; i < legsTextureLimit2 +1; i++) {
            legsTexturesArray.push(i.toString());
        }
        legsTextureItem.Collection = new NativeUI.ItemsCollection(legsTexturesArray).getListItems()
    } else if (selectedItem === legsTextureItem) {
        native.setPedComponentVariation(alt.Player.local.scriptID, 4, legsItem.SelectedValue, legsTextureItem.SelectedValue, 0);
    }
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////
let bagsDrawable = [];
let bagsTextures = [];

for (let i = 0; i < native.getNumberOfPedDrawableVariations(alt.Player.local.scriptID, 5) + 1; i++) {
    bagsDrawable.push(i.toString())
}

let bagsTextureLimit = native.getNumberOfPedTextureVariations(alt.Player.local.scriptID, 5, native.getPedDrawableVariation(alt.Player.local.scriptID, 5));
for (let i = 0; i < bagsTextureLimit +1; i++) {
    bagsTextures.push(i.toString());
}

const bagsMenu = new NativeUI.Menu("Torby", "", new NativeUI.Point(50, 50 ))
bagsMenu.Visible = false;
menu.AddSubMenu(bagsMenu, bagsItemBind);

let bagsItem = new NativeUI.UIMenuListItem("Torba", "", new NativeUI.ItemsCollection(bagsDrawable), 0)
let bagsTextureItem = new NativeUI.UIMenuListItem("Wariant torby", "", new NativeUI.ItemsCollection(bagsTextures))

bagsMenu.AddItem(bagsItem);
bagsMenu.AddItem(bagsTextureItem);

bagsMenu.ListChange.on((selectedItem, selectedItemIndex) => {
    if (selectedItem === bagsItem) {
        native.setPedComponentVariation(alt.Player.local.scriptID, 5, bagsItem.SelectedValue, 0, 0);
        let bagsTexturesArray = []
        let bagsTextureLimit2 = native.getNumberOfPedTextureVariations(alt.Player.local.scriptID, 5, native.getPedDrawableVariation(alt.Player.local.scriptID, 5));
        for (let i = 0; i < bagsTextureLimit2 +1; i++) {
            bagsTexturesArray.push(i.toString());
        }
        bagsTextureItem.Collection = new NativeUI.ItemsCollection(bagsTexturesArray).getListItems()
    } else if (selectedItem === bagsTextureItem) {
        native.setPedComponentVariation(alt.Player.local.scriptID, 5, bagsItem.SelectedValue, bagsTextureItem.SelectedValue, 0);
    }
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////
let shoesDrawable = [];
let shoesTextures = [];

for (let i = 0; i < native.getNumberOfPedDrawableVariations(alt.Player.local.scriptID, 6) + 1; i++) {
    shoesDrawable.push(i.toString())
}

let shoesTextureLimit = native.getNumberOfPedTextureVariations(alt.Player.local.scriptID, 6, native.getPedDrawableVariation(alt.Player.local.scriptID, 6));
for (let i = 0; i < shoesTextureLimit +1; i++) {
    shoesTextures.push(i.toString());
}

const shoesMenu = new NativeUI.Menu("Buty", "", new NativeUI.Point(50, 50 ))
shoesMenu.Visible = false;
menu.AddSubMenu(shoesMenu, shoesItemBind);

let shoesItem = new NativeUI.UIMenuListItem("Buty", "", new NativeUI.ItemsCollection(shoesDrawable), 0)
let shoesTextureItem = new NativeUI.UIMenuListItem("Wariant butów", "", new NativeUI.ItemsCollection(shoesTextures))

shoesMenu.AddItem(shoesItem);
shoesMenu.AddItem(shoesTextureItem);

shoesMenu.ListChange.on((selectedItem, selectedItemIndex) => {
    if (selectedItem === shoesItem) {
        native.setPedComponentVariation(alt.Player.local.scriptID, 6, shoesItem.SelectedValue, 0, 0);
        let shoesTexturesArray = []
        let shoesTextureLimit2 = native.getNumberOfPedTextureVariations(alt.Player.local.scriptID, 6, native.getPedDrawableVariation(alt.Player.local.scriptID, 6));
        for (let i = 0; i < shoesTextureLimit2 +1; i++) {
            shoesTexturesArray.push(i.toString());
        }
        shoesTextureItem.Collection = new NativeUI.ItemsCollection(shoesTexturesArray).getListItems()
    } else if (selectedItem === shoesTextureItem) {
        native.setPedComponentVariation(alt.Player.local.scriptID, 6, shoesItem.SelectedValue, shoesTextureItem.SelectedValue, 0);
    }
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////

let accesoriesDrawable = [];
let accesoriesTextures = [];

for (let i = 0; i < native.getNumberOfPedDrawableVariations(alt.Player.local.scriptID, 7) + 1; i++) {
    accesoriesDrawable.push(i.toString())
}

let accesoriesTextureLimit = native.getNumberOfPedTextureVariations(alt.Player.local.scriptID, 7, native.getPedDrawableVariation(alt.Player.local.scriptID, 7));
for (let i = 0; i < accesoriesTextureLimit +1; i++) {
    accesoriesTextures.push(i.toString());
}

const accesoriesMenu = new NativeUI.Menu("Akcesoria", "", new NativeUI.Point(50, 50 ))
accesoriesMenu.Visible = false;
menu.AddSubMenu(accesoriesMenu, accesoriesItemBind);

let accesoriesItem = new NativeUI.UIMenuListItem("Akcesoria", "", new NativeUI.ItemsCollection(accesoriesDrawable), 0)
let accesoriesTextureItem = new NativeUI.UIMenuListItem("Wariant akcesoria", "", new NativeUI.ItemsCollection(accesoriesTextures))

accesoriesMenu.AddItem(accesoriesItem);
accesoriesMenu.AddItem(accesoriesTextureItem);

accesoriesMenu.ListChange.on((selectedItem, selectedItemIndex) => {
    if (selectedItem === accesoriesItem) {
        native.setPedComponentVariation(alt.Player.local.scriptID, 7, accesoriesItem.SelectedValue, 0, 0);
        let accesoriesTexturesArray = []
        let accesoriesTextureLimit2 = native.getNumberOfPedTextureVariations(alt.Player.local.scriptID, 7, native.getPedDrawableVariation(alt.Player.local.scriptID, 7));
        for (let i = 0; i < accesoriesTextureLimit2 +1; i++) {
            accesoriesTexturesArray.push(i.toString());
        }
        accesoriesTextureItem.Collection = new NativeUI.ItemsCollection(accesoriesTexturesArray).getListItems()
    } else if (selectedItem === accesoriesTextureItem) {
        native.setPedComponentVariation(alt.Player.local.scriptID, 7, accesoriesItem.SelectedValue, accesoriesTextureItem.SelectedValue, 0);
    }
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////

let undershirtsDrawable = [];
let undershirtsTextures = [];

for (let i = 0; i < native.getNumberOfPedDrawableVariations(alt.Player.local.scriptID, 8) + 1; i++) {
    undershirtsDrawable.push(i.toString())
}

let undershirtsTextureLimit = native.getNumberOfPedTextureVariations(alt.Player.local.scriptID, 8, native.getPedDrawableVariation(alt.Player.local.scriptID, 8));
for (let i = 0; i < undershirtsTextureLimit +1; i++) {
    undershirtsTextures.push(i.toString());
}

const undershirtsMenu = new NativeUI.Menu("Podkoszulki", "", new NativeUI.Point(50, 50 ))
undershirtsMenu.Visible = false;
menu.AddSubMenu(undershirtsMenu, undershirtsItemBind);

let undershirtsItem = new NativeUI.UIMenuListItem("Podkoszulki", "", new NativeUI.ItemsCollection(undershirtsDrawable), 0)
let undershirtsTextureItem = new NativeUI.UIMenuListItem("Wariant podkoszulka", "", new NativeUI.ItemsCollection(undershirtsTextures))

undershirtsMenu.AddItem(undershirtsItem);
undershirtsMenu.AddItem(undershirtsTextureItem);

undershirtsMenu.ListChange.on((selectedItem, selectedItemIndex) => {
    if (selectedItem === undershirtsItem) {
        native.setPedComponentVariation(alt.Player.local.scriptID, 8, undershirtsItem.SelectedValue, 0, 0);
        let undershirtsTexturesArray = []
        let undershirtsTextureLimit2 = native.getNumberOfPedTextureVariations(alt.Player.local.scriptID, 8, native.getPedDrawableVariation(alt.Player.local.scriptID, 8));
        for (let i = 0; i < undershirtsTextureLimit2 +1; i++) {
            undershirtsTexturesArray.push(i.toString());
        }
        undershirtsTextureItem.Collection = new NativeUI.ItemsCollection(undershirtsTexturesArray).getListItems()
    } else if (selectedItem === undershirtsTextureItem) {
        native.setPedComponentVariation(alt.Player.local.scriptID, 8, undershirtsItem.SelectedValue, undershirtsTextureItem.SelectedValue, 0);
    }
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////

let armorsDrawable = [];
let armorsTextures = [];

for (let i = 0; i < native.getNumberOfPedDrawableVariations(alt.Player.local.scriptID, 9) + 1; i++) {
    armorsDrawable.push(i.toString())
}

let armorsTextureLimit = native.getNumberOfPedTextureVariations(alt.Player.local.scriptID, 9, native.getPedDrawableVariation(alt.Player.local.scriptID, 9));
for (let i = 0; i < armorsTextureLimit +1; i++) {
    armorsTextures.push(i.toString());
}

const armorsMenu = new NativeUI.Menu("Kamizelki", "", new NativeUI.Point(50, 50 ))
armorsMenu.Visible = false;
menu.AddSubMenu(armorsMenu, armorsItemBind);

let armorsItem = new NativeUI.UIMenuListItem("Kamizelki", "", new NativeUI.ItemsCollection(armorsDrawable), 0)
let armorsTextureItem = new NativeUI.UIMenuListItem("Wariant kamizelki", "", new NativeUI.ItemsCollection(armorsTextures))

armorsMenu.AddItem(armorsItem);
armorsMenu.AddItem(armorsTextureItem);

armorsMenu.ListChange.on((selectedItem, selectedItemIndex) => {
    if (selectedItem === armorsItem) {
        native.setPedComponentVariation(alt.Player.local.scriptID, 9, armorsItem.SelectedValue, 0, 0);
        let armorsTexturesArray = []
        let armorsTextureLimit2 = native.getNumberOfPedTextureVariations(alt.Player.local.scriptID, 9, native.getPedDrawableVariation(alt.Player.local.scriptID, 9));
        for (let i = 0; i < armorsTextureLimit2 +1; i++) {
            armorsTexturesArray.push(i.toString());
        }
        armorsTextureItem.Collection = new NativeUI.ItemsCollection(armorsTexturesArray).getListItems()
    } else if (selectedItem === armorsTextureItem) {
        native.setPedComponentVariation(alt.Player.local.scriptID, 9, armorsItem.SelectedValue, armorsTextureItem.SelectedValue, 0);
    }
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////

let decalsDrawable = [];
let decalsTextures = [];

for (let i = 0; i < native.getNumberOfPedDrawableVariations(alt.Player.local.scriptID, 10) + 1; i++) {
    decalsDrawable.push(i.toString())
}

let decalsTextureLimit = native.getNumberOfPedTextureVariations(alt.Player.local.scriptID, 10, native.getPedDrawableVariation(alt.Player.local.scriptID, 10));
for (let i = 0; i < decalsTextureLimit +1; i++) {
    decalsTextures.push(i.toString());
}

const decalsMenu = new NativeUI.Menu("Oznaczenia", "", new NativeUI.Point(50, 50 ))
decalsMenu.Visible = false;
menu.AddSubMenu(decalsMenu, decalsItemBind);

let decalsItem = new NativeUI.UIMenuListItem("Oznaczenia", "", new NativeUI.ItemsCollection(decalsDrawable), 0)
let decalsTextureItem = new NativeUI.UIMenuListItem("Wariant oznaczenia", "", new NativeUI.ItemsCollection(decalsTextures))

decalsMenu.AddItem(decalsItem);
decalsMenu.AddItem(decalsTextureItem);

decalsMenu.ListChange.on((selectedItem, selectedItemIndex) => {
    if (selectedItem === decalsItem) {
        native.setPedComponentVariation(alt.Player.local.scriptID, 10, decalsItem.SelectedValue, 0, 0);
        let decalsTexturesArray = []
        let decalsTextureLimit2 = native.getNumberOfPedTextureVariations(alt.Player.local.scriptID, 10, native.getPedDrawableVariation(alt.Player.local.scriptID, 10));
        for (let i = 0; i < decalsTextureLimit2 +1; i++) {
            decalsTexturesArray.push(i.toString());
        }
        decalsTextureItem.Collection = new NativeUI.ItemsCollection(decalsTexturesArray).getListItems()
    } else if (selectedItem === decalsTextureItem) {
        native.setPedComponentVariation(alt.Player.local.scriptID, 10, decalsItem.SelectedValue, decalsTextureItem.SelectedValue, 0);
    }
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////

let topsDrawable = [];
let topsTextures = [];

for (let i = 0; i < native.getNumberOfPedDrawableVariations(alt.Player.local.scriptID, 11) + 1; i++) {
    topsDrawable.push(i.toString())
}

let topsTextureLimit = native.getNumberOfPedTextureVariations(alt.Player.local.scriptID, 11, native.getPedDrawableVariation(alt.Player.local.scriptID, 11));
for (let i = 0; i < topsTextureLimit +1; i++) {
    topsTextures.push(i.toString());
}

const topsMenu = new NativeUI.Menu("Topy", "", new NativeUI.Point(50, 50 ))
topsMenu.Visible = false;
menu.AddSubMenu(topsMenu, topsItemBind);

let topsItem = new NativeUI.UIMenuListItem("Topy", "", new NativeUI.ItemsCollection(topsDrawable), 0)
let topsTextureItem = new NativeUI.UIMenuListItem("Wariant topu", "", new NativeUI.ItemsCollection(topsTextures))

topsMenu.AddItem(topsItem);
topsMenu.AddItem(topsTextureItem);

topsMenu.ListChange.on((selectedItem, selectedItemIndex) => {
    if (selectedItem === topsItem) {
        native.setPedComponentVariation(alt.Player.local.scriptID, 11, topsItem.SelectedValue, 0, 0);
        let topsTexturesArray = []
        let topsTextureLimit2 = native.getNumberOfPedTextureVariations(alt.Player.local.scriptID, 11, native.getPedDrawableVariation(alt.Player.local.scriptID, 11));
        for (let i = 0; i < topsTextureLimit2 +1; i++) {
            topsTexturesArray.push(i.toString());
        }
        topsTextureItem.Collection = new NativeUI.ItemsCollection(topsTexturesArray).getListItems()
    } else if (selectedItem === topsTextureItem) {
        native.setPedComponentVariation(alt.Player.local.scriptID, 11, topsItem.SelectedValue, topsTextureItem.SelectedValue, 0);
    }
});










/*
maskMenu.ItemSelect.on((selectedItem, selectedItemIndex) => {
    let drawable = maskItem.SelectedValue;
    let texture = maskTextureItem.SelectedValue;

    switch (selectedItemIndex) {
        case 0: {
            native.setPedComponentVariation(alt.Player.local.scriptID, 1, drawable, 0, 0);
            let maskTextureNewArray = []
            for (let i = 0; i < native.getNumberOfPedTextureVariations(alt.Player.local.scriptID, 1, native.getPedDrawableVariation(alt.Player.local.scriptID, 1)) + 1; i++) {
                maskTextureNewArray.push(i.toString());
            }

            maskTextureItem.Collection = new NativeUI.ItemsCollection(maskTextureNewArray).getListItems();
        }

        case 1: {
            native.setPedComponentVariation(alt.Player.local.scriptID, 1, drawable, texture, 0);
        }

        default: {

        }
    }
})
*/

alt.onServer('base:openSkinMenu', () => {
    menu.Visible = true;
});