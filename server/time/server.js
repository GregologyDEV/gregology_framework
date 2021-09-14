/// <reference types="@altv/types-server" />
import * as alt from 'alt-server'

var autoTime = true;
var date = {day: 0, month: 0, year: 2021};
var time = {hour: 12, minute: 0, second: 0};

var autoWeather = true;
var currentWeatherIndex = 0; // weatherCycle.json array index
var currentWeatherID = 0;
var weatherTransitionTime;
const weatherChangeTimeBase = 3; // in minutes

const weathersArr = [0, 1, 3, 0, 3, 0, 5, 0, 3, 2, 1, 0, 3, 0, 2, 1, 3, 2, 1, 3, 5, 3, 1, 0, 1, 0, 3, 4, 3, 2, 3, 0, 3, 5, 2, 4, 1, 0, 3, 5, 3, 5, 7, 3, 1, 0, 1, 2, 1, 0, 1, 3, 2, 6, 3, 2, 0, 3, 0, 1, 3, 4, 1, 0, 3, 5, 3, 0, 3, 0, 1, 3, 0, 3, 5, 3, 4, 3, 0, 1, 3, 1, 0, 1, 3, 1, 0, 1, 3, 5, 7, 8, 9, 1, 0, 1, 3, 5, 3, 5, 3, 1, 0, 3, 0, 1, 3, 5, 3, 1, 0, 3, 0, 3, 0, 2, 1, 3, 1, 0, 1, 0, 1, 3, 5, 3, 1, 0, 3, 5, 2, 6, 7, 6, 8, 9, 2, 0, 3]
const weatherMultipliers = [2, 1, 4, 1, 3, 3, 1, 2, 3, 3, 5, 1, 3, 3, 5, 2, 2, 2, 1, 2, 2, 1, 1, 3, 2, 2, 3, 1, 2, 4, 1, 3, 2, 1, 1, 1, 12, 4, 3, 1, 3, 3, 1, 1, 1, 3, 4, 2, 3, 1, 6, 1, 2, 1, 5, 2, 1, 2, 3, 8, 3, 2, 1, 4, 2, 3, 1, 2, 3, 3, 8, 3, 2, 1, 2, 3, 4, 1, 7, 5, 2, 5, 3, 5, 1, 5, 1, 5, 6, 1, 2, 1, 2, 2, 3, 5, 3, 1, 2, 3, 1, 5, 2, 3, 3, 8, 3, 2, 2, 4, 7, 5, 2, 3, 3, 5, 2, 2, 5, 3, 3, 1, 5, 3, 2, 2, 4, 2, 3, 1, 2, 1, 3, 1, 2, 3, 1, 4, 3]


const msPerGameMinute = 1800 // 30 * 60

alt.setInterval(() => {
    if (time.second < 59) {
        time.second++;
    } else if (time.second === 59) {
        time.second = 0;
        time.minute++;
    };

    if (time.minute === 59) {
        time.minute = 0;
        time.hour++;
    };

    if (time.hour === 24) {
        time.hour = 0;
        date.day++;
    }

    if (date.day === 31) {
        date.day = 0;
        date.month++;
    }

    if (date.month === 12) {
        date.month = 0;
        date.year++
    }
}, msPerGameMinute / 60)


alt.setInterval(() => {
    if (autoWeather) {
        if (weathersArr.length !== currentWeatherIndex) {
            currentWeatherID = weathersArr[currentWeatherIndex]
            alt.emitClient(null, "weather:transitWeather", currentWeatherID, weathersArr[currentWeatherIndex - 1])
            currentWeatherIndex++ 
        } else {
            alt.emitClient(null, "weather:transitWeather", weathersArr[0], weathersArr[weathersArr.length - 1])
            currentWeatherIndex = 0
        }
        
        /* Don't even look at this
        if (!alt.File.exists("@gregology_framework_assets/client/Documentation/weatherCycle.json")) throw new Error("Can not find 'weatherCycle.json' file!")
        const weatherCycle = JSON.parse(alt.File.read("@gregology_framework_assets/client/Documentation/weatherCycle.json"))
        currentWeatherID = weatherCycle[currentWeatherIndex].weatherID
        weatherTransitionTime = weatherCycle[currentWeatherIndex].timeMult
        currentWeatherIndex++
        */
    }
}, weatherMultipliers[currentWeatherIndex] * weatherChangeTimeBase * 60000)

alt.on('playerConnect', (player) => {
    player.setDateTime(date.day, date.month, date.year, time.hour, time.minute, time.second)
    player.setWeather(currentWeatherID)
    //alt.log(`${date.day}.${date.month}.${date.year} ${time.hour}:${time.minute}:${time.second}`)
    alt.emitClient(player, "time:setMsPerGameMinute", msPerGameMinute)
    //alt.emitClient(player, "weather:startWeatherSync")
    //alt.log(msPerGameMinute)
});

console.log("Załadowano => [server/time/server.js]")