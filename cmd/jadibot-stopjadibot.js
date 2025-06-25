const Connection = require("../lib/connection");
const { exec } = require("child_process")
module.exports = {
command: [ "stopjadibot" ],
tags: [ "Jadibot", "Main" ],
private: true,
func: async (m, { ard, text, isSct }) => {
if (!Collection.conns.has(m.sender.split("@")[0])) return m.reply("Kamu tidak sedang jadibot!")
const number = m.sender.split('@')[0];
    await ard.sendText(m.chat, "Success stop jadibot!", m);
    await database.collection("jadibot").deleteOne({id:m.sender})
    await Connection.conns.get(number)?.end?.();
    await Connection.conns.delete(number);
    exec("rm -rf sessions/" + number)
}
}