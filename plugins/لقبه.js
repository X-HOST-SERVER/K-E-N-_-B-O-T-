const handler = async function(m, { conn, text }) {
  try {
    const users = global.db?.data?.users || {};
    const groupId = m.chat;
    let mentionedJid;

    // التحقق من الرد أو المنشن
    if (m.quoted && m.quoted.sender) {
      mentionedJid = m.quoted.sender;
    } else if (m.mentionedJid && m.mentionedJid[0]) {
      mentionedJid = m.mentionedJid[0];
    } else {
      throw '֎╎يجب توجيه منشـن للعضو الذي تريد معرفة لقبه أو الرد على رسالته.';
    }

    const user = users[mentionedJid];

    // التحقق من وجود اللقب في المجموعة الحالية
    if (!user || !user.groups || !user.groups[groupId]?.name) {
      throw '֎╎لا يوجد لقب مسجل لهذا العضو في هذه المجموعة.';
    }

    const nickname = user.groups[groupId].name;
    await conn.reply(m.chat, `֎╎لقـب العضـو هـو: \`${nickname}\``, m);

  } catch (err) {
    await conn.reply(m.chat, `❌ خطأ: ${err}`, m);
  }
};

handler.group = true;
handler.command = /^(لقبه|nickname)$/i;

export default handler;