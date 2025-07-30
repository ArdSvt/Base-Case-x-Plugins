/*
Base bot Case × Plugins by ArdSvt
~ Created on 5/31/2025
~ Contact me wa.me/6283861772386
~ Database MongoDB ( untuk uri nya bisa saya bantu buatkan, chat saja melalui nomor whatsapp diatas )
~ Free fitur jadibot QR/Pairing Code
~ Bisa Custom Pairing Code
*/
require("./config")
const { exec, spawn, execSync } = require("child_process")
const fs = require('fs')
const util = require('util')
const fetch = require('node-fetch')
const path = require("path")
const axios = require('axios')
const cheerio = require('cheerio')
const process = require('process');
const os = require('os');
const { bytesToSize, checkBandwidth, formatSize, getBuffer, isUrl, jsonformat, nganuin, pickRandom, runtime, shorturl, formatp, color, getGroupAdmins } = require("./lib/myfunc");
const { addExif } = require('./lib/exif')
const Connection = require("./lib/connection")
module.exports = ard = async (ard, m, chatUpdate, store) => {
if (!m) return;
if (m.isBaileys) return;
try {
const body = (m && m?.mtype) ? (
m?.mtype === 'conversation' ? m?.message?.conversation :
m?.mtype === 'imageMessage' ? m?.message?.imageMessage?.caption :
m?.mtype === 'videoMessage' ? m?.message?.videoMessage?.caption :
m?.mtype === 'extendedTextMessage' ? m?.message?.extendedTextMessage?.text :
m?.mtype === 'buttonsResponseMessage' ? m?.message?.buttonsResponseMessage?.selectedButtonId :
m?.mtype === 'listResponseMessage' ? m?.message?.listResponseMessage?.singleSelectReply?.selectedRowId :
m?.mtype === 'templateButtonReplyMessage' ? m?.message?.templateButtonReplyMessage?.selectedId :
m?.mtype === 'messageContextInfo' ? (
m?.message?.buttonsResponseMessage?.selectedButtonId || 
m?.message?.listResponseMessage?.singleSelectReply?.selectedRowId || 
m?.text
) : ''
) : '';
const budy = (m && typeof m?.text === 'string') ? m?.text : '';
const prefix = '.'
const isCmd = body?.startsWith(prefix)
const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : ''
const args = body?.trim().split(/ +/).slice(1);
const full_args = body?.replace(command, '').slice(1).trim();
const pushname = m?.pushName || "No Name";
const botNumber = await ard.decodeJid(ard.user.id);
const isCreator = global.creator.includes(m.sender.split("@")[0]) || false;
const itsMe = (m && m?.sender && m?.sender == botNumber) || false;
const text = q = args?.join(" ");
const fatkuns = m && (m?.quoted || m);
const quoted = (fatkuns?.mtype == 'buttonsMessage') ? fatkuns[Object.keys(fatkuns)[1]] :
(fatkuns?.mtype == 'templateMessage') ? fatkuns.hydratedTemplate[Object.keys(fatkuns.hydratedTemplate)[1]] :
(fatkuns?.mtype == 'product') ? fatkuns[Object.keys(fatkuns)[0]] :
m?.quoted || m;
const mime = ((quoted?.msg || quoted) || {}).mimetype || '';
const qmsg = (quoted?.msg || quoted); 
const isMedia = /image|video|sticker|audio/.test(mime);
const userTemp = (jid) => {
return {
jid: jid,
name: m.pushName,
register: true,
money: 0,
exp: 0,
level: 0
}
}
const users = global.database.collection("users")
let me
me = await users.findOne({ jid: m.sender })
if (!me) {
let dbtemp = userTemp(m.sender)
await users.insertOne(dbtemp)
me = await users.findOne({ jid: m.sender })
}
if (!me) return;
const pluginsLoader = async (directory) => {
            let plugins = [];
            const folders = fs.readdirSync(directory);
            folders.forEach(file => {
                const filePath = path.join(directory, file);
                if (filePath.endsWith(".js")) {
                    try {
                        const resolvedPath = require.resolve(filePath);
                        if (require.cache[resolvedPath]) {
                            delete require.cache[resolvedPath];
                        }
                        const plugin = require(filePath);
                        plugins.push(plugin);
 
                    } catch (error) {
                        console.log(`${filePath}:`, error);
                    }
                }
            });
            return plugins;
        };
        const pluginsDisable = true;
        const plugins = await pluginsLoader(path.resolve(__dirname, "./cmd"));
        global.plugins = plugins
        const plug = { ard, prefix, command, text, isGroup: m.isGroup, args, isCmd, isCreator, quoted, mime };
        for (let plugin of plugins) {
if (plugin.before && typeof plugin.before == "function") {
await plugin.before(m, plug)
}
            if (plugin.command.find(e => e == command.toLowerCase())) {
                if (plugin.creator && !isCreator) {
                    return m.reply(`Perintah ini hanya untuk Creator`);
                }
                if (plugin.group && !plug.isGroup) {
                    return m.reply(`Fitur ini hanya bisa di gunakan di Group Chat`);
                }
                if (plugin.private && plug.isGroup) {
                    return m.reply(`Fitur ini hanya bisa di gunakan di Private Chat`);
                }
                if (typeof plugin.func !== "function") return;
                await plugin.func(m, plug);
            }
        }
        
        if (!pluginsDisable) return;
switch (command) {
case "eval": {
if (!isCreator) return;
if (!text) return m.reply("undefined");
try {
let result = await eval(`${text}`);
if (typeof result !== "string") result = util.inspect(result);
m.reply(result);
} catch (error) {
m.reply(String(error));
}
}
break
case "exec": {
if (!isCreator) return;
exec(text, (err, stdout) => {
if (err) return m?.reply("```Error :```\n\n" + `${err}`)
if (stdout) return m?.reply("```Output :```\n\n" + stdout)
})
}
break
default:
}
} catch(error) {
for(let nomer of global.creator) {
await mainbot.sendText(nomer, util.format(error), m)
}
}
}
let file = require.resolve(__filename)
fs.watchFile(file, () => {
fs.unwatchFile(file)
console.log(color(`Update ${__filename}`))
delete require.cache[file]
require(file)
})