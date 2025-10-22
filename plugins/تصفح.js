// handlers/pinterest.js
const axios = require("axios");
const { pinterest } = require("../lib/scraper.js");
const { generateWAMessageFromContent, prepareWAMessageMedia } = require("@whiskeysockets/baileys");

async function handler(m, { conn, usedPrefix, command, text }) {
    if (!text) return conn.sendMessage(m.chat, { text: `⚠️ أدخل مصطلح البحث.\nمثال: ${usedPrefix + command} cute cat` }, { quoted: m });

    // رسالة انتظار
    await conn.sendMessage(m.chat, { react: { text: "⌛", key: m.key } });

    let images = [];

    const sources = [
        async () => {
            const res = await pinterest.search(text, 6);
            return res.result.pins.slice(0, 6).map(p => p.media.images.orig.url);
        },
        async () => {
            const res = await axios.get(`https://api.siputzx.my.id/api/s/pinterest?query=${encodeURIComponent(text)}`);
            return res.data.data.slice(0, 6).map(r => r.images_url);
        },
        async () => {
            const res = await axios.get(`https://api.dorratz.com/v2/pinterest?q=${encodeURIComponent(text)}`);
            return res.data.slice(0, 6).map(r => r.image);
        }
    ];

    for (const source of sources) {
        try {
            images = await source();
            if (images.length > 0) break;
        } catch (e) {
            console.error("Pinterest search error:", e.message);
        }
    }

    if (!images.length) {
        await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
        return conn.sendMessage(m.chat, { text: `❌ لم يتم العثور على نتائج لـ "${text}".`, quoted: m });
    }

    for (let i = 0; i < images.length; i++) {
        const media = await prepareWAMessageMedia({ image: { url: images[i] } }, { upload: conn.waUploadToServer });
        const messageContent = {
            templateMessage: {
                hydratedTemplate: {
                    imageMessage: media.imageMessage,
                    hydratedContentText: `🔎 نتيجة البحث عن: ${text}\n📸 𝐏𝐇𝐎𝐓𝐎 ${i + 1}`,
                    hydratedFooterText: "Pinterest Search",
                    hydratedButtons: [
                        {
                            urlButton: {
                                displayText: "🔗 فتح في Pinterest",
                                url: `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(text)}`
                            }
                        }
                    ]
                }
            }
        };
        const msg = generateWAMessageFromContent(m.chat, messageContent, { quoted: m });
        await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
    }

    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
}

// خصائص الهاندلر
handler.help = ["pinterest <keyword>"];
handler.tags = ["بحث"];
handler.command = ["pin", "تصفح"]; // array بدل RegExp
handler.register = true;

module.exports = handler;