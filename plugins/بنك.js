function clockString(ms) {
    let h = Math.floor(ms / 3600000);
    let m = Math.floor(ms % 3600000 / 60000);
    let s = Math.floor(ms % 60000 / 1000);
    return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
}

import pkg from '@whiskeysockets/baileys';
const { prepareWAMessageMedia } = pkg;

const handler = async (m, { conn, usedPrefix }) => {
    let user = global.db.data.users[m.sender];
    let name = conn.getName(m.sender);
    let { bank, exp, health } = user;

    // تصنيف الثروة بإيموجيات جديدة
    let wealth = '⚪ *مفلس*';
    if (bank > 3000) wealth = '🔹 *فقير*';
    if (bank > 6000) wealth = '🔸 *عامل*';
    if (bank > 100000) wealth = '⚒️ *تاجر*';
    if (bank > 1000000) wealth = '💠 *غني*';
    if (bank > 10000000) wealth = '💎 *مليونير*';
    if (bank > 1000000000) wealth = '👑 *ملياردير*';

    let response = `╭━━━══━━❪🏦❫━━══━━━╮
┃ ✦ الــــبــــنــــك ✦
┃ 👤 الاسم: ${name}
┃ 💰 الرصيد: ${bank} دولار
┃ 🏅 الثروة: ${wealth}
┃ ❤️ الصحة: ${health}/1000
┃ 🧰 الخبرة: ${exp} XP
╰━━━══━━❪🏦❫━━══━━━╯
┃ 📜 نصائح مالية:
┃ 🏦 اكتب ⟪ ${usedPrefix}إيداع ⟫ لإيداع المال!
┃ 💸 اكتب ⟪ ${usedPrefix}سحب ⟫ لسحب الأموال!
╰━━━══━━❪💳❫━━══━━━╯

「🧰 𝑲𝑬𝑵 𝑩𝑶𝑻 🧰」`;

    const imageUrl = 'https://files.catbox.moe/bcsder.jpg'; 

    // ريأكت تفاعلي عند التشغيل
    await conn.sendMessage(m.chat, { react: { text: '🏦', key: m.key } });

    await conn.relayMessage(m.chat, {
        viewOnceMessage: {
            message: {
                interactiveMessage: {
                    header: { title: `🧰 𝑲𝑬𝑵 𝑩𝑶𝑻 🧰` },
                    body: { text: response, subtitle: "𝐏𝐎𝐖𝐄𝐑𝐄𝐃 𝐁𝐘 𝐊𝐄𝐍 𝐁𝐎𝐓" },
                    header: {
                        hasMediaAttachment: true,
                        ...(await prepareWAMessageMedia(
                            { image: { url: imageUrl } },
                            { upload: conn.waUploadToServer },
                            { quoted: m }
                        ))
                    },
                    nativeFlowMessage: {
                        buttons: [
                            {
                                name: "quick_reply",
                                buttonParamsJson: `{\"display_text\":\"💰 البنك\",\"id\":\"${usedPrefix}بنك\"}`
                            },
                            {
                                name: "quick_reply",
                                buttonParamsJson: `{\"display_text\":\"🏆 المستوى\",\"id\":\"${usedPrefix}لفل\"}`
                            },
                            {
                                name: "quick_reply",
                                buttonParamsJson: `{\"display_text\":\"💳 محفظتي\",\"id\":\"${usedPrefix}محفظة\"}`
                            }
                        ]
                    },
                    messageParamsJson: '「🧰 𝑲𝑬𝑵 𝑩𝑶𝑻 🧰」'
                }
            }
        }
    }, {});
}

handler.help = ['البنك'];
handler.tags = ['economy'];
handler.command = ['البنك', 'بنك'];

export default handler;