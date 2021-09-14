/// <reference types="@altv/types-client" />
/// <reference types="@altv/types-natives" />
import * as alt from 'alt-client'
import * as native from 'natives';
import "@gregology_framework_assets/client/Documentation/vehicles.json";

var helpText;

export class HelpText {
	constructor(text, time) {
		this.text = text;
		this.time = Date.now() + time;
		helpText = this;
	}

	Draw() {
		if (this.time < Date.now()) {
			helpText = undefined;
		}

		native.beginTextCommandDisplayHelp('STRING');
		native.addTextComponentSubstringPlayerName(this.text);
		native.endTextCommandDisplayHelp(0, false, true, 0);
	}
}

export function spinner(time, type, msg) {
    native.beginTextCommandBusyspinnerOn("STRING");
    native.addTextComponentSubstringPlayerName(msg);
    native.endTextCommandBusyspinnerOn(type);

    alt.setTimeout(() => {
		native.busyspinnerOff();
		native.preloadBusyspinner();
    }, time);
}

export function drawText3D(msg, x, y, z, scale, fontType, r, g, b, a, useOutline = true, useDropShadow = true, layer = 0) {
	native.setDrawOrigin(x, y, z, 0);
	native.beginTextCommandDisplayText("STRING");
	native.addTextComponentSubstringPlayerName(msg);
	native.setTextFont(fontType);
	native.setTextScale(1, scale);
	native.setTextWrap(0.0, 1.0);
	native.setTextCentre(true);
	native.setTextColour(r, g, b, a);
	native.setScriptGfxDrawOrder(layer);

	if (useOutline) native.setTextOutline();
	if (useDropShadow) native.setTextDropShadow();

	native.endTextCommandDisplayText(0, 0, 0);
	native.clearDrawOrigin();
}

/**
 * Draw text 2D on screen
 * @param {string} text 
 * @param {number} x 
 * @param {number} y 
 * @param {number} scale 
 * @param {number} fontType 
 * @param {number} r 
 * @param {number} g 
 * @param {number} b 
 * @param {number} a 
 * @param {boolean} useOutline 
 * @param {boolean} useDropShadow 
 */

export function drawText(text, x, y, scale, fontType, r, g, b, a, useOutline = true, useDropShadow = true) {
    native.setTextFont(fontType);
    native.setTextProportional(false);
    native.setTextScale(scale, scale);
    native.setTextColour(r, g, b, a);
    native.setTextEdge(2, 0, 0, 0, 150);
    if (useDropShadow) {
        native.setTextDropshadow(0, 0, 0, 0, 255);
        native.setTextDropShadow();
    }
    if (useOutline)
	native.setTextOutline();

    native.setTextCentre(true);
    //game.setTextJustification(0);
    //game.setTextWrap(0.0, 1.0);

    native.beginTextCommandDisplayText("CELL_EMAIL_BCON");
    //Split text into pieces of max 99 chars blocks
    text.match(/.{1,99}/g).forEach(textBlock => {
        native.addTextComponentSubstringPlayerName(textBlock);
    });
    native.endTextCommandDisplayText(x, y, 0.0);
}

// player = alt.Player.local
/*
export function getClosestPlayer(player, radius = 3) {
	var playerCoords = player.pos	// Vector3
	var playersInRangeArrayMaster = [];
	var playersInRangeDistances = [];
	for(let pl of alt.Player.all){
		// Do wyrzucenia z alt.Player.all local playera
		var pl_coord = pl.pos // Vector3
		if (distance(playerCoords, pl.pos) !== undefined && distance(playerCoords, pl.pos) < radius && player !== pl) {
			playersInRangeArrayMaster.push([pl, distance(playerCoords, pl.pos)]);
			playersInRangeDistances.push(distance(playerCoords, pl.pos))
		}
	}
	var playersInRangeMap = new Map(playersInRangeArrayMaster)
	var minDistance = Math.min(playersInRangeDistances);
	var player = playersInRangeMap.get(minDistance);
	if (player) {
		return player;
	} else {
		return undefined;
	}
}*/

export function getClosestPlayers(player, radius = 5) {
	var playerCoords = player.pos
	var playersInRange = [];

	for (let pl of alt.Player.all) {
		let dist = distance(playerCoords, pl.pos);
		if (dist && dist < radius && pl !== player) {
			playersInRange.push(pl)
		}
	}

	playersInRange.sort((a, b) => {
		if (a.pos && b.pos) {
			return distance(playerCoords, a.pos) - distance(playerCoords, b.pos);
		}

		return distance(playerCoords, a.pos) - distance(playerCoords, b.pos);
	})

	return playersInRange;
}

