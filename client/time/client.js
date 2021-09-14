/// <reference types="@altv/types-client" />
/// <reference types="@altv/types-natives" />

import * as alt from 'alt-client'
import * as native from 'natives';

const weathersArr = [0, 1, 3, 0, 3, 0, 5, 0, 3, 2, 1, 0, 3, 0, 2, 1, 3, 2, 1, 3, 5, 3, 1, 0, 1, 0, 3, 4, 3, 2, 3, 0, 3, 5, 2, 4, 1, 0, 3, 5, 3, 5, 7, 3, 1, 0, 1, 2, 1, 0, 1, 3, 2, 6, 3, 2, 0, 3, 0, 1, 3, 4, 1, 0, 3, 5, 3, 0, 3, 0, 1, 3, 0, 3, 5, 3, 4, 3, 0, 1, 3, 1, 0, 1, 3, 1, 0, 1, 3, 5, 7, 8, 9, 1, 0, 1, 3, 5, 3, 5, 3, 1, 0, 3, 0, 1, 3, 5, 3, 1, 0, 3, 0, 3, 0, 2, 1, 3, 1, 0, 1, 0, 1, 3, 5, 3, 1, 0, 3, 5, 2, 6, 7, 6, 8, 9, 2, 0, 3]
const weatherMultipliers = [2, 1, 4, 1, 3, 3, 1, 2, 3, 3, 5, 1, 3, 3, 5, 2, 2, 2, 1, 2, 2, 1, 1, 3, 2, 2, 3, 1, 2, 4, 1, 3, 2, 1, 1, 1, 12, 4, 3, 1, 3, 3, 1, 1, 1, 3, 4, 2, 3, 1, 6, 1, 2, 1, 5, 2, 1, 2, 3, 8, 3, 2, 1, 4, 2, 3, 1, 2, 3, 3, 8, 3, 2, 1, 2, 3, 4, 1, 7, 5, 2, 5, 3, 5, 1, 5, 1, 5, 6, 1, 2, 1, 2, 2, 3, 5, 3, 1, 2, 3, 1, 5, 2, 3, 3, 8, 3, 2, 2, 4, 7, 5, 2, 3, 3, 5, 2, 2, 5, 3, 3, 1, 5, 3, 2, 2, 4, 2, 3, 1, 2, 1, 3, 1, 2, 3, 1, 4, 3]
const weathersString = {
    0: "EXTRASUNNY",
    1: "CLEAR",
    2: "CLOUDS",
    3: "SMOG",
    4: "FOGGY",
    5: "OVERCAST",
    6: "RAIN",
    7: "THUNDER",
    8: "CLEARING",
    9: "NEUTRAL",
    10: "SNOW",
    11: "BLIZZARD",
    12: "SNOWLIGHT",
    13: "XMAS",
    14: "HALLOWEEN"
}


//alt.setWeatherCycle(weathersArr, weatherMultipliers);
//alt.setWeatherSyncActive(true)

alt.onServer("time:setMsPerGameMinute", (val) => {
    alt.setMsPerGameMinute(val)
});

alt.onServer("weather:transitWeather", (newWeather, previousWeather) => {
    //native.setWeatherTypeTransition(alt.hash(weathersString[previousWeather].toLowerCase()), alt.hash(weathersString[newWeather].toLowerCase()), 1.0)
    native.setWeatherTypeOvertimePersist(weathersString[newWeather], 30)
});