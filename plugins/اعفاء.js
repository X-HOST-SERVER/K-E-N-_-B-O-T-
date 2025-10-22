let handler = async (m, { conn, text }) => {
  let user;
  
  if (m.mentionedJid && m.mentionedJid.length > 0) {
    // لو منشن
    user = m.mentionedJid[0];
  } else if (m.quoted) {
    // لو ريبلاي
    user = m.quoted.sender;
  } else if (text) {
    // لو كتب رقم
    let number = text.replace(/[^0-9]/g, ''); // شيل أي رموز
    if (number.length < 11 || number.length > 13) {
      return m.reply(`╔═━━••【🧬】••━━═╗\n✦ الـرقـم غـيـر صـحـيـح ✦\n╚═━━••【🧬】••━━═╝`);
    }
    user = number + '@s.whatsapp.net';
  } else {
    return m.reply(`╔═━━••【🧬】••━━═╗\n✦ مـنـشن الشخـص أولا ✦\n╚═━━••【🧬】••━━═╝`);
  }

  await conn.groupParticipantsUpdate(m.chat, [user], 'demote');
  await conn.sendMessage(m.chat, {
    text: `╔═━━••【🧬】••━━═╗
✦ تــم إعفاء *@${user.split('@')[0]}* من الإدارة ✦
✦ 𝑲𝑬𝑵 𝑩𝑶𝑻 دائما بالخدمة ✦
╚═━━••【🧬】••━━═╝`,
    mentions: [user]
  }, { quoted: m });
};

handler.help = ['demote (@tag)'];
handler.tags = ['group'];
handler.command = ['demote', 'اعفاء']; 
handler.group = true;
handler.admin = true;
handler.botAdmin = true;
export default handler;