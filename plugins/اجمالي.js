let handler = async (m, { conn, command, participants, groupMetadata }) => {
  try {
    if (!global.groupData) global.groupData = {};
    const chatId = m.chat;

    if (!global.groupData[chatId]) global.groupData[chatId] = {};
    const groupUsers = global.groupData[chatId];

    // إضافة جميع المشاركين للمجموعة إذا لم يكونوا موجودين
    participants.forEach(p => {
      if (!groupUsers[p.id]) groupUsers[p.id] = { messagesSent: 0 };
    });

    // استرجاع صورة المجموعة
    let groupPicture;
    try {
      groupPicture = await conn.profilePictureUrl(chatId, 'image');
    } catch {
      groupPicture = 'https://files.catbox.moe/ipu0b5.jpg'; // صورة افتراضية
    }

    const groupName = groupMetadata?.subject || 'المجموعة';

    // أمر إجمالي الرسائل
    if (command === 'اجمالي') {
      const sortedUsers = Object.entries(groupUsers).sort((a, b) => b[1].messagesSent - a[1].messagesSent);
      const totalMessages = sortedUsers.reduce((sum, [_, data]) => sum + data.messagesSent, 0);
      const totalMembers = participants.length;

      let resultMessage = `📊 *إحصائيات الرسائل داخل المجموعة* 📊\n\n`;
      resultMessage += `📌 *المجموعة:* ${groupName}\n`;
      resultMessage += `🔹 *عدد الأعضاء:* ${totalMembers}\n`;
      resultMessage += `🔹 *إجمالي الرسائل:* ${totalMessages} رسالة\n\n`;

      if (sortedUsers.length > 0) {
        const [kingId, kingData] = sortedUsers[0];
        resultMessage += `👑 *ملك التفاعل!* 👑\n`;
        resultMessage += `✨ @${kingId.split('@')[0]} - ${kingData.messagesSent} رسالة ✨\n\n`;
      }

      resultMessage += `📋 *تفاصيل الرسائل حسب الأعضاء:* 📋\n`;
      sortedUsers.forEach(([userId, data], index) => {
        resultMessage += `*${index + 1}. @${userId.split('@')[0]} - ${data.messagesSent} رسالة*\n`;
        resultMessage += `━━━━━━━━━━━━━━━━━━━━\n`;
      });

      await conn.sendMessage(chatId, {
        image: { url: groupPicture },
        caption: resultMessage,
        mentions: participants.map(p => p.id)
      });
    }
  } catch (err) {
    await conn.reply(m.chat, `❌ حدث خطأ: ${err}`, m);
  }
};

// تحديث إحصائيات الرسائل عند كل رسالة
handler.all = async (m) => {
  try {
    if (!global.groupData) global.groupData = {};
    const chatId = m.chat;

    if (!global.groupData[chatId]) global.groupData[chatId] = {};
    const groupUsers = global.groupData[chatId];

    if (!groupUsers[m.sender]) groupUsers[m.sender] = { messagesSent: 0 };

    if (m.text) groupUsers[m.sender].messagesSent += 1;
  } catch (err) {
    console.log(err);
  }
};

handler.help = ['اجمالي'];
handler.tags = ['main'];
handler.command = ['اجمالي'];
handler.register = true;
handler.group = true;

export default handler;