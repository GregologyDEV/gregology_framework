import * as alt from 'alt-server'
import mysql from "mysql";
import { connection } from "../base/server.js"

/*
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'altv'
});


connection.connect((err) => {
    if (err) throw err;
    console.log('Connected with database "altv"!');
});
*/

export function executeSqlQuery(query) {
    connection.query(query, (result, error) => {
        return result, error
    });
}

export function importTest() {
    alt.log("SPOKO SPOKO, NA CZILKU");
}

export function savePlayerPosition(player) {
    var sql = `UPDATE characters SET char_last_position = ? WHERE id = ?`;
    if (!player.data.activeCharacerID) return;
    var sqlVariables = [JSON.stringify(player.pos), player.data.activeCharacerID];
    connection.query(sql, sqlVariables, (err, res) => {
        //console.log(err, res)
    });
}

export function subVector(vector1, vector2) {
    let vector3 = {
        x: vector1.x - vector2.x,
        y: vector1.y - vector2.y,
        z: vector1.z - vector2.z
    }
    return vector3;
}

/*
export function subVector(vector1, vector2) {
	if (!vector1 || !vector2) return undefined
    return Math.sqrt(
        Math.pow(vector1.x - vector2.x, 2) +
        Math.pow(vector1.y - vector2.y, 2) +
		Math.pow(vector1.z - vector2.z, 2)
	);
}
*/

export function savePlayer(player) {
   //Probably unnesesary here
}

var dimensionsInUse = [];

export function getFreeDimension() {
    var randomDimension = getRandomIntInclusive(100, 15000)
    var isDimensionFree = dimensionsInUse.includes(randomDimension)
    if (isDimensionFree === false) {
        return randomDimension;
    } else {
        getFreeDimension()
    }
}

export function setDimensionInUse(dimension) {
    dimensionsInUse.push(dimension);
}

export function setDimensionAsNolongerNeeded(dimension) {
    for(var i = dimensionsInUse.length; i--;){
        if (dimensionsInUse[i] === dimension) dimensionsInUse.splice(i, 1);
    }
}

export function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}