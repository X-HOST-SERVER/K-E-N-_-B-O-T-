const handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    const Reg = /(?:@([^\s]+))/i;
    let mentionedJid;

    // التحقق من الرد أو المنشن
    if (m.quoted && m.quoted.sender) {
      mentionedJid = m.quoted.sender;
    } else if (text && Reg.test(text)) {
      mentionedJid = text.match(Reg)[1] + '@s.whatsapp.net';
    } else {
      throw `֎╎الاستخـدام الصحيـح.☁️\n\n${usedPrefix + command} @منشـن العضـو أو الرد على رسالته.`;
    }

    if (!mentionedJid) throw '֎╎يجب توجيه منشـن للعضو الذي تريد حذف لقبه أو الرد على رسالته.';

    const users = global.db?.data?.users || {};
    let user = users[mentionedJid];

    if (!user || !user.groups || !user.groups[m.chat]) {
      throw '֎╎هذا العضو غير مسجّل.';
    }

    const groupId = m.chat;
    const oldName = user.groups[groupId].name;

    if (!oldName) throw '֎╎هذا العضو لا يملك أي لقب للحذف.';

    // حذف اللقب
    delete user.groups[groupId].name;
    users[mentionedJid] = user;

    const caption = `֎╎تم حذف اللقب بنجاح:
╭──────────────
├✶ اللقب المحذوف: *${oldName}*
╰──────────────`;

    await conn.reply(m.chat, caption, m);

  } catch (err) {
    await conn.reply(m.chat, `❌ خطأ: ${err}`, m);
  }
};

handler.admin = true;
handler.group = true;
handler.botAdmin = true;
handler.command = /^(حذف-لقب|حذف_لقب)$/i;

export default handler;