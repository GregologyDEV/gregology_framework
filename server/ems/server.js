import * as alt from 'alt-server'
import { deathCause } from '../utility/misc';
import { pedType } from "../utility/misc";
import Ped from "../entitysync/ped"
import "../../shared/config/ems.json"

alt.on("connectionFinished", (player) => {
  if (alt.File.exists("../../shared/config/ems.json")) {
    const config = JSON.parse(alt.File.read("../../shared/config/ems.json"))
    alt.log(config)
  }
});



alt.on("playerDeath", (player, killer, weaponHash) => {
    alt.emitClient(player, 'playerDeath', killer, weaponHash);
    player.setSyncedMeta("death", true);
    alt.log(deathCause[weaponHash])
    const discordEmbed = {
        username: "Monitorowanie stanu graczy",
        avatar_url: "",
        content: "",
        embeds: [
          {
            color: 0x0099ff,
            title: "Śmierć gracza",
            description: ``,
            author: {
              name: `${player.discordData.username}#${player.discordData.discriminator} [UID: ${player.data.uID}]`,
              icon_url: `https://cdn.discordapp.com/avatars/${player.discordData.id}/${player.discordData.avatar}.png`,
              //url: 'https://discord.js.org',
            },
            fields: [
              {
                name: 'Zabity gracz',
                value: `${player.discordData.username}#${player.discordData.discriminator} [UID: ${player.data.uID}]`,
                inline: true,
              },
              {
                name: 'Zabójca',
                value: (killer instanceof alt.Player) ? `${killer.discordData.username}#${killer.discordData.discriminator} [UID: ${killer.data.uID}]` : "INNY GRACZ NIE BYŁ ZABÓJCĄ",
                inline: true,
              },
              {
                name: "Pozycja (x, y, z) zabitego gracza",
                value: `${Math.round(player.pos.x * 1000) / 1000}, ${Math.round(player.pos.y * 1000) / 1000}, ${Math.round(player.pos.z * 1000) / 1000}`,
                inline: true,
              },
              {
                name: "Pozycja (x, y, z) zabójcy",
                value: (killer instanceof alt.Player) ? `${Math.round(killer.pos.x * 1000) / 1000}, ${Math.round(killer.pos.y * 1000) / 1000}, ${Math.round(killer.pos.z * 1000) / 1000}` : `NIE DOTYCZY`,
                inline: true,
              },
              {
                name: "Hash pojazdu zabitego",
                value: (player.vehicle) ? player.vehicle.model : "BRAK POJAZDU",
                inline: true,
              },
              {
                name: "Hash pojazdu zabójcy",
                value: (killer instanceof alt.Player) ? ((killer.vehicle) ? killer.vehicle.model : "BRAK POJAZDU") : "NIE DOTYCZY",
                inline: true,
              },
              {
                name: "Przyczyna śmierci",
                value: deathCause[weaponHash],
                inline: true,
              },
              {
                name: "Dimension",
                value: player.dimension,
                inline: true,
              },
            ],
            timestamp: new Date()
          }
        ],
      };
      alt.emit("discord:sendWebhook", "death", JSON.stringify(discordEmbed))
});

console.log("Zaladowano => [server/ems/server.mjs]")