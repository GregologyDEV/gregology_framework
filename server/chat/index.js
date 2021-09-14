import * as alt from 'alt-server'
import { sendWebHook, sendWebHookAsync } from "../discord/webhook.js"

let cmdHandlers = {};

function invokeCmd(player, cmd, args) {
  const callback = cmdHandlers[cmd];

  if (callback) {
    callback(player, args);
  } else {
    send(player, `{FF0000} Nieznana komenda /${cmd}`);
  }
}

alt.onClient('chatmessage', (player, msg) => {
  const discordEmbed = {
    username: "Monitorowanie czatu",
    avatar_url: "",
    content: "",
    embeds: [
      {
        color: 0x0099ff,
        title: "Wiadomość czatu",
        description: msg,
        author: {
          name: `${player.discordData.username}#${player.discordData.discriminator} [UID: ${player.data.uID}]`,
          icon_url: `https://cdn.discordapp.com/avatars/${player.discordData.id}/${player.discordData.avatar}.png`,
          //url: 'https://discord.js.org',
        },
        fields: [
          {
            name: 'Discord ID',
            value: player.discordData.id,
            inline: true,
          },
          {
            name: "Stan",
            value: (player.getSyncedMeta('death') ? "Nie żyje" : "Żyje"),
            inline: true,
          },
          {
            name: "Pozycja (x, y, z)",
            value: `${Math.round(player.pos.x * 1000) / 1000}, ${Math.round(player.pos.y * 1000) / 1000}, ${Math.round(player.pos.z * 1000) / 1000}`,
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
            inline: true,
          },
        ],
        timestamp: new Date()
      }
    ],
  };
  alt.emit("discord:sendWebhook", "chat", JSON.stringify(discordEmbed))
  //sendWebHook("https://discord.com/api/webhooks/872948660768501770/Vpj7vjOsq5weFe71soAg_b6c3j5jAfdpeNOyqsovTMNXW7JOCdq2Qla6XY_N4WvWpiqc", JSON.stringify(discordEmbed))
  if (msg[0] === '/') {
    msg = msg.trim().slice(1);

    if (msg.length > 0) {
      alt.log('[chat:cmd] ' + player.name + ': /' + msg);

      let args = msg.split(' ');
      let cmd = args.shift();

      invokeCmd(player, cmd, args);
    }
  } else {
    msg = msg.trim();

    if (msg.length > 0) {
      alt.log('[chat:msg] ' + player.name + ': ' + msg);

      alt.emitClient(null, 'chatmessage', player.name, msg.replace(/</g, '&lt;').replace(/'/g, '&#39').replace(/"/g, '&#34'));
    }
  }
});

export function send(player, msg) {
  alt.emitClient(player, 'chatmessage', null, msg);
}

export function broadcast(msg) {
  send(null, msg);
}

export function registerCmd(cmd, callback) {
  if (cmdHandlers[cmd] !== undefined) {
    alt.logError(`Failed to register command /${cmd}, already registered`);
  } else {
    cmdHandlers[cmd] = callback;
  }
}


export default { send, broadcast, registerCmd };