export function distance(vector1, vector2) {
	if (!vector1 || !vector2) return undefined
    return Math.sqrt(
        Math.pow(vector1.x - vector2.x, 2) +
        Math.pow(vector1.y - vector2.y, 2) +
		Math.pow(vector1.z - vector2.z, 2)
	);
}

export function getDirectionFromRotation(rotation) {
    var z = rotation.z * (Math.PI / 180.0);
    var x = rotation.x * (Math.PI / 180.0);
    var num = Math.abs(Math.cos(x));

    return new alt.Vector3(
        (-Math.sin(z) * num),
        (Math.cos(z) * num),
        Math.sin(x)
    );
};

/**
 * Animations flags. Use e.g. **animationsFlags.Loop || animationsFlags.AllowPlayerControl**
 */
export const animationsFlags = {
	Loop: 1 << 0,
	StopOnLastFrame: 1 << 1,
	OnlyAnimateUpperBody: 1 << 4,
	AllowPlayerControl: 1 << 5,
	Cancellable: 1 << 7
}

export const pedType = {
	PED_TYPE_PLAYER_0: 0,
	PED_TYPE_PLAYER_1: 1,
	PED_TYPE_NETWORK_PLAYER: 2,
	PED_TYPE_PLAYER_2: 3,
	PED_TYPE_CIVMALE: 4,
	PED_TYPE_CIVFEMALE: 5,
	PED_TYPE_COP: 6,
	PED_TYPE_GANG_ALBANIAN: 7,
	PED_TYPE_GANG_BIKER_1: 8,
	PED_TYPE_GANG_BIKER_2: 9,
	PED_TYPE_GANG_ITALIAN: 10,
	PED_TYPE_GANG_RUSSIAN: 11,
	PED_TYPE_GANG_RUSSIAN_2: 12,
	PED_TYPE_GANG_IRISH: 13,
	PED_TYPE_GANG_JAMAICAN: 14,
	PED_TYPE_GANG_AFRICAN_AMERICAN: 15,
	PED_TYPE_GANG_KOREAN: 16,
	PED_TYPE_GANG_CHINESE_JAPANESE: 17,
	PED_TYPE_GANG_PUERTO_RICAN: 18,
	PED_TYPE_DEALER: 19,
	PED_TYPE_MEDIC: 20,
	PED_TYPE_FIREMAN: 21,
	PED_TYPE_CRIMINAL: 22,
	PED_TYPE_BUM: 23,
	PED_TYPE_PROSTITUTE: 24,
	PED_TYPE_SPECIAL: 25,
	PED_TYPE_MISSION: 26,
	PED_TYPE_SWAT: 27,
	PED_TYPE_ANIMAL: 28,
	PED_TYPE_ARMY: 29
}

/**
 * 
 * @param {string} dict Sprite dictionary name
 * @returns {Promise}
 */
export async function requestTextureDict(dict) {
    native.requestStreamedTextureDict(dict, true);
    
    return new Promise((resolve, reject) => {
        let attempt = 0;
        const tick = alt.everyTick(() => {
            if (attempt >= 255 && !native.hasStreamedTextureDictLoaded(dict)) {
                reject()
                alt.clearEveryTick(tick);
                return;
            }

            if (native.hasStreamedTextureDictLoaded(dict)) {
                resolve();
                alt.clearEveryTick(tick);
                return;
            }

            attempt++;
        });
    });
}


/**
 * Draws 3D sprite in game. Need to be called every frame
 * @param {string} dictionary 
 * @param {string} name 
 * @param {alt.Vector3} position Sprite position in game world. Defined by alt.Vector3 class 
 * @param {alt.RGBA} color Sprite color. Defined by alt.RGBA class. Default white
 * @param {number} scale Default 1
 */
