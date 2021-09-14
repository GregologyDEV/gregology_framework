/// <reference types="@altv/types-server" />
import * as alt from 'alt-server'

var organisations = [];

export class Organisation {
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
}

