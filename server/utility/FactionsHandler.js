import * as alt from 'alt-server'

var factions = []


export class Faction {
    constructor(scriptName, label, grades) {
        this._scriptName = scriptName;
        this._label = label;
        this._grades = grades;
    }

    get scriptName() {
        return this._scriptName;
    }

    get label() {
        return this._label;
    }

    get grades() {
        return this._grades;
    }

    getGradeScriptName(gradeToFind) {
        return this._grades[gradeToFind].scriptName;
    }

    getGradeLabel(gradeToFind) {
        return this._grades[gradeToFind].label;
    }

    getPayment(gradeToFind) {
        return this._grades[gradeToFind].payment;
    }
}

const policeGrades = [
    {
        scriptName: "cadet",
        label: "Kadet",
        payment: 200
    },
    {
        scriptName: "officer1",
        label: "Oficer st. 1",
        payment: 400
    },
    {
        scriptName: "officer2",
        label: "Oficer st. 2",
        payment: 450
    },
    {
        scriptName: "officer3",
        label: "Oficer st. 3",
        payment: 500
    },
    {
        scriptName: "officer4",
        label: "Oficer st. 4",
        payment: 550
    },
    {
        scriptName: "seregant1",
        label: "Sierżant st. 1",
        payment: 700
    },
    {
        scriptName: "seregant2",
        label: "Sierżant st. 2",
        payment: 800
    },
    {
        scriptName: "seregant3",
        label: "Sierżant st. 3",
        payment: 900
    },
    {
        scriptName: "lieutenant1",
        label: "Porucznik st. 1",
        payment: 1200
    },
    {
        scriptName: "lieutenant2",
        label: "Porucznik st. 2",
        payment: 1400
    },
    {
        scriptName: "assistant",
        label: "Zastępca szefa Policji",
        payment: 1650
    },
    {
        scriptName: "chief",
        label: "Szef Policji",
        payment: 2000
    },
]

const medicGrades = [
    {
        scriptName: "paramedic",
        label: "Ratownik medyczny",
        payment: 900
    },
    {
        scriptName: "assistant",
        label: "Asystent medyczny",
        payment: 1100
    },
    {
        scriptName: "doctor",
        label: "Doktor n. med.",
        payment: 1350
    },
    {
        scriptName: "specjalist",
        label: "Doktor specjalista",
        payment: 1500
    },
    {
        scriptName: "surgeon",
        label: "Lekarz chirurg",
        payment: 1800
    },
    {
        scriptName: "ordynator",
        label: "Ordynator",
        payment: 2000
    },
    {
        scriptName: "vice",
        label: "Zast. Dyrektora",
        payment: 2500
    },
    {
        scriptName: "boss",
        label: "Dyrektor szpitala",
        payment: 3000
    },
]

export const unemployed = new Faction("unemployed", "Bezrobotny", [{scriptName: "unemployed", label: "Bezrobotny", payment: 0}]);
factions.push(unemployed);

export const lspd = new Faction("lspd", "LSPD", policeGrades);
factions.push(lspd);

export const ems = new Faction("ems", "Szpital", medicGrades);
factions.push(ems);

/**
 * Checks if faction and grade exists and if it's valid
 * @param {string} faction Faction script name
 * @param {string} grade Faction grade
 * @returns [true, true] if all is valid 
 * @returns [true, false] if only faction is valid
 * @returns [false, false] if faction and grade is NOT valid
 */
export function isFactionAndGradeValid(faction, grade) {
    let factionToFound = factions.find((faction2) => faction2.scriptName === faction.toString());
    if (factionToFound) {
      let factionGrades = factionToFound.grades;
      if (factionGrades.length - 1 >= grade && grade >= 0) {
        return [true, true]
      } else {
        return [true, false]
      }
    } else {
      return [false, false]
    } 
}

/**
 * Returns faction class object
 * @param {string} scriptName Faction script name
 * @returns Faction Class [object] // null if not found
 */
export function getFaction(scriptName) {
    let factionToFound = factions.find((faction) => faction.scriptName === scriptName.toString());
    if (factionToFound) {
        return factionToFound
    } else return null
}