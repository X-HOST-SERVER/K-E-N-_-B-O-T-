import axios from 'axios'
let handler = async(m, { conn, usedPrefix, command }) => {
let res = (await axios.get(`https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/anime-kurumi.json`)).data  
let url = await res[Math.floor(res.length * Math.random())]
conn.sendButton(m.chat, "KEN BOT", author, url, [['⬇️ التالي', `${usedPrefix + command}`]], m)}
handler.help = ['anna']
handler.tags = ['internet']
handler.command = /^(kurumi|كورومي)$/i
export default handler