/// <reference types="@altv/types-server" />
import * as alt from 'alt-server'
import mysql from "mysql";
import chat from "../chat/index.js";
import bcrypt from "bcryptjs";
import { ServerPlayer } from "../base/PlayerClass.js"
import { savePlayerPosition, getFreeDimension, setDimensionInUse, setDimensionAsNolongerNeeded } from "../utility/functions.js"
import sjcl from "sjcl"


//const ip = encodeURI("http://127.0.0.1:7790/authenticate")
const url = "https://discord.com/api/oauth2/authorize?client_id=679781516204572716&redirect_uri=http%3A%2F%2F127.0.0.1%3A7790%2Fauthenticate&response_type=code&scope=identify%20email"

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'altv'
});

var dimensionForPlayer;
var kickTimeout;

/*
const normalVoiceChannel = new alt.VoiceChannel(true, 10);
const shoutVoiceChannel = new alt.VoiceChannel(true, 15);
const whisperVoiceChannel = new alt.VoiceChannel(true, 5);
*/


alt.on("playerConnect", (player) => {
    //alt.setTimeout(() => { alt.emit("auth:beginAuth", player); }, 100)
    alt.emit("auth:beginAuth", player);
    player.spawn(0, 0, 72, 0);
    //alt.log("CONNECTED NOW")
    //alt.emitClient(player, 'panelLogowania');
    dimensionForPlayer = getFreeDimension();
    player.dimension = dimensionForPlayer;
    setDimensionInUse(dimensionForPlayer);
    startKickTimeoutForPlayer(player)
});

//alt.emit("auth:beginAuth", player)
alt.on("auth:beginAuth", (player) => {
    let hashBytes = sjcl.hash.sha256.hash(JSON.stringify(player.ip) + Math.random(0, 900000000))
    const playerToken = sjcl.codec.hex.fromBits(hashBytes)

    player.token = playerToken
    alt.emitClient(player, "auth:Authorize", `${url}&state=${playerToken}`)
});

alt.on("auth:done", (player, data) => {
    const sql = "SELECT * FROM users WHERE discord_id = ?"
    var sqlVar = [data.id]
    alt.clearTimeout(kickTimeout)
    //alt.log(JSON.stringify(data))

    connection.query(sql, sqlVar, (err, res) => {
        //console.log(res[0], "data", data.id)
        if (!res[0]) {
            createNewAccountInDatabase(data)
            alt.emitClient(player, "openCharInfoCreator")
        } else {
            alt.emit("loginPlayer", player, data)
            //alt.log("ttt")
        }
    });

});


alt.onClient('requestPlayerLoginServer', (player, login, password) => {
    //alt.emitServer("requestPlayerLoginServer", login, password);
    let user_query = `SELECT password FROM users WHERE username = "${login}" `
    var passHash
    var pass = String(password);
    //console.log(pass);

    connection.query(user_query, (error, result) => {
        //console.log(result[0]);
        if (result[0] !== undefined) {
            passHash = String(result[0].password);
            sprawdzHaslo(passHash);
        } else {
            alt.emitClient(player, "loginError");
        }
        //console.log(error);
        
        //console.log(passHash);
        
    });

    //console.log(passHash);


    function sprawdzHaslo(passHash) {
        bcrypt.compare(pass, passHash, (err, res) => {
            //console.log(err);
            //console.log(res);

            if (res === true) {
                //alt.emitClient(player, 'zamknijPanel');
                alt.emit("zalogowano", player, login)
                //alt.emitClient(player, "fadeIn")
                //console.log("Logowanie udane")
            } else if (res === false) {
                alt.emitClient(player, "loginError");
            }
        });
    };
});

function startKickTimeoutForPlayer(player) {
    kickTimeout = alt.setTimeout(() => {
        try {
            player.kick("Nie zalogowano.")
        } catch (err) {
            console.log(err)
        }
        
    }, 120000);
}

alt.onClient('createPlayerAccountServer', (player, password, login, email) => {
    //alt.emit('createPlayerAccount', pass, login, email);
    
    var passHash = bcrypt.hashSync(password, 12);
    //var playerAltName = player.name(player);

    let check_login = `SELECT username FROM users WHERE username = "${login}"`

    connection.query(check_login, (login_error, result_login) => {
        //console.log(login_error);
        //console.log(result_login);
        //console.log(result_login[0].username);

        var result = String(result_login);

        //console.log(result);

        if (result === "") {
            zarejestroj(player, login, passHash, email);
            return;
        } else if (result !== "") {
            alt.emitClient(player, 'login_zajety')
            return;
        }
    });

//    console.log('Nowe żądanie rejestracji');
//    console.log(login, password, email);
//    console.log(passHash);

});