export async function draw3DSprite(dictionary, name, position, color = new alt.RGBA(255, 255, 255, 255), scale = 1) {
	if (native.hasStreamedTextureDictLoaded(dictionary)) await requestTextureDict(dictionary);

	const camCoord = new alt.Vector3(native.getGameplayCamCoord().x, native.getGameplayCamCoord().y, native.getGameplayCamCoord().z);
	const camFOV = native.getGameplayCamFov();
	const distanceCamToPosition = distance(position, camCoord);
	const width = (1 / (distanceCamToPosition * 4)) * 2 * (1 / camFOV) * 10 * scale;
	const height = width * native.getAspectRatio(false);

	native.setDrawOrigin(parseFloat(position.x), parseFloat(position.y), parseFloat(position.z), 0);
	native.drawSprite(dictionary, name, 0.0, 0.0, width, height, 0.0, color.r, color.g, color.b, color.a, false)
	native.clearDrawOrigin()
}

export function getVehiclePlateType(vehName) {
	if (!alt.File.exists("@gregology_framework_assets/client/Documentation/vehicles.json")) return undefined
	const vehicleList = JSON.parse(alt.File.read("@gregology_framework_assets/client/Documentation/vehicles.json"))
	const vehicleToFind = vehicleList.find((veh) => veh.Name === vehName)
	//console.log(alt.File.exists("@gregology_framework_assets/client/Documentation/vehicles.json"))

	if (!vehicleToFind) return undefined
	if (vehicleToFind) return vehicleToFind.PlateType
}

/**
 * Draws 3D box. Needs to be called every frame. Can be used to visualize CuboidColshape boundaries
 * @param {Number} vec1 Vector3 object containing first coordinates variable
 * @param {Number} vec2 Vector3 object containing second coordinates variable
 */
export function drawDevBox3D(vec1, vec2) {
	let height = vec2.z - vec1.z;
	let width = vec2.y - vec1.y;
	let length = vec2.x - vec1.x;

	const color = new alt.RGBA(255, 50, 50, 255)

	const ABCD_Rectangle = [new alt.Vector3(vec1.x, vec1.y, vec1.z), new alt.Vector3(vec1.x + length, vec1.y, vec1.z), new alt.Vector3(vec1.x + length, vec1.y + width, vec1.z), new alt.Vector3(vec1.x, vec1.y + width, vec1.z)]
	const EFGH_Rectangle = [new alt.Vector3(vec1.x, vec1.y, vec1.z + height), new alt.Vector3(vec1.x + length, vec1.y, vec1.z + height), new alt.Vector3(vec1.x + length, vec1.y + width, vec1.z + height), new alt.Vector3(vec1.x, vec1.y + width, vec1.z + height)]

	native.drawLine(vec1.x, vec1.y, vec1.z, vec1.x + length, vec1.y, vec1.z, color.r, color.g, color.b, color.a) // AB
	native.drawLine(vec1.x + length, vec1.y, vec1.z, vec1.x + length, vec1.y + width, vec1.z, color.r, color.g, color.b, color.a) // BC
	native.drawLine(vec1.x + length, vec1.y + width, vec1.z, vec1.x, vec1.y + width, vec1.z, color.r, color.g, color.b, color.a) // CD
	native.drawLine(vec1.x, vec1.y + width, vec1.z, vec1.x, vec1.y, vec1.z, color.r, color.g, color.b, color.a) // DA

	native.drawLine(EFGH_Rectangle[0].x, EFGH_Rectangle[0].y, EFGH_Rectangle[0].z, EFGH_Rectangle[1].x, EFGH_Rectangle[1].y, EFGH_Rectangle[1].z, color.r, color.g, color.b, color.a) // EF
	native.drawLine(EFGH_Rectangle[1].x, EFGH_Rectangle[1].y, EFGH_Rectangle[1].z, EFGH_Rectangle[2].x, EFGH_Rectangle[2].y, EFGH_Rectangle[2].z, color.r, color.g, color.b, color.a) // FG
	native.drawLine(EFGH_Rectangle[2].x, EFGH_Rectangle[2].y, EFGH_Rectangle[2].z, EFGH_Rectangle[3].x, EFGH_Rectangle[3].y, EFGH_Rectangle[3].z, color.r, color.g, color.b, color.a) // GH
	native.drawLine(EFGH_Rectangle[3].x, EFGH_Rectangle[3].y, EFGH_Rectangle[3].z, EFGH_Rectangle[0].x, EFGH_Rectangle[0].y, EFGH_Rectangle[0].z, color.r, color.g, color.b, color.a) // HE

	native.drawLine(ABCD_Rectangle[0].x, ABCD_Rectangle[0].y, ABCD_Rectangle[0].z, EFGH_Rectangle[0].x, EFGH_Rectangle[0].y, EFGH_Rectangle[0].z, color.r, color.g, color.b, color.a) // AE
	native.drawLine(ABCD_Rectangle[1].x, ABCD_Rectangle[1].y, ABCD_Rectangle[1].z, EFGH_Rectangle[1].x, EFGH_Rectangle[1].y, EFGH_Rectangle[1].z, color.r, color.g, color.b, color.a) // BF
	native.drawLine(ABCD_Rectangle[2].x, ABCD_Rectangle[2].y, ABCD_Rectangle[2].z, EFGH_Rectangle[2].x, EFGH_Rectangle[2].y, EFGH_Rectangle[2].z, color.r, color.g, color.b, color.a) // CG
	native.drawLine(ABCD_Rectangle[3].x, ABCD_Rectangle[3].y, ABCD_Rectangle[3].z, EFGH_Rectangle[3].x, EFGH_Rectangle[3].y, EFGH_Rectangle[3].z, color.r, color.g, color.b, color.a) // DH
}

