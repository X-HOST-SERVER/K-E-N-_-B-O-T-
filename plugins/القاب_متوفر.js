const handler = async function(m, { conn, text }) {
  try {
    const groupId = m.chat;
    const name = text?.trim();

    if (!name) throw '֎╎ادخل لقـب بشكـل صحيـح.';

    const users = global.db?.data?.users || {};

    let taken = false;
    for (let key in users) {
      const user = users[key];
      if (user.groups?.[groupId]?.name?.toLowerCase() === name.toLowerCase()) {
        taken = true;
        break;
      }
    }

    if (taken) {
      await conn.reply(m.chat, `֎╎لقـب \`${name}\` غيـر متـاح.`, m);
    } else {
      await conn.reply(m.chat, `֎╎لقـب \`${name}\` مـتاح.`, m);
    }

  } catch (err) {
    await conn.reply(m.chat, `❌ خطأ: ${err}`, m);
  }
};

// يمكنك إزالة شرط الأدمن إذا تريد أن يعمل للجميع
handler.admin = false; // true إذا تريد أن يكون للأدمن فقط
handler.group = true;
handler.command = /^(متوفر|available)$/i;

export default handler;