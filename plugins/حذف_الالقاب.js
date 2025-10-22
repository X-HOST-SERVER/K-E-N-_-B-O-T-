let handler = async function (m, { conn }) {
  try {
    const groupId = m.chat;
    const groupInfo = await conn.groupMetadata(groupId);

    if (!groupInfo) {
      return conn.reply(groupId, 'حدث خطأ في الحصول على معلومات المجموعة.', m);
    }

    const groupMembers = groupInfo.participants;
    const users = global.db?.data?.users || {};

    // جمع الأعضاء الذين لديهم لقب في هذه المجموعة
    const usersWithNicknames = Object.entries(users)
      .filter(([jid, user]) => user.groups?.[groupId]?.name)
      .map(([jid, user]) => ({ jid, name: user.groups[groupId].name }))
      .sort((a, b) => a.name.localeCompare(b.name, 'ar'));

    if (usersWithNicknames.length === 0) {
      return conn.reply(groupId, '*لم يتم تسجيل أي لقب بعد في هذه النقابه*', m);
    }

    let deletedNamesList = '*╮──────────────────⟢ـ*\n*┆╻❮ الألقــاب المحــذوفــة  ❯╹*';
    let currentLetter = '';

    for (let user of usersWithNicknames) {
      const firstLetter = user.name.charAt(0);
      if (firstLetter !== currentLetter) {
        deletedNamesList += `\n`;
        currentLetter = firstLetter;
      }

      // حذف اللقب فقط من قاعدة البيانات
      delete users[user.jid].groups[groupId].name;

      deletedNamesList += `*◍ ${user.name}*\n`;
    }

    deletedNamesList += `*╮──────────────────⟢ـ*\n`;
    deletedNamesList += `عــدد الــمــحــذوفــيــن: *${usersWithNicknames.length} مــن ${groupMembers.length}*\n`;
    deletedNamesList += '*╯──────────────────⟢ـ*';

    await conn.reply(groupId, deletedNamesList.trim(), m);

  } catch (err) {
    await conn.reply(m.chat, `❌ خطأ: ${err}`, m);
  }
};

handler.help = ['حذف_الألقاب'];
handler.tags = ['حذف', 'أسماء', 'عربية'];
handler.command = ['حذف_الألقاب', 'حذف_الالقاب'];
handler.group = true;
handler.admin = true; // يفضل أن يكون للأدمن فقط
handler.botAdmin = true; // يجب أن يكون البوت أدمن لحذف الألقاب
handler.fail = null;

export default handler;