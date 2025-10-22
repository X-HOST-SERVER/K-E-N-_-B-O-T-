import fs from 'fs';

let timeout = 60000;
let poin = 500;

let handler = async (m, { conn, usedPrefix }) => {
    conn.tekateki = conn.tekateki || {};
    let id = m.chat;

    if (id in conn.tekateki) {
        conn.reply(m.chat, `╔═━━••【🧬】••━━═╗
✦ هناك سؤال لم ينته بعد 🧰✦
╚═━━••【🧬】••━━═╝`, conn.tekateki[id][0]);
        throw false;
    }

    let tekateki = JSON.parse(fs.readFileSync(`./src/game/miku.json`));
    let json = tekateki[Math.floor(Math.random() * tekateki.length)];
    let _clue = json.response;
    let clue = _clue.replace(/[A-Za-z]/g, ''); // إزالة الحروف الإنجليزية

    let caption = `╔═━━••【🧬】••━━═╗
✦ السؤال ✦
> ❀ ${json.question} ❀
╟────────────────╢
✦ اللاعب: @${m.sender.split('@')[0]} ✦
✦ الوقت: ${(timeout / 1000).toFixed(2)} ثانية ✦
✦ الجائزة: ${poin} نقاط ✦
╟────────────────╢
✦ البوت: 𝑲𝑬𝑵 𝑩𝑶𝑻 ✦
╚═━━••【🧬】••━━═╝`.trim();

    conn.tekateki[id] = [
        await conn.reply(m.chat, caption, m),
        json,
        poin,
        setTimeout(async () => {
            if (conn.tekateki[id]) {
                await conn.reply(m.chat, `╔═━━••【🧬】••━━═╗
✦ انتهى الوقت 💔✦
✦ الإجابة الصحيحة: ${json.response} ✦
╚═━━••【🧬】••━━═╝`, conn.tekateki[id][0]);
                delete conn.tekateki[id];
            }
        }, timeout)
    ];
};

handler.help = ['miku'];
handler.tags = ['game'];
handler.command = /^(فكك)$/i;

export default handler;