let potentialCount = 0;

export function showCursor(value) {
  if (!value) {
      while(potentialCount >= 1) {
        try {
            alt.showCursor(false);
         } catch(err) {}
        potentialCount -= 1;
      }
      return;
  }  

  try {
      alt.showCursor(true);
   } catch(err) {}
  potentialCount += 1;
}
/*
alt.on("keydown", (key) => {
	let tick;
	if (key === 220) { // \ <= key above enter
		let vec1 = new alt.Vector3(200.0439, -805.7406, 30.0659)
		let vec2 = new alt.Vector3(221.6835, -793.7933, 35.712)
		tick = alt.everyTick(() => {
			drawDevBox3D(vec1, vec2)
		});
	} else if (key === 0x18) { // ESC 
		alt.clearEveryTick(tick)
	}
})*/

alt.onServer("fadeIn", () => {
	native.doScreenFadeIn(200);
});

alt.onServer("fadeOut", () => {
	native.doScreenFadeOut(200);
});

alt.on("fadeIn", () => {
	native.doScreenFadeIn(200);
});

alt.on("fadeOut", () => {
	native.doScreenFadeOut(200);
});

alt.onServer("busySpinner", (time, type, msg) => {
	spinner(time, type, msg);
});

var fontTextTestString = `! " # $ % & ' ( ) * + , - . / 0 1 2 3 4 5 6 7 8 9 : ; < = > ? @ A B C D E F G H I J K L M N O P Q R S T U V W X Y Z [ \ ] ^ _  a b c d e f g h i j k l m n o p q r s t u v w x y z { | } ~`
/*
alt.everyTick(() => {
	drawText(fontTextTestString, 0.5, 0.1, 0.3, 0, 255, 255, 255, 255, true, true)
	drawText(fontTextTestString, 0.5, 0.2, 0.3, 1, 255, 255, 255, 255, true, true)
	drawText(fontTextTestString, 0.5, 0.3, 0.3, 2, 255, 255, 255, 255, true, true)
	drawText(fontTextTestString, 0.5, 0.4, 0.3, 3, 255, 255, 255, 255, true, true)
	drawText(fontTextTestString, 0.5, 0.5, 0.3, 4, 255, 255, 255, 255, true, true)
	drawText(fontTextTestString, 0.5, 0.6, 0.3, 5, 255, 255, 255, 255, true, true)
	drawText(fontTextTestString, 0.5, 0.7, 0.3, 6, 255, 255, 255, 255, true, true)
	drawText(fontTextTestString, 0.5, 0.8, 0.3, 7, 255, 255, 255, 255, true, true)
})
*/

/*
public bool CheckIfPositionIsInside(Position position)
	{
		//https://codereview.stackexchange.com/questions/108857/point-inside-polygon-check
		int polygonLength = Points.Count, i = 0;
		bool inside = false;
		// x, y for tested point.
		float pointX = position.X, pointY = position.Y;
		// start / end point for the current polygon segment.
		float startX, startY, endX, endY;
		Position endPoint = Points[polygonLength - 1];
		endX = endPoint.X;
		endY = endPoint.Y;
		while (i < polygonLength)
		{
			startX = endX; startY = endY;
			endPoint = Points[i++];
			endX = endPoint.X; endY = endPoint.Y;
			//
			inside ^= (endY > pointY ^ startY > pointY) 
			&& 
			((pointX - endX) < (pointY - endY) * (startX - endX) / (startY - endY));
	}
	return inside;
}
*/
