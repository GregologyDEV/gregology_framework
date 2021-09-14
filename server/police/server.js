import * as alt from 'alt-server'
import chat from "../chat/index.js";
import { connection } from "../base/server.js"
import { getFaction } from "../utility/FactionsHandler.js"

chat.registerCmd('mdt', (player) => {
    alt.emitClient(player, 'police:openMDT');
});

alt.onClient('police:requestCitizenDataServer', (player, citizenID) => {
    var sql = "SELECT * FROM characters WHERE id = ?"
    connection.query(sql, [citizenID], (err, res) => {
        if (res && err === null) {
            alt.emitClient(player, 'police:citizenDataCallback', res[0]);
        } else {
            alt.emitClient(player, 'police:citizenDataCallbackError');
        }
    });
});

alt.onClient("police:requestCitizenDatabaseByNameServer", (player, citizenName) => {
    var sql = "SELECT id, char_fullname, char_sex, char_birthdate FROM characters WHERE char_fullname LIKE ?"

    connection.query(sql, [`%${citizenName}%`], (err, res) => {
        if (res && err === null) {
            alt.emitClient(player, 'police:citizensArrayCallback', res);
        } else {
            alt.emitClient(player, 'police:citizensArrayCallbackError');
        }
    });
});

alt.onClient("police:requestCitizenDatabaseByUIDServer", (player, citizenUID) => {
    var sql = "SELECT id, char_fullname, char_factions, char_factions_grade, char_business, char_business_grade, char_birthdate, char_sex, char_height, char_weight, char_licenses FROM characters WHERE id = ?"
    var charactersDatabase;
    connection.query(sql, [citizenUID], (err, res) => {
        if (res && err === null) {
            var data = {
                id: res[0].id,
                char_fullname: res[0].char_fullname,
                char_faction_label: getFaction(res[0].char_factions).label,
                char_faction_grade_label: getFaction(res[0].char_factions).getGradeLabel(res[0].char_factions_grade),
                char_business_label: "DO ZROBIENIA",
                char_business_grade_label: "DO ZROBIENIA",
                char_birthdate: JSON.stringify(res[0].char_birthdate),
                char_sex: res[0].char_sex,
                char_height: res[0].char_height,
                char_licenses: JSON.parse(res[0].char_licenses),
                isWanted: false, /*DO ZROBIENIA*/
                citizen_database: [], /*DO ZROBIENIA*/
                citizen_vehicles: [], /*DO ZROBIENIA*/
                citizen_properties: [], /*DO ZROBIENIA*/
                citizen_notes: [], /*DO ZROBIENIA*/
            };

            alt.emitClient(player, 'police:citizenDatabaseCallback', data);
        } else {
            alt.emitClient(player, 'police:citizenDatabaseCallbackError');
        }
    });
});

console.log("Załadowano => [server/police/police.js]")