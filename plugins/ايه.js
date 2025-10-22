// ayah.js
// أمر "ايه" - جلب آية من القرآن الكريم
// يعتمد على @whiskeysockets/baileys
// - .ايه        → آية عشوائية
// - .ايه 255    → آية برقم عالمي
// - .ايه 2:255  → آية من سورة معينة

import fetch from "node-fetch";
import pkg from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;

const CHANNEL_URL = 'https://whatsapp.com/channel/0029VbB5lRa77qVL1zoGaH2A';

let handler = async (m, { conn, args }) => {
  try {
    let res, json;

    if (!args || !args[0]) {
      // آية عشوائية
      res = await fetch('https://api.alquran.cloud/v1/ayah/random');
    } else {
      const input = args[0].trim();
      if (input.includes(':') || input.includes('.')) {
        const parts = input.includes(':') ? input.split(':') : input.split('.');
        const surahNum = parseInt(parts[0]);
        const ayahNum  = parseInt(parts[1]);
        if (isNaN(surahNum) || isNaN(ayahNum)) return m.reply("❌ مثال صحيح: `.ايه 2:255`");
        res = await fetch(`https://api.alquran.cloud/v1/ayah/${surahNum}:${ayahNum}`);
      } else {
        const num = parseInt(input);
        if (isNaN(num)) return m.reply("❌ من فضلك اكتب رقم آية صحيح!");
        res = await fetch(`https://api.alquran.cloud/v1/ayah/${num}`);
      }
    }

    json = await res.json();
    if (!json || !json.data) throw new Error('⚠️ لم يتم استلام بيانات صالحة من API');

    const ayah = json.data.text || '—';
    const surahArabic = (json.data.surah && json.data.surah.name) ? json.data.surah.name : (json.data.surah && json.data.surah.englishName) || 'غير معروف';
    const numberInSurah = json.data.numberInSurah || json.data.number || '—';

    const text = `╔═━━••【📖】••━━═╗
✦ السورة: *${surahArabic}*
✦ رقم الآية: *${numberInSurah}*
✦ الآية:
> ${ayah}
╚═━━••【🌙】••━━═╝`;

    // إرسال رسالة مع زر URL مباشر
    const msg = generateWAMessageFromContent(
      m.chat,
      {
        viewOnceMessage: {
          message: {
            messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
            interactiveMessage: proto.Message.InteractiveMessage.create({
              body: proto.Message.InteractiveMessage.Body.create({ text }),
              footer: proto.Message.InteractiveMessage.Footer.create({ text: "📢 اضغط للانضمام إلى القناة" }),
              header: proto.Message.InteractiveMessage.Header.create({
                title: "",
                hasMediaAttachment: false
              }),
              nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                buttons: [
                  {
                    name: "cta_url",
                    buttonParamsJson: JSON.stringify({
                      display_text: "📌 قناة البوت",
                      url: CHANNEL_URL,
                      merchant_url: CHANNEL_URL
                    })
                  }
                ]
              })
            })
          }
        }
      },
      { userJid: m.sender }
    );

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

  } catch (error) {
    console.error('ayah handler error:', error);
    m.reply("❌ حصل خطأ أثناء جلب الآية.");
  }
};

handler.command = /^ايه$/i;
export default handler;