// salah.js
// أمر مواقيت الصلاة
// يعتمد على @whiskeysockets/baileys

import axios from 'axios';
import pkg from '@whiskeysockets/baileys';
const { prepareWAMessageMedia, generateWAMessageFromContent } = pkg;

// دالة لتحويل الوقت إلى نظام 12 ساعة
function format12HourTime(time24) {
  const [hours, minutes] = time24.split(':');
  let period = 'AM';
  let hours12 = parseInt(hours, 10);

  if (hours12 >= 12) {
    period = 'PM';
    if (hours12 > 12) hours12 -= 12;
  }

  return `${hours12}:${minutes} ${period}`;
}

const handler = async (m, { text, usedPrefix, command, conn }) => {
  const rows = [
    { header: '⌈ اختر مدينتك ⌋', title: "القاهرة", description: '', id: `${usedPrefix + command} القاهره` },
    { header: '⌈ اختر مدينتك ⌋', title: "الرياض", description: '', id: `${usedPrefix + command} الرياض` },
    { header: '⌈ اختر مدينتك ⌋', title: "الدار البيضاء", description: '', id: `${usedPrefix + command} الدار البيضاء` },
    { header: '⌈ اختر مدينتك ⌋', title: "دبي", description: '', id: `${usedPrefix + command} دبي` },
    { header: '⌈ اختر مدينتك ⌋', title: "بيروت", description: '', id: `${usedPrefix + command} بيروت` },
    { header: '⌈ اختر مدينتك ⌋', title: "تونس", description: '', id: `${usedPrefix + command} تونس` },
    { header: '⌈ اختر مدينتك ⌋', title: "الجزائر", description: '', id: `${usedPrefix + command} الجزائر` },
    { header: '⌈ اختر مدينتك ⌋', title: "بغداد", description: '', id: `${usedPrefix + command} بغداد` },
    { header: '⌈ اختر مدينتك ⌋', title: "عمان", description: '', id: `${usedPrefix + command} عمان` },
    { header: '⌈ اختر مدينتك ⌋', title: "الخرطوم", description: '', id: `${usedPrefix + command} الخرطوم` },
    { header: '⌈ اختر مدينتك ⌋', title: "دمشق", description: '', id: `${usedPrefix + command} دمشق` },
    { header: '⌈ اختر مدينتك ⌋', title: "طرابلس", description: '', id: `${usedPrefix + command} طرابلس` },
    { header: '⌈ اختر مدينتك ⌋', title: "مسقط", description: '', id: `${usedPrefix + command} مسقط` },
    { header: '⌈ اختر مدينتك ⌋', title: "الدوحة", description: '', id: `${usedPrefix + command} الدوحة` },
    { header: '⌈ اختر مدينتك ⌋', title: "المنامة", description: '', id: `${usedPrefix + command} المنامة` },
    { header: '⌈ اختر مدينتك ⌋', title: "الكويت", description: '', id: `${usedPrefix + command} الكويت` },
    { header: '⌈ اختر مدينتك ⌋', title: "جدة", description: '', id: `${usedPrefix + command} جدة` },
    { header: '⌈ اختر مدينتك ⌋', title: "مكة", description: '', id: `${usedPrefix + command} مكة` },
    { header: '⌈ اختر مدينتك ⌋', title: "المدينة", description: '', id: `${usedPrefix + command} المدينة` },
    { header: '⌈ اختر مدينتك ⌋', title: "الشارقة", description: '', id: `${usedPrefix + command} الشارقة` },
    { header: '⌈ اختر مدينتك ⌋', title: "المغرب", description: '', id: `${usedPrefix + command} المغرب` }
  ];

  // صورة البوت
  const botImage = 'https://files.catbox.moe/yrmn1g.jpg';
  const mediaMessage = await prepareWAMessageMedia({ image: { url: botImage } }, { upload: conn.waUploadToServer });

  // رسالة البداية
  const caption = `╔═━━••【🕌】••━━═╗
✦ مرحباً *${m.pushName}*
✦ اختر مدينتك من القائمة 👇
╚═━━••【📮】••━━═╝`;

  const msg = generateWAMessageFromContent(m.chat, {
    viewOnceMessage: {
      message: {
        interactiveMessage: {
          body: { text: caption },
          footer: { text: "✦ 𝑲𝑬𝑵 𝑩𝑶𝑻 ✦" },
          header: {
            hasMediaAttachment: true,
            imageMessage: mediaMessage.imageMessage
          },
          nativeFlowMessage: {
            buttons: [
              {
                name: 'single_select',
                buttonParamsJson: JSON.stringify({
                  title: 'قائمة المدن',
                  sections: [
                    {
                      title: '「 المدن المتاحة 🕌 」',
                      rows: rows
                    }
                  ]
                })
              }
            ]
          }
        }
      }
    }
  }, { userJid: conn.user.jid, quoted: m });

  // إذا المستخدم كتب مدينة مباشرة
  if (text) {
    try {
      const prayerResponse = await axios.get(`http://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(text)}&country=EG`);
      const prayerData = prayerResponse.data.data.timings;

      const fajr = format12HourTime(prayerData.Fajr);
      const sunrise = format12HourTime(prayerData.Sunrise);
      const dhuhr = format12HourTime(prayerData.Dhuhr);
      const asr = format12HourTime(prayerData.Asr);
      const maghrib = format12HourTime(prayerData.Maghrib);
      const isha = format12HourTime(prayerData.Isha);

      const prayerMessage = `╔═━━••【🕌】••━━═╗
✦ مواقيت الصلاة اليوم في *${text}*
- الفجر: ${fajr}
- الشروق: ${sunrise}
- الظهر: ${dhuhr}
- العصر: ${asr}
- المغرب: ${maghrib}
- العشاء: ${isha}
╚═━━••【📮】••━━═╝`;

      const mediaMessageWithPrayer = await prepareWAMessageMedia({ image: { url: botImage } }, { upload: conn.waUploadToServer });
      const msgWithPrayer = generateWAMessageFromContent(m.chat, {
        viewOnceMessage: {
          message: {
            interactiveMessage: {
              body: { text: prayerMessage },
              footer: { text: "✦ 𝑲𝑬𝑵 𝑩𝑶𝑻 ✦" },
              header: {
                hasMediaAttachment: true,
                imageMessage: mediaMessageWithPrayer.imageMessage
              },
              nativeFlowMessage: {
                buttons: [
                  {
                    name: 'single_select',
                    buttonParamsJson: JSON.stringify({
                      title: 'قائمة المدن',
                      sections: [
                        {
                          title: '「 المدن المتاحة 🕌 」',
                          rows: rows
                        }
                      ]
                    })
                  }
                ]
              }
            }
          }
        }
      }, { userJid: conn.user.jid, quoted: m });

      await conn.relayMessage(m.chat, msgWithPrayer.message, { messageId: msgWithPrayer.key.id });
    } catch (error) {
      console.error('خطأ في مواقيت الصلاة:', error);
      m.reply('❌ لم أتمكن من العثور على مواقيت الصلاة لهذه المدينة.');
    }
  } else {
    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
  }
};

handler.command = ['الصلاة', 'اذان', 'الصلاه'];
handler.tags = ['tools'];

export default handler;