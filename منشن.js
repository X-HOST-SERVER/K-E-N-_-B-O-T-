import pkg from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, prepareWAMessageMedia, proto } = pkg;

let defaultLimit = {};
let usageLimits = {};

const handler = async (m, { isOwner, isAdmin, conn, args, command }) => {
  if (!(isAdmin || isOwner)) {
    global.dfail('admin', m, conn);
    throw false;
  }

  let groupId = m.chat;
  let usageKey = `${groupId}:${command}`;

  if (command === 'تحديد_منشن') {
    if (!isOwner) return m.reply('❌ هذا الأمر متاح فقط للمطور.');

    let limit = parseInt(args[0]);
    if (isNaN(limit) || limit <= 0) return m.reply('❌ الرجاء إدخال رقم صحيح كحد للاستخدام.');

    defaultLimit[groupId] = limit;
    return m.reply(`╔═━━••【🧬】••━━═╗
✦ تم تعيين حد استخدام أوامر المنشن إلى *${limit}* مرة ✦
╚═━━••【🧬】••━━═╝`);
  }

  if (!defaultLimit[groupId]) defaultLimit[groupId] = 3;
  if (usageLimits[usageKey] === undefined) usageLimits[usageKey] = defaultLimit[groupId];

  if (usageLimits[usageKey] <= 0) {
    return m.reply(`╔═━━••【🧬】••━━═╗
✦ تم استنفاد الحد الأقصى لاستخدام هذا الأمر في المجموعة ✦
✦ الرجاء التواصل مع المطور لإعادة التعيين ✦
╚═━━••【🧬】••━━═╝`);
  }

  usageLimits[usageKey]--;

  const coverImageUrl = 'https://files.catbox.moe/fd2422.jpg';
  const media = await prepareWAMessageMedia(
    { image: { url: coverImageUrl } },
    { upload: conn.waUploadToServer }
  );

  let textMsg = `
╔═━━••【🧬】••━━═╗
✦ قــائـمـة أوامـر المنـشـن ✦  
✦ اختـر النـوع المـناسـب مـن الأسـفـل ✦
╚═━━••【🧬】••━━═╝

> 👥 منشن الكل  
> 🌟 منشن الأعضاء فقط  
> 👑 منشن المشرفين  

📌 البوت: 𝑲𝑬𝑵 𝑩𝑶𝑻
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
                buttonParamsJson: `{"display_text":"👥 منشن الكل","id":".منشن_الكل"}`
              },
              {
                name: "quick_reply",
                buttonParamsJson: `{"display_text":"🌟 منشن الأعضاء","id":".منشن_اعضاء"}`
              },
              {
                name: "quick_reply",
                buttonParamsJson: `{"display_text":"👑 منشن المشرفين","id":".منشن_مشرفين"}`
              }
            ]
          },
          contextInfo: { mentionedJid: [m.sender] }
        })
      }
    }
  }, {});

  await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
};

handler.help = ['منشن', 'تحديد_منشن'];
handler.tags = ['group'];
handler.command = /^(منشن|تحديد_منشن)$/i;
handler.admin = true;
handler.group = true;

export default handler;