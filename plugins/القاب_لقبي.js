const handler = async function(m, { conn }) {
  try {
    const groupId = m.chat;
    const users = global.db?.data?.users || {};
    const user = users[m.sender];

    // التحقق من تسجيل العضو في المجموعة الحالية
    if (!user || !user.groups || !user.groups[groupId] || !user.groups[groupId].name) {
      throw '֎╎أنـت غيـر مسجـل في هـذه النقابه.';
    }

    // استرجاع اللقب من بيانات المجموعة المحددة
    const nickname = user.groups[groupId].name;
    await conn.reply(m.chat, `֎╎لقبـك هـو : \`${nickname}\``, m);

  } catch (err) {
    await conn.reply(m.chat, `❌ خطأ: ${err}`, m);
  }
};

handler.group = true;
handler.command = /^(لقبي|mynickname)$/i;

export default handler;