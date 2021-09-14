import * as alt from "alt-server"
import axios from "axios"
import express from "express"
import cors from "cors"
import path from "path"

import { isWhitelisted } from "../discord/bot.js"

const htmlPath = path.join(alt.getResourcePath("gregology_framework"), "server/login/html")
const jsPath = path.join(alt.getResourcePath("gregology_framework"), "server/login/html/js")
const imgPath = path.join(alt.getResourcePath("gregology_framework"), "server/login/html/img")

const app = express()

app.use(cors())
app.get("/authenticate", handleMainRedirect)
app.use("/js", express.static(jsPath))
app.use("/img", express.static(imgPath))

async function handleMainRedirect(req, res) {
    const token = req.query.code;
    const userToken = req.query.state;
    let request;

    if (!token || !userToken) {
        res.sendFile(path.join(htmlPath, "/error.html"), err => {});
        return;
    }

    const authParams = new URLSearchParams();
    authParams.append(`client_id`, "679781516204572716");
    authParams.append(`client_secret`, "43mvzW56s12C_ir9VBE6Qwb9vP_Y5DuF");
    authParams.append(`grant_type`, `authorization_code`);
    authParams.append(`code`, token);
    authParams.append(`scope`, `identify`);
    authParams.append(`scope`, `email`);
    authParams.append(`redirect_uri`, `http://127.0.0.1:7790/authenticate`);

    request = await axios.post(`https://discordapp.com/api/oauth2/token`, authParams, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    if (!request.data || !request.data.access_token) {
        res.sendFile(path.join(htmlPath, "/error.html"), err => {});
        return;
    }

    const discordData = {...request.data};

    request = await axios.get(`https://discordapp.com/api/users/@me`, {
        headers: {
            "Content-Type": 'application/x-www-form-urlencoded',
            Authorization: `${discordData.token_type} ${discordData.access_token}`,
        },
    });

    
    if (!request.data || !request.data.id || !request.data.username) {
        //console.log("TUTAJ")
        res.sendFile(path.join(htmlPath, "/error.html"), err => {});
        return;
    }

    const player = [...alt.Player.all].find(player => player.token === userToken);
    if (!player || !player.valid) {
        res.sendFile(path.join(htmlPath, "/error.html"), err => {});
        return;
    }

    const isAuthorized = isWhitelisted(request.data.id).then(r => {
        if (r === false) {
            res.sendFile(path.join(htmlPath, "/whitelist.html"), err => {});
            player.kick("Nie posiadasz whitelisty.")
            return;
        } else {
            res.sendFile(path.join(htmlPath, "/done.html"), err => {});
            alt.emitClient(player, "auth:exitAuth")
            alt.emit("auth:done", player, request.data)
            //console.log(request.data)
        }

    })

}

app.listen(7790)