function zarejestroj(player, login, passHash, email) {
    let user_query = `INSERT INTO users (username, password, email) VALUES ("${login}", "${passHash}", "${email}")`;
    connection.query(user_query, (error, result) => {
        //console.log(error);
        //console.log(result);
        if (result !== null) {
            alt.emitClient(player, 'zarejestrowano');
            alt.emitClient(player, 'zamknijPanel');
            alt.emitClient(player, "openCharInfoCreator")
            for (let playerServer of alt.Player.all) {
                if (playerServer.id !== player.id) {
                    alt.emitClient(player, "setPlayerInvisibleToServer", playerServer) 
                }
            }
        } else {
            alt.emitClient(player, 'grl_login:nieznany_blad');
        }
    });
}

function createNewAccountInDatabase(data) {
    var data2 = JSON.stringify(data)
    const sql = "INSERT INTO users (discord_id, username, email, discord_data) VALUES (?, ?, ?, ?)"
    var sqlVar = [data.id, data.username, data.email, data2]

    connection.query(sql, sqlVar, (err, res) => {
        if (err) throw err
    });
}

function setPlayerMeta(player, login) {
    var sql = `SELECT * FROM users WHERE username = "${login}"`;

    connection.query(sql, (error, result) => {
        console.log(error);
        console.log(`setPlayerMeta ${result}`)

        var uID = result[0].id;
        var username = result[0].username;
        var adminLevel = result[0].admin_lvl;

        if (error === null) {
            player.setSyncedMeta("uID", uID);
            player.setSyncedMeta("username", username);
            player.setSyncedMeta("adminLevel", adminLevel);
        };
    });
}


function setPlayerApperance(player) {
    var uID = player.getSyncedMeta('uID');

    var sql2 = `SELECT * FROM characters WHERE owner_id = ?`;
    var sql2Variables = [uID]
    connection.query(sql2, sql2Variables, (err, res) => {
        var char_sex = res[0].char_sex;
        var char_skin = res[0].char_skin;
        var char_clothes = res[0].char_clothes;
        if (err === null) {
            switch (char_sex) {
                case "male": 
                    player.model = "mp_m_freemode_01";
                    break;
                case "female":
                    player.model = "mp_f_freemode_01"
                    break;
            }
            alt.emitClient(player, 'grl_login:setPlayerPedApperance', char_sex, char_skin, char_clothes);
            /*player.setClothes(2, parseInt(char_skin.hair), 0, 2);
            player.setClothes(3, parseInt(char_clothes.torso), parseInt(char_clothes.torso2), 0);
            player.setClothes(4, parseInt(char_clothes.legs), parseInt(char_clothes.legs2), 0);
            player.setClothes(5, parseInt(char_clothes.bags), parseInt(char_clothes.bags2), 0);
            player.setClothes(6, parseInt(char_clothes.shoes), parseInt(char_clothes.shoes2), 0);
            player.setClothes(7, parseInt(char_clothes.accesories), parseInt(char_clothes.accesories2), 0);
            player.setClothes(8, parseInt(char_clothes.undershirts), parseInt(char_clothes.undershirts2), 0);
            player.setClothes(9, parseInt(char_clothes.armor), parseInt(char_clothes.armor2), 0);
            player.setClothes(10, parseInt(char_clothes.decals), parseInt(char_clothes.decals2), 0);
            player.setClothes(11, parseInt(char_clothes.tops), parseInt(char_clothes.tops2), 0);
            if (char_clothes.hats !== -1) player.setProp(0, parseInt(char_clothes.hats), parseInt(char_clothes.hats2));
            if (char_clothes.glasses !== -1) player.setProp(1, parseInt(char_clothes.glasses), parseInt(char_clothes.glasses2));
            if (char_clothes.ears !== -1) player.setProp(2, parseInt(char_clothes.ears), parseInt(char_clothes.ears2));*/
            //alt.log("setPLayerApperance");
            //alt.log(char_clothes)
        } else alt.log(err)
    });
}

