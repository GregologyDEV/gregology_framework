/// <reference types="@altv/types-server" />

import * as alt from "alt-server";
import Discord from "discord.js";

const discordClient = new Discord.Client();

let whitelist = []
let interval;
let guild;

discordClient.on("ready", () => {
    console.log("DISCORD BOT ==> READY")   

    fetchGuild()
    //refreshWhitelist()

    //interval = alt.setInterval(refreshWhitelist, 60000);
});

async function fetchGuild() {
    guild = await discordClient.guilds.fetch("381514753425670144").then(g => guild = g)
}


function refreshWhitelist() {
    whitelist = [];

    // Discord Server ID!
    const server = discordClient.guilds.cache.get("381514753425670144");

    // WHITELIST role ID!
    const whitelistedMembers = server.roles.cache.get("756097929139453963").members.array();
    //console.log(server.roles.cache.get("756097929139453963").name)

    for (let i = 0; i < whitelistedMembers.length; i++) {
        const member = whitelistedMembers[i]

        if (!member) {
            continue;
        }

        if (!member.user) {
            continue;
        }

        whitelist.push(member.user.id)
    }

    alt.log(`Odświeżono whitelistę. Osób na whiteliście: ${whitelistedMembers.length}`)
}

async function handleUserUpdate(oldUser, user) {
    if (!user) return;

    const server = discordClient.guilds.cache.get("381514753425670144");
    const member = await server.members.fetch(user.id);

    if (!member) return;

    const hasRole = member.roles.cache.has("756097929139453963");
    const index = whitelist.findIndex(id = id === user.id);

    if (!hasRole) {
        if (index <= -1) return
        whitelist.splice(index, 1);
        return;
    }

    if (index >= 0) return;
    whitelist.push(user.id)
}


export async function isWhitelisted(id) {
    const server = discordClient.guilds.cache.get("381514753425670144");
    try {
        await guild.members.fetch(id).then(m => {
            var roles = m._roles;
            if (roles.includes("756097929139453963")) {
                //console.log(true)
                return true
            } else {
                //console.log(false)
                return false
            }
        })  
    } catch (err) {
        //console.log(false)
        return false
    }

    //console.log(guild.id, id)
    /*if (!member) return false
    if (!member.user) return false

    const isMemberWhitelisted = member.roles.cache.has("756097929139453963")
    console.log(isMemberWhitelisted)
    return isMemberWhitelisted*/
}
/*
alt.setTimeout(() => {
    let isWL = isWhitelisted("704681219408789504")
    console.log(isWL)
}, 5000)
*/

export function isWhitelisted2(id) {
    if (whitelist.includes(id)) {
        return true
    } else {
        return false
    }
}


discordClient.login("Njc5NzgxNTE2MjA0NTcyNzE2.Xk2V3w.SL4r2VtvD4u0S6pqz_c1S9WzD7o")