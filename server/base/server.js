/// <reference types="@altv/types-server" />
import * as alt from 'alt-server'
import mysql from "mysql";
import chat from "../chat/index.js";
import { savePlayerPosition } from "../utility/functions.js"


export const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'altv'
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Połączono z bazą danych "altv"! [server/base/server.mjs]');
});


setInterval(() => {
    let gracze = 0;
    for (let player of alt.Player.all) {
        if (player.getSyncedMeta("zalogowano") === true && player.getSyncedMeta("char_id") !== null) {
            savePlayerPosition(player);
            alt.emitClient(player, "busySpinner", 5000, 4, "Zapisywanie postaci");
            gracze++
        } 
    }
    console.log("Zapisywanie postaci...");
    console.log(`Zapisano ${gracze} postaci`);
}, 120000);


alt.on("openUserUI", (player) => {
    alt.emitClient(player, 'openUserUI');

    var player_char_id = player.getSyncedMeta('char_id');
    var player_char_fullname = player.getSyncedMeta('char_fullname');
    var playerScriptID = player.scriptID;

    //console.log(player_char_id, player_char_fullname);

    var SQL = `SELECT * FROM characters WHERE id = "${player_char_id}"`;
    if (player_char_id !== null) {
        connection.query(SQL, (err, res) => {
            console.log(err);
            //console.log(res);

            var player_cash = res[0].char_cash;
            var player_bank = res[0].char_bank;

            //console.log(player_cash, player_bank);
            alt.emitClient(player, "UserUI_content", player_char_fullname, player_cash, player_bank);
        });
    };
});

alt.on("updatePlayerDatabase", (uID) => {
    let playerToUpdate = alt.Player.all.find((player) => player.data.uID === uID);
    alt.emitClient(playerToUpdate, "busySpinner", 5000, 4, "Zapisywanie postaci");
    if (playerToUpdate !== null) {
        connection.query("UPDATE users SET admin_lvl = ? WHERE id = ?", [playerToUpdate.data.adminLvl, uID], (err, res) => {
            console.log(err)
        });
        connection.query("UPDATE characters SET char_cash = ? , char_bank = ? , char_factions = ? , char_factions_grade = ? , char_organisation = ? , char_organisation_grade = ? , char_business = ? , char_business_grade = ? , char_inventory = ? WHERE id = ?", [playerToUpdate.data.cash, playerToUpdate.data.bank, playerToUpdate.data.factionName, playerToUpdate.data.factionGrade, playerToUpdate.data.organistationName, playerToUpdate.data.organisationGrade, playerToUpdate.data.buissnesName, playerToUpdate.data.buissnesGrade, JSON.stringify(playerToUpdate.inventory), playerToUpdate.data.activeCharacerID], (err, res) => {
            console.log(err)
        });
        playerToUpdate.setSyncedMeta("adminLevel", playerToUpdate.data.adminLvl);
        playerToUpdate.setSyncedMeta("faction", playerToUpdate.data.factionName);
        playerToUpdate.setSyncedMeta("faction_grade", playerToUpdate.data.factionGrade);
        playerToUpdate.setSyncedMeta("organisation", playerToUpdate.data.organistationName);
        playerToUpdate.setSyncedMeta("organisation_grade", playerToUpdate.data.organisationGrade);
        playerToUpdate.setSyncedMeta("business", playerToUpdate.data.buissnesName);
        playerToUpdate.setSyncedMeta("business_grade", playerToUpdate.data.activeCharacerID);
    }
    console.log(`Zaaktualizowano w bazie danych: ${playerToUpdate.data.login}`)
});

alt.onClient("playerList:changeMeta", (player, metaState) => {
    player.setStreamSyncedMeta("isPlayerListOpen", metaState)
});

alt.on('playerDisconnect', (player, reason) => {
    //alt.log(player.discord_data)
    const discordEmbed = {
        username: "Monitorowanie połączeń z serwerem",
        avatar_url: "",
        content: "",
        embeds: [
          {
            color: 0x0099ff,
            title: "Rozłączono gracza",
            description: "Gracz rozłączył się z serwerem",
            author: {
              name: `${player.username}`,
              //name: `${player.discord_data.username}#${player.discord_data.discriminator} [UID: ${player.data.uID}]`,
              //icon_url: `https://cdn.discordapp.com/avatars/${player.discord_data.id}/${player.discord_data.avatar}.png`,
              //url: 'https://discord.js.org',
            },
            fields: [
              {
                name: 'Discord ID',
                value: "value unavaible",
                //value: player.discord_data.id,
                inline: true,
              },
              {
                name: 'Powód rozłączenia',
                value: reason,
                inline: true,
              },
              {
                name: "Pozycja (x, y, z)",
                value: `${Math.round(player.pos.x * 1000) / 1000}, ${Math.round(player.pos.y * 1000) / 1000}, ${Math.round(player.pos.z * 1000) / 1000}`,
                inline: true,
              },
              {
                name: "Stan",
                value: (player.getSyncedMeta('death') ? "Nie żyje" : "Żyje"),
                inline: true,
              },
              {
                name: "Hash pojazdu",
                value: (player.vehicle) ? player.vehicle.model : "BRAK POJAZDU",
                inline: true,
              },
              {
                name: "Dimension",
                value: player.dimension,
                inline: false,
              },
            ],
            timestamp: new Date()
          }
        ],
    };
    alt.emit("discord:sendWebhook", "connection", JSON.stringify(discordEmbed))
});

/*
const colshape = new alt.ColshapeCuboid(200.0439, -805.7406, 30.0659, 221.6835, -793.7933, 35.712)
colshape.setMeta("name", "test")

alt.on("entityEnterColshape", (colshape, entity) => {
    alt.log(colshape.getMeta("name"))
    alt.log(entity.data.uID)
})
*/
console.log("Zaladowano => [server/base/server.mjs]")