alt.on("loginPlayer", (player, discord_data) => {
    var sql = `SELECT * FROM users WHERE discord_id = ?`;
    var sqlVariables = [discord_data.id];
    let char_data;

    player.spawn(0, 0, 72, 0);
    //player.dimension = 0;
    //setDimensionAsNolongerNeeded(dimensionForPlayer)

    /*
    normalVoiceChannel.addPlayer(player);
    shoutVoiceChannel.addPlayer(player);
    whisperVoiceChannel.addPlayer(player);

    shoutVoiceChannel.mutePlayer(player);
    whisperVoiceChannel.mutePlayer(player);
    */

    connection.query(sql, sqlVariables, (err, res) => {
        //console.log(err);
        //console.log(res);

        var first_character_id = res[0].first_character_id;
        var first_character_name = res[0].first_character_name;
        var uID = res[0].id;
        var username = res[0].username;
        var adminLevel = res[0].admin_lvl;

        player.setSyncedMeta("zalogowano", true);
        player.setSyncedMeta("char_id", first_character_id);
        player.setSyncedMeta("char_fullname", first_character_name);
        player.setSyncedMeta("uID", uID);
        player.setSyncedMeta("death", false);
        player.setSyncedMeta("username", username);
        player.setSyncedMeta("adminLevel", adminLevel);

        player.setMeta("isChatOpened", false);


        //console.log(first_character_id);
        //console.log(first_character_name);

        if (first_character_id === null) {
            alt.emitClient(player, "openCharInfoCreator")
        } else {
            player.setSyncedMeta("first_character_id", first_character_id);
            player.setSyncedMeta("first_character_name ", first_character_name);
            setPlayerApperance(player);
            player.dimension = 0;
            setDimensionAsNolongerNeeded(dimensionForPlayer)
        }


        var sql2 = `SELECT * FROM characters WHERE id = ?`
        var sql2Variables = [first_character_id]

        connection.query(sql2, sql2Variables, (err, res) => {
            //console.log(err);
            //console.log(JSON.stringify(res));
            if (first_character_id !== null) {
                let stringify = {char_id: res[0].id, char_fullname: res[0].char_fullname, char_cash: res[0].char_cash, char_bank: res[0].char_bank, char_factions: res[0].char_factions, char_factions_grade: res[0].char_factions_grade, char_organisation: res[0].char_organisation, char_organisation_grade: res[0].char_organisation_grade, char_business: res[0].char_business, char_business_grade: res[0].char_business_grade};
                let char_dataJSON = JSON.stringify(stringify);
                char_data = JSON.parse(char_dataJSON);
                //console.log(JSON.parse(res[0].char_last_position).x);
                player.pos = new alt.Vector3(JSON.parse(res[0].char_last_position).x, JSON.parse(res[0].char_last_position).y, JSON.parse(res[0].char_last_position).z)
                //player.pos = {x: JSON.parse(res[0].char_last_position).x, y: JSON.parse(res[0].char_last_position).y, z: JSON.parse(res[0].char_last_position).z}
                player.data = new ServerPlayer(uID, discord_data.username, first_character_id, first_character_name, adminLevel, char_data.char_cash, char_data.char_bank, char_data.char_factions, char_data.char_factions_grade, char_data.char_organisation, char_data.char_organisation_grade, char_data.char_business, char_data.char_business_grade);
                player.discordData = discord_data
                player.inventory = JSON.parse(res[0].char_inventory)
                //alt.emitClient(player, "inv:createHUD")
                alt.emit("inv:updateInventory", player)
                player.setSyncedMeta("faction", char_data.char_factions);
                player.setSyncedMeta("faction_grade", char_data.char_factions_grade);
                player.setSyncedMeta("organisation", char_data.char_organisation);
                player.setSyncedMeta("organisation_grade", char_data.char_organisation_grade);
                player.setSyncedMeta("business", char_data.char_business);
                player.setSyncedMeta("business_grade", char_data.char_business_grade);
                player.setSyncedMeta("radioChannelFrequency", `0-0`)

                //alt.emitClient(player, 'zamknijPanel');
                
            } else {
                return;
            }
        });
        alt.setTimeout(() => {
            const discordEmbed = {
                username: "Monitorowanie połączeń z serwerem",
                avatar_url: "",
                content: "",
                embeds: [
                  {
                    color: 0x0099ff,
                    title: "Połączono gracza",
                    description: "Gracz połączył się z serwerem",
                    author: {
                      name: `${discord_data.username}#${discord_data.discriminator} [UID: ${player.data.uID}]`,
                      icon_url: `https://cdn.discordapp.com/avatars/${discord_data.id}/${discord_data.avatar}.png`,
                      //url: 'https://discord.js.org',
                    },
                    fields: [
                      {
                        name: 'Discord ID',
                        value: discord_data.id,
                        inline: true,
                      },
                      {
                        name: "Pozycja (x, y, z)",
                        value: `${Math.round(player.pos.x * 1000) / 1000}, ${Math.round(player.pos.y * 1000) / 1000}, ${Math.round(player.pos.z * 1000) / 1000}`,
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
        }, 150)
        /*
        alt.setTimeout(() => {
            player.data = new ServerPlayer(uID, login, first_character_id, first_character_name, adminLevel, char_data.char_cash, char_data.char_bank, char_data.char_factions, char_data.char_factions_grade, char_data.char_organisation, char_data.char_organisation_grade, char_data.char_business, char_data.char_business_grade) 
        }, 2000);
        */
        /*
        setTimeout(() => {
            alt.emitClient(player, "fadeOut")
        }, 3000);
        */
        
        //console.log(`player.data TEST ${player.data.login}`);  
    });
});


alt.on("zalogowano", (player, login) => {
    var sql = `SELECT * FROM users WHERE username = ?`;
    var sqlVariables = [login];
    let char_data;

    player.spawn(0, 0, 72, 0);
    //player.dimension = 0;
    //setDimensionAsNolongerNeeded(dimensionForPlayer)

    /*
    normalVoiceChannel.addPlayer(player);
    shoutVoiceChannel.addPlayer(player);
    whisperVoiceChannel.addPlayer(player);

    shoutVoiceChannel.mutePlayer(player);
    whisperVoiceChannel.mutePlayer(player);
    */

    connection.query(sql, sqlVariables, (err, res) => {
        //console.log(err);
        //console.log(res);

        var first_character_id = res[0].first_character_id;
        var first_character_name = res[0].first_character_name;
        var uID = res[0].id;
        var username = res[0].username;
        var adminLevel = res[0].admin_lvl;

        player.setSyncedMeta("zalogowano", true);
        player.setSyncedMeta("char_id", first_character_id);
        player.setSyncedMeta("char_fullname", first_character_name);
        player.setSyncedMeta("uID", uID);
        player.setSyncedMeta("death", false);
        player.setSyncedMeta("username", username);
        player.setSyncedMeta("adminLevel", adminLevel);

        player.setMeta("isChatOpened", false);


        //console.log(first_character_id);
        //console.log(first_character_name);

        if (first_character_id === null) {
            alt.emitClient(player, "openCharInfoCreator")
        } else {
            player.setSyncedMeta("first_character_id", first_character_id);
            player.setSyncedMeta("first_character_name ", first_character_name);
            setPlayerApperance(player);
            player.dimension = 0;
            setDimensionAsNolongerNeeded(dimensionForPlayer)
        }

        setTimeout(() => {
            alt.emit("openUserUI", player);
        }, 2000);

        var sql2 = `SELECT * FROM characters WHERE id = ?`
        var sql2Variables = [first_character_id]

        connection.query(sql2, sql2Variables, (err, res) => {
            //console.log(err);
            //console.log(JSON.stringify(res));
            if (first_character_id !== null && err === null) {
                let stringify = {char_id: res[0].id, char_fullname: res[0].char_fullname, char_cash: res[0].char_cash, char_bank: res[0].char_bank, char_factions: res[0].char_factions, char_factions_grade: res[0].char_factions_grade, char_organisation: res[0].char_organisation, char_organisation_grade: res[0].char_organisation_grade, char_business: res[0].char_business, char_business_grade: res[0].char_business_grade};
                let char_dataJSON = JSON.stringify(stringify);
                char_data = JSON.parse(char_dataJSON);
                //console.log(JSON.parse(res[0].char_last_position).x);
                player.pos = {x: JSON.parse(res[0].char_last_position).x, y: JSON.parse(res[0].char_last_position).y, z: JSON.parse(res[0].char_last_position).z}
                player.data = new ServerPlayer(uID, login, first_character_id, first_character_name, adminLevel, char_data.char_cash, char_data.char_bank, char_data.char_factions, char_data.char_factions_grade, char_data.char_organisation, char_data.char_organisation_grade, char_data.char_business, char_data.char_business_grade);
                player.inventory = JSON.parse(res[0].char_inventory)
                //alt.emitClient(player, "inv:createHUD")
                alt.emit("inv:updateInventory", player)
                player.setSyncedMeta("faction", char_data.char_factions);
                player.setSyncedMeta("faction_grade", char_data.char_factions_grade);
                player.setSyncedMeta("organisation", char_data.char_organisation);
                player.setSyncedMeta("organisation_grade", char_data.char_organisation_grade);
                player.setSyncedMeta("business", char_data.char_business);
                player.setSyncedMeta("business_grade", char_data.char_business_grade);

                alt.emitClient(player, 'zamknijPanel');

                alt.emit("connectionFinished", player)
                
            } else {
                alt.logError(err)
                return;
            }
        });

        /*
        alt.setTimeout(() => {
            player.data = new ServerPlayer(uID, login, first_character_id, first_character_name, adminLevel, char_data.char_cash, char_data.char_bank, char_data.char_factions, char_data.char_factions_grade, char_data.char_organisation, char_data.char_organisation_grade, char_data.char_business, char_data.char_business_grade) 
        }, 2000);
        */
        /*
        setTimeout(() => {
            alt.emitClient(player, "fadeOut")
        }, 3000);
        */
        
        //console.log(`player.data TEST ${player.data.login}`);  
    });
});

alt.on("connectionFinished", (player) => {
    alt.log("connectionFinished")
});

/*
chat.registerCmd('test',(player) => {
    savePlayerPosition(player);
});
*/

alt.onClient("register_player_character_server", (player, char_firstname, char_lastname, char_birthdate, char_height, char_weight, char_sex, char_info, char_clothes) => {

    var playerUsername = player.getSyncedMeta('username');
    var player_uID = player.getSyncedMeta("uID")

    //console.log("register_player_character_server")

    //console.log(`PlayerUsername = ${playerUsername}`);
    //console.log(char_info);
    //console.log(char_clothes);

    // var getPlayerInfoSQL = `SELECT * FROM users WHERE username = "${playerUsername}"`

    // connection.query(getPlayerInfoSQL, (err, res) => {
    //     //console.log(err);
    //     //console.log(res);

    //     var player_uID = res[0].id; 
    //     var player_username = res[0].username;

    //     console.log(player_uID);
    //     console.log(player_username);
    // });

    var Info = JSON.parse(char_info);
    
    var char_fullname = char_firstname + " " + char_lastname;

    var sql = `INSERT INTO characters (owner_id, owner_name, char_firstname, char_lastname, char_fullname, char_birthdate, char_sex, char_height, char_weight, char_skin, char_clothes) VALUES (${player_uID}, "${playerUsername}", "${char_firstname}", "${char_lastname}", "${char_fullname}", "${char_birthdate}", "${char_sex}", ${char_height}, ${char_weight}, "${char_info}", "${char_clothes}")`;
    var sql2 = `INSERT INTO characters (owner_id, owner_name, char_firstname, char_lastname, char_fullname, char_birthdate, char_sex, char_height, char_weight, char_skin, char_clothes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    var sql2Variables = [player_uID, playerUsername, char_firstname, char_lastname, char_fullname, char_birthdate, char_sex, char_height, char_weight, char_info, char_clothes]



    connection.query(sql2, sql2Variables, function (err, result) {
        //console.log(err);
        //console.log(res);


        if (err === null) {
            alt.emitClient(player, "zamknijPanelPostaci");
            //alt.emit("zalogowano", player, player.getSyncedMeta("username"))
            //player.setSyncedMeta("char_id", char_id);
            player.setSyncedMeta("char_fullname", char_fullname);
            player.dimension = 0;
            setDimensionAsNolongerNeeded(dimensionForPlayer)
        }

        /*
        var sql4 = `UPDATE users SET first_character_id= ? , first_character_name= ? WHERE id= ?;`
        var sql4Variables = [char_id, char_fullname, player_uID];
        connection.query(sql4, sql4Variables, (err, res) => {
            //console.log(err);
            //console.log(res);
        });
        */
    });


    var sql3 = `SELECT * FROM characters WHERE owner_name = ?`
    var sql3Variables = [playerUsername];
  
    alt.on("syncedMetaChange", (entity, key, val, oldVal) => {
        console.log(oldVal)
        if (key === "char_fullname") {
            connection.query(sql3, sql3Variables, (err, res) => {
                //console.log(err);
                //console.log(res);

                var char_id = res[0].id;
                var char_job = res[0].char_job;

                var sql4 = `UPDATE users SET first_character_id= ? , first_character_name= ? WHERE id= ?;`
                var sql4Variables = [char_id, char_fullname, player_uID];
                connection.query(sql4, sql4Variables, (err, res) => {
                    //console.log(err);
                    //console.log(res);

                    player.setSyncedMeta("char_id", char_id);
                    //player.setSyncedMeta("char_fullname", char_fullname);
                });
            });
        }
    });

    setTimeout(() => {

    }, 2000);


     
});

alt.onClient("changeSexServer", (player, gender) => {
    var playerGender = String(gender)

    if (playerGender == "male") {
        player.model = "mp_m_freemode_01";
    } else {
        player.model = "mp_f_freemode_01";
    }
});


alt.on("playerConnect", (player) => {
    player.model = "mp_m_freemode_01";
});

console.log("Zaladowano => [server/login/server.mjs]")