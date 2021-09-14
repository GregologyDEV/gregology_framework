import alt from 'alt-server';
import nodefetch from 'node-fetch';

const webhooksURL = {
    "chat": "https://discord.com/api/webhooks/872948660768501770/Vpj7vjOsq5weFe71soAg_b6c3j5jAfdpeNOyqsovTMNXW7JOCdq2Qla6XY_N4WvWpiqc",
    "connection": "https://discord.com/api/webhooks/872948660768501770/Vpj7vjOsq5weFe71soAg_b6c3j5jAfdpeNOyqsovTMNXW7JOCdq2Qla6XY_N4WvWpiqc",
    "death": "https://discord.com/api/webhooks/872948660768501770/Vpj7vjOsq5weFe71soAg_b6c3j5jAfdpeNOyqsovTMNXW7JOCdq2Qla6XY_N4WvWpiqc",
    "admin": "",
    "inventory": "",
    "phone": "",
    "police": "",
    "vehicles": "",
}


export function sendWebHook(webhookurl, content) {
    if (typeof webhookurl !== 'undefined' || typeof content !== 'undefined')
        return;
    nodefetch(webhookurl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "content": content })
    });
};

export async function sendWebHookAsync(webhookurl, content) {
    if (webhookurl == undefined || content == undefined) return;
    try {
        let success = await nodefetch(webhookurl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ "content": content })
        });
        return success;
    } catch (error) { alt.log(error) };
};

export async function sendEmbedWebHookAsync(webhookurl, content) {
    if (webhookurl == undefined || content == undefined) return;
    try {
        let success = await nodefetch(webhookurl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: content
        });
        return success;
    } catch (error) { alt.log(error) };
};

alt.on("discord:sendWebhook", async (type, message) => {
    let url = webhooksURL[type]
    if (url) {
        await sendEmbedWebHookAsync(url, message)
    }
});

export default { sendWebHook, sendWebHookAsync, sendEmbedWebHookAsync };

alt.log("Załadowano => [server/discord/webhook.js]")