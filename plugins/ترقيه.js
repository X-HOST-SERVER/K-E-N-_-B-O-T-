let handler = async (m, { conn, usedPrefix, text, isAdmin, isOwner }) => {
  if (!isAdmin && !isOwner) 
    return conn.reply(m.chat, '╔═━━••【🧬】••━━═╗\n✦ هذا الأمر مخصص للمشرفين فقط ✦\n╚═━━••【🧬】••━━═╝', m);

  let user;
  if (m.mentionedJid && m.mentionedJid.length > 0) {
    user = m.mentionedJid[0]; // منشن
  } else if (m.quoted) {
    user = m.quoted.sender; // رد
  } else if (text) {
    let number = text.replace(/[^0-9]/g, ''); // نزيل الرموز
    if (number.length < 11 || number.length > 13) {
      return conn.reply(m.chat, '╔═━━••【🧬】••━━═╗\n✦ الرقم غير صحيح، الرجاء إدخال رقم صالح ✦\n╚═━━••【🧬】••━━═╝', m);
    }
    user = number + '@s.whatsapp.net';
  } else {
    return conn.reply(m.chat, `╔═━━••【🧬】••━━═╗
✦ الاستخدام الصحيح ✦
╚═━━••【🧬】••━━═╝

┏━⊱ ✦ ${usedPrefix}ترقيه @منشن
┗━⊱ ✦ ${usedPrefix}ترقيه (بالرد على رسالة)`, m);
  }

  try {
    await conn.groupParticipantsUpdate(m.chat, [user], 'promote');
    await conn.sendMessage(m.chat, {
      text: `╔═━━••【🧬】••━━═╗
✦ تم ترقية *@${user.split('@')[0]}* إلى مشرف ✦
✦ 𝑲𝑬𝑵 𝑩𝑶𝑻 دائما بالخدمة ✦
╚═━━••【🧬】••━━═╝`,
      mentions: [user]
    }, { quoted: m });
  } catch (e) {
    console.error(e);
    conn.reply(m.chat, '╔═━━••【🧬】••━━═╗\n✦ حدث خطأ أثناء تنفيذ العملية ✦\n╚═━━••【🧬】••━━═╝', m);
  }
};

handler.help = ['ترقيه @منشن', 'ترقيه (بالرد)'];
handler.tags = ['group'];
handler.command = /^(ترقيه|رفع|ارفع)$/i;
handler.group = true;
handler.botAdmin = true;

export default handler;