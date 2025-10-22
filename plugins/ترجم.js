import fetch from 'node-fetch';
import { generateWAMessageFromContent } from '@whiskeysockets/baileys';

const handler = async (m, { conn, text, usedPrefix }) => {
  try {
    usedPrefix = usedPrefix || '.';

    // لو مفيش نص، نرسل رسالة مثال واضحة (مش throw)
    if (!text || !text.trim()) {
      const exampleAr = `${usedPrefix}ترجم مرحبا`;
      const exampleEn = `${usedPrefix}translate hello`;
      const reply = `❌ *يرجى إدخال النص الذي تريد ترجمته.*\n\n📌 *أمثلة:* \n> ${exampleAr}\n> ${exampleEn}`;
      return await conn.sendMessage(m.chat, { text: reply }, { quoted: m });
    }

    const languages = {
      "af": "Afrikaans","sq": "Albanian","am": "Amharic","ar": "Arabic","hy": "Armenian","az": "Azerbaijani",
      "eu": "Basque","be": "Belarusian","bn": "Bengali","bs": "Bosnian","bg": "Bulgarian","ca": "Catalan",
      "ceb": "Cebuano","ny": "Chichewa","zh": "Chinese","co": "Corsican","hr": "Croatian","cs": "Czech",
      "da": "Danish","nl": "Dutch","en": "English","eo": "Esperanto","et": "Estonian","tl": "Filipino",
      "fi": "Finnish","fr": "French","fy": "Frisian","gl": "Galician","ka": "Georgian","de": "German",
      "el": "Greek","gu": "Gujarati","ht": "Haitian Creole","ha": "Hausa","haw": "Hawaiian","iw": "Hebrew",
      "hi": "Hindi","hmn": "Hmong","hu": "Hungarian","is": "Icelandic","ig": "Igbo","id": "Indonesian",
      "ga": "Irish","it": "Italian","ja": "Japanese","jw": "Javanese","kn": "Kannada","kk": "Kazakh",
      "km": "Khmer","rw": "Kinyarwanda","ko": "Korean","ku": "Kurdish","ky": "Kyrgyz","lo": "Lao",
      "la": "Latin","lv": "Latvian","lt": "Lithuanian","lb": "Luxembourgish","mk": "Macedonian","mg": "Malagasy",
      "ms": "Malay","ml": "Malayalam","mt": "Maltese","mi": "Maori","mr": "Marathi","mn": "Mongolian",
      "my": "Myanmar (Burmese)","ne": "Nepali","no": "Norwegian","or": "Odia","ps": "Pashto","fa": "Persian",
      "pl": "Polish","pt": "Portuguese","pa": "Punjabi","ro": "Romanian","ru": "Russian","sm": "Samoan",
      "gd": "Scots Gaelic","sr": "Serbian","st": "Sesotho","sn": "Shona","sd": "Sindhi","si": "Sinhala",
      "sk": "Slovak","sl": "Slovenian","so": "Somali","es": "Spanish","su": "Sundanese","sw": "Swahili",
      "sv": "Swedish","tg": "Tajik","ta": "Tamil","tt": "Tatar","te": "Telugu","th": "Thai","tr": "Turkish",
      "tk": "Turkmen","uk": "Ukrainian","ur": "Urdu","ug": "Uyghur","uz": "Uzbek","vi": "Vietnamese",
      "cy": "Welsh","xh": "Xhosa","yi": "Yiddish","yo": "Yoruba","zu": "Zulu"
    };

    const imagurl = 'https://files.catbox.moe/hm0l6b.jpg';
    const chname = '𝐊𝐄𝐍 • 𝐁𝐎𝐓';
    const chid = '120363376982425324@newsletter';

    const caption = `📖 *النص:* ${text}\n🌍 *اختر اللغة التي تريد الترجمة إليها:*`;

    // تبسيط إنشاء الـ interactive message بدون أخطاء
    const interactiveMessage = {
      body: { text: caption },
      footer: { text: "🧬 بواسطة: 𝐊𝐄𝐍 • 𝐁𝐎𝐓" },
      header: { title: `*❲ التــرجمة ❳*`, hasMediaAttachment: false },
      contextInfo: {
        mentionedJid: await conn.parseMention?.(caption) || [],
        isForwarded: true,
        forwardingScore: 1,
        forwardedNewsletterMessageInfo: {
          newsletterJid: chid,
          newsletterName: chname,
          serverMessageId: 100
        },
        externalAdReply: {
          showAdAttribution: true,
          title: "𝐊𝐄𝐍 • 𝐁𝐎𝐓 👑",
          body: "❲ خدمــة الترجمة ❳",
          thumbnailUrl: imagurl,
          mediaUrl: imagurl,
          mediaType: 1,
          sourceUrl: 'https://whatsapp.com/channel/0029VaumDtWJZg4B8jLyMK2q',
          renderLargerThumbnail: true
        }
      },
      nativeFlowMessage: {
        buttons: [
          {
            name: 'single_select',
            buttonParamsJson: JSON.stringify({
              title: '❲ قائمة اللغات ❳',
              sections: [
                {
                  title: "🌍 اختر لغة الترجمة",
                  rows: Object.keys(languages).map(lang => ({
                    header: languages[lang],
                    title: `🔄 ترجمة إلى ${languages[lang]}`,
                    description: '',
                    id: `.تنفيذ_الترجمة ${lang} ${text.replace(/\n/g, ' ')}`
                  }))
                }
              ]
            })
          }
        ],
        messageParamsJson: ''
      }
    };

    // بناء الرسالة وإرسالها
    const msg = generateWAMessageFromContent(m.chat, {
      viewOnceMessage: { message: { interactiveMessage } }
    }, { userJid: conn.user?.jid || conn.user, quoted: m });

    await conn.sendMessage(m.chat, { react: { text: '🌍', key: m.key } });
    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

  } catch (err) {
    console.error(err);
    // رسالة خطأ ودودة لو حصل شيء
    return await conn.sendMessage(m.chat, { text: "❌ حصل خطأ داخلي، حاول مرة تانية أو بلغ المطور." }, { quoted: m });
  }
};

handler.help = ["ترجم <النص>", "translate <text>"];
handler.tags = ["tools"];
handler.command = /^(ترجم|translate)$/i;

export default handler;