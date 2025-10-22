let handler = async (m, { conn, args }) => {
  if (!m.isGroup) throw '⚠️ هذا الأمر يعمل داخل المجموعات فقط.';
  if (!m.quoted && !args[0]) throw '👤 منشن الشخص أو أرسل رقمه.\n\nمثال:\n.invite 201234567890';

  let user = m.quoted ? m.quoted.sender : (args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net');
  let link = await conn.groupInviteCode(m.chat);
  let url = `https://chat.whatsapp.com/${link}`;

  await conn.sendMessage(user, { text: `👋 أهلاً، هذه دعوة للانضمام إلى الجروب:\n${url}` }, { quoted: m });
  m.reply(`✅ تم إرسال رابط الدعوة إلى: @${user.split('@')[0]}`, null, { mentions: [user] });
};

handler.help = ['invite'];
handler.tags = ['group'];
handler.command = ['invite', 'دعوه'];

export default handler;