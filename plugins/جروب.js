import pkg from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, prepareWAMessageMedia, proto } = pkg;

function clockString(ms) {
    let h = Math.floor(ms / 3600000);
    let m = Math.floor(ms % 3600000 / 60000);
    let s = Math.floor(ms % 60000 / 1000);
    return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
}

const handler = async (m, { conn, usedPrefix }) => {
    let taguser = '@' + m.sender.split("@")[0];
    await conn.sendMessage(m.chat, { react: { text: '🧬', key: m.key } });

    const imageUrl = 'https://files.catbox.moe/cqz3ea.jpg'; // صورة العرض
    const media = await prepareWAMessageMedia(
        { image: { url: imageUrl } },
        { upload: conn.waUploadToServer }
    );

    const textMsg = `
╔═━━••【🧬】••━━═╗
✦ الـبـوت: 𝑲𝑬𝑵 𝑩𝑶𝑻 ✦  
✦ أهلاً بـك يا ${taguser} ✦  

✦ ⚙️ الوظيفة: إدارة الجروب وتسهيل التحكم ✦  
> 📌 يمكنك فـتح أو قفل الجروب من الأزرار بالأسفل  
> 🔔 البوت دائماً في الخدمة 24/7  

✦ 🕒 الوقت منذ تشغيل البوت: ${clockString(process.uptime() * 1000)} ✦
╚═━━••【🧬】••━━═╝
    `;

    const msg = generateWAMessageFromContent(m.chat, {
        viewOnceMessage: {
            message: {
                interactiveMessage: proto.Message.InteractiveMessage.create({
                    body: { text: textMsg },
                    header: media,
                    nativeFlowMessage: {
                        buttons: [
                            {
                                name: "quick_reply",
                                buttonParamsJson: `{"display_text":"🔓 فـتح 🔓","id":"${usedPrefix}group فتح"}`
                            },
                            {
                                name: "quick_reply",
                                buttonParamsJson: `{"display_text":"🔒 قـفل 🔒","id":"${usedPrefix}group قفل"}`
                            }
                        ]
                    },
                    contextInfo: { mentionedJid: [m.sender] }
                })
            }
        }
    }, {});

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
}

handler.help = ['group *open/close*'];
handler.tags = ['group'];
handler.command = ['جروب', 'اعدادات'];
handler.admin = true;
handler.botAdmin = true;

export default handler;