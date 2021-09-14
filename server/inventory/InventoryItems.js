import * as alt from 'alt-server'
//import "@gregology_framework_assets/client/Documentation/gtaV-data/weapons.json";

export var Items = []

export class Item {
    constructor(scriptName, label, weight,canStack) {
        this.scriptName = scriptName;
        this.label = label;
        this.weight = weight;
        this.canStack = canStack;
    }
}

export const firstAidKit = new Item("firstAidKit", "Apteczka pierwszej pomocy", 1, true);
Items.push(firstAidKit);

export const radiophone = new Item("radiophone", "Radiotelefon", 1, true);
Items.push(radiophone);

// Kajdanki
export const handcuffs = new Item("handcuffs", "Kajdanki", 1, true);
Items.push(handcuffs);

export const handcuffs2 = new Item("handcuffs2", "Kajdany zespolone", 1, true);
Items.push(handcuffs2);

// Amunicja
export const ammoPistol = new Item("ammoPistol", "Amunicja 9mm", 1, true);
Items.push(ammoPistol);

export const ammoRifle = new Item("ammoRifle", "Amunicja 5.56mm", 1, true);
Items.push(ammoRifle);

export const ammoRifle2 = new Item("ammoRifle2", "Amunicja 7.62mm", 1, true);
Items.push(ammoRifle2);

export const ammoShotgun = new Item("ammoShotgun", "Amunicja kal. 12", 1, true);
Items.push(ammoShotgun);

export const ammoLMG = new Item("ammoLMG", "Amunicja kal. .45", 1, true);
Items.push(ammoLMG);

// Broń
export const weapon_pistol = new Item("weapon_pistol", "Pistolet", 1, false);
Items.push(weapon_pistol);

export const weapon_combatpistol = new Item("weapon_combatpistol", "Pistolet bojowy", 1, false);
Items.push(weapon_combatpistol);

export const weapon_pistol_mk2 = new Item("weapon_pistol_mk2", "Pistolet wer. 2", 1, false);
Items.push(weapon_pistol_mk2);

export const weapon_pistol50 = new Item("weapon_pistol50", "Pistolet .50", 1, false);
Items.push(weapon_pistol50);

export const weapon_vintagepistol = new Item("weapon_vintagepistol", "Pistolet Vintage", 1, false);
Items.push(weapon_vintagepistol);

export const weapon_snspistol = new Item("weapon_snspistol", "Pukawka", 1, false);
Items.push(weapon_snspistol);

export const weapon_snspistol_mk2 = new Item("weapon_snspistol_mk2", "Pukawka wer. 2", 1, false);
Items.push(weapon_snspistol_mk2);

export const weapon_heavypistol = new Item("weapon_heavypistol", "Ciężki pistolet", 1, false);
Items.push(weapon_heavypistol);

export const weapon_ceramicpistol = new Item("weapon_ceramicpistol", "Pistolet ceramiczny", 1, false);
Items.push(weapon_ceramicpistol);

export const weapon_revolver = new Item("weapon_revolver", "Ciężki rewolwer", 1, false);
Items.push(weapon_revolver);

export const weapon_revolver_mk2 = new Item("weapon_revolver_mk2", "Ciężki rewolwer wer. 2", 1, false);
Items.push(weapon_revolver_mk2);

export const weapon_doubleaction = new Item("weapon_doubleaction", "Rewolwer z samonapinaniem", 1, false);
Items.push(weapon_doubleaction);

export const weapon_navyrevolver = new Item("weapon_navyrevolver", "Rewolwer marynarki", 1, false);
Items.push(weapon_navyrevolver);

export const weapon_stungun = new Item("weapon_stungun", "Paralizator", 1, false);
Items.push(weapon_stungun);

// Komponenty do broni
export const weaponComponent_suppressor = new Item("weaponComponent_suppressor", "Tłumik", 1, true);
Items.push(weaponComponent_suppressor);

export const weaponComponent_magazine_extended = new Item("weaponComponent_magazine_extended", "Powiększony magazynek", 1, true);
Items.push(weaponComponent_magazine_extended);

export const weaponComponent_magazine_box = new Item("weaponComponent_magazine_box", "Magazynek bębnowy", 1, true);
Items.push(weaponComponent_magazine_box);

export const weaponComponent_grip = new Item("weaponComponent_grip", "Uchwyt", 1, true);
Items.push(weaponComponent_grip);

export const weaponComponent_scope_holo = new Item("weaponComponent_scope_holo", "Celownik holograficzny", 1, true);
Items.push(weaponComponent_scope_holo);

export const weaponComponent_scope_macro = new Item("weaponComponent_scope_macro", "Mała luneta", 1, true);
Items.push(weaponComponent_scope_macro);

/**
 * 
 * @param {string} scriptName Item script name
 * @returns {boolean} Whether item is valid and exists in Items array 
 */
export function isItemValid(scriptName) {
    let item = Items.find((item) => item.scriptName === scriptName)
    if (item) {
        return true
    } else {
        return false
    }
}


/**
 * 
 * @param {string} scriptName Item script name
 * @returns {Item} Item class [Object]
 */
export function getItem(scriptName) {
    let item = Items.find((item) => item.scriptName === scriptName)
    if (item) {
        return item
    } else {
        return undefined
    }
}

/**
 * 
 * @param {string} weapon Weapon name e.g. "weapon_pisol_mk2"
 * @param {string} component Weapon component item script name e.g. "weaponComponent_suppressor"
 * @returns {string} Weapon component name
 */

export function getMatchingComponentForWeapon(weapon, component) {
    if (!weapon || !component) throw new Error("Missing arguments")
    if (!alt.File.exists("@gregology_framework_assets/client/Documentation/gtaV-data/weapons.json")) throw new Error("Can not find 'weapons.json' file!")
    const weaponsData = JSON.parse(alt.File.read("@gregology_framework_assets/client/Documentation/gtaV-data/weapons.json"))
    const weaponToFind = weaponsData.find((weap) => weap.weaponName === weapon.toString())
    if (weaponToFind === undefined || !isItemValid(weapon)) return undefined
    const weaponComponents = weaponToFind.components

    if (component.toString().includes("suppressor")) {
        const component = weaponComponents.find((comp) => comp.component_name.includes("SUPP"))
        return component.component_name
    }

    if (component.toString().includes("magazine")) {
        if (component.toString().includes("extended")) {
            const component = weaponComponents.find((comp) => comp.component_name.includes("CLIP_02"))
            return component.component_name
        } else if (component.toString().includes("box")) {
            const component = weaponComponents.find((comp) => comp.component_name.includes("CLIP_03"))
            return component.component_name
        }
    }

    if (component.toString().includes("scope")) {
        if (component.toString().includes("holo")) {
            const component = weaponComponents.find((comp) => comp.component_name.includes("SIGHTS"))
            return component.component_name
        } /*else if (component.toString().includes("")) {
            Bardzo dużo różnych celowników, bałagan w nazwach
        }*/
    }

    if (component.toString().includes("flashlight")) {
        const component = weaponComponents.find((comp) => comp.component_name.includes("FLSH"))
        return component.component_name
    }

    if (component.toString().includes("grip")) {
        const component = weaponComponents.find((comp) => comp.component_name.includes("AFGRIP"))
        return component.component_name
    }
    //return weaponComponents
}
