import { generateWAMessageFromContent } from '@whiskeysockets/baileys';

// أمر عرض الرومات
const handler = async (m, { conn, isOwner }) => {
  if (!isOwner) return m.reply("❌ *هذا الأمر خاص بالمطور فقط!*");

  let groups = [];
  try {
    groups = await conn.groupFetchAllParticipating(); // يجلب كل الجروبات بشكل صحيح
    groups = Object.values(groups);
  } catch (e) {
    console.error("خطأ في جلب الجروبات:", e);
    return m.reply("⚠️ *فشل في جلب الجروبات.*");
  }

  if (!groups.length) return m.reply("🤖 *البوت مش موجود في أي جروب حاليًا.*");

  let caption = `
╔═━━••【📋】••━━═╗
✦ *قائمة الرومات (الجروبات) اللي البوت فيها:*  
✦ العدد: *${groups.length}*
اختر الجروب اللي عايز يخرج منه 👇
╚═━━••【🤖】••━━═╝
`;

  const interactiveMessage = {
    body: { text: caption },
    footer: { text: "🧬 بواسطة: KEN BOT" },
    header: { title: `❲ إدارة الرومات ❳`, hasMediaAttachment: false },
    nativeFlowMessage: {
      buttons: [
        {
          name: 'single_select',
          buttonParamsJson: JSON.stringify({
            title: '❲ قائمة الجروبات ❳',
            sections: [
              {
                title: "📌 اختر الجروب",
                rows: groups.map(g => ({
                  header: g.subject || "جروب بدون اسم",
                  title: `🚪 خروج من ${g.subject || g.id}`,
                  description: g.id,
                  id: `.خروج ${g.id}`
                }))
              }
            ]
          })
        }
      ],
      messageParamsJson: ''
    }
  };

  let msg = generateWAMessageFromContent(m.chat, {
    viewOnceMessage: { message: { interactiveMessage } },
  }, { userJid: conn.user.jid, quoted: m });

  await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
};

handler.command = /^(رومات)$/i;
handler.owner = true;
export default handler;


// أمر الخروج من الجروب
const leaveHandler = async (m, { conn, args, isOwner }) => {
  if (!isOwner) return m.reply("❌ *هذا الأمر خاص بالمطور فقط!*");
  if (!args[0]) return m.reply("⚠️ *حدد ID الجروب اللي عايز يخرج منه.*");

  try {
    const metadata = await conn.groupMetadata(args[0]);
    const groupName = metadata.subject || "جروب بدون اسم";

    await conn.groupLeave(args[0]);

    await m.reply(`
╔═━━••【✅】••━━═╗
✦ *تم خروج البوت بنجاح*  
✦ اسم الجروب: ${groupName}  
✦ ID: ${args[0]}  
╚═━━••【🤖】••━━═╝
    `);
  } catch (e) {
    await m.reply(`
╔═━━••【❌】••━━═╗
✦ *فشل الخروج من الجروب*  
✦ السبب: ${e.message}  
╚═━━••【⚠️】••━━═╝
    `);
  }
};

leaveHandler.command = /^(خروج)$/i;
leaveHandler.owner = true;
export { leaveHandler };