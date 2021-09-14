/// <reference types="@altv/types-server" />
import * as alt from 'alt-server'

const normalVoiceChannel = new alt.VoiceChannel(true, 10);
const shoutVoiceChannel = new alt.VoiceChannel(true, 15);
const whisperVoiceChannel = new alt.VoiceChannel(true, 5);

normalVoiceChannel.setMeta("name", "normal")
shoutVoiceChannel.setMeta("name", "shout")
whisperVoiceChannel.setMeta("name", "whisper")

let radioVoiceChannels = []

export function mutePlayerInAllChannels(player) {
    normalVoiceChannel.mutePlayer(player)
    shoutVoiceChannel.mutePlayer(player)
    whisperVoiceChannel.mutePlayer(player)
}

export function unmutePlayerInAllChannels(player) {
    normalVoiceChannel.unmutePlayer(player)
    shoutVoiceChannel.unmutePlayer(player)
    whisperVoiceChannel.unmutePlayer(player)
}

alt.on("zalogowano", (player, login) => {
    normalVoiceChannel.addPlayer(player);
    shoutVoiceChannel.addPlayer(player);
    whisperVoiceChannel.addPlayer(player);

    player.currentVoiceChannel = "normalVoiceChannel"

    shoutVoiceChannel.mutePlayer(player)
    whisperVoiceChannel.mutePlayer(player)
});

alt.on('playerDisconnect', (player, reason) => {
    normalVoiceChannel.removePlayer(player);
    shoutVoiceChannel.removePlayer(player);
    whisperVoiceChannel.removePlayer(player);
});

alt.onClient("voice:changeVoiceRange", (player) => {
    if (normalVoiceChannel.isPlayerInChannel(player) && shoutVoiceChannel.isPlayerInChannel(player) && whisperVoiceChannel.isPlayerInChannel(player)) {
        switch (player.currentVoiceChannel) {
            case "normalVoiceChannel":
                shoutVoiceChannel.unmutePlayer(player)
                normalVoiceChannel.mutePlayer(player)
                whisperVoiceChannel.mutePlayer(player)
                player.currentVoiceChannel = "shoutVoiceChannel"
                break;
            
            case "shoutVoiceChannel": 
                whisperVoiceChannel.unmutePlayer(player)
                normalVoiceChannel.mutePlayer(player)
                shoutVoiceChannel.mutePlayer(player)
                player.currentVoiceChannel = "whisperVoiceChannel"
                break;

            case "whisperVoiceChannel":
                normalVoiceChannel.unmutePlayer(player)
                shoutVoiceChannel.mutePlayer(player)
                whisperVoiceChannel.mutePlayer(player)
                player.currentVoiceChannel = "normalVoiceChannel"
                break;
        }
    }
});


alt.onClient("radio:channelChanged", (player, channel, subchannel) => {
    player.setSyncedMeta("radioChannelFrequency", `${channel}-${subchannel}`)
    alt.emit("radio:removePlayerFromVoiceChannel", player);
    alt.emit("radio:addPlayerToVoiceChannel", player, channel, subchannel)
});


alt.on("radio:addPlayerToVoiceChannel", (player, channel, subchannel) => {
    let channelFound = false;
    if (radioVoiceChannels.length > 0) {
        radioVoiceChannels.forEach((vc) => {
            if (vc.getMeta("frequency") == `${channel}-${subchannel}`) {
                channelFound = true;
                vc.addPlayer(player);
                vc.mutePlayer(player)
                player.setSyncedMeta("radioChannelFrequency", `${channel}-${subchannel}`)
                player.setMeta("radioChannel", vc)
            }
        });
    }
    if (channelFound) return;

    let newVoiceChannel = new alt.VoiceChannel(false, 999999);
    newVoiceChannel.setMeta("frequency", `${channel}-${subchannel}`);
    newVoiceChannel.addPlayer(player);
    player.setSyncedMeta("radioChannelFrequency", `${channel}-${subchannel}`);
    player.setMeta("radioChannel", newVoiceChannel);
    radioVoiceChannels.push(newVoiceChannel);
});

alt.on("radio:removePlayerFromVoiceChannel", (player) => {
    if (radioVoiceChannels.length === 0) return;
    radioVoiceChannels.forEach((vc) => {
        if (vc.isPlayerInChannel(player)) {
            vc.removePlayer(player)
        }
    });
});

alt.onClient("radio:transmissionStarted", (player) => {
    let radioChannel = player.getMeta("radioChannel")
    radioChannel.unmutePlayer(player)
    alt.Player.all.forEach((pl) => {
        if (pl == player) return
        if (pl.getMeta("radioChannel") != radioChannel) return
        alt.emitClient(pl, "radio:reciveTransmissionStarted")
    })
});

alt.onClient("radio:transmissionEnded", (player) => {
    let radioChannel = player.getMeta("radioChannel")
    radioChannel.unmutePlayer(player)
    alt.Player.all.forEach((pl) => {
        if (pl == player) return
        if (pl.getMeta("radioChannel") != radioChannel) return
        alt.emitClient(pl, "radio:reciveTransmissionEnded")
    })
});

console.log("Załadowano => [server/voice/server.js]")