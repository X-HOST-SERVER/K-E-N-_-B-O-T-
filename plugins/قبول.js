// approve-any-number.js
let handler = async (m, { conn, args }) => {
  try {
    if (!m.isGroup) {
      return await conn.sendMessage(m.chat, { text: '❌ هذا الأمر يخص المجموعات فقط.' }, { quoted: m });
    }

    // جلب الطلبات المعلقة
    const pendingRequests = await conn.groupRequestParticipantsList(m.chat);

    if (!pendingRequests || pendingRequests.length === 0) {
      return await conn.sendMessage(m.chat, { text: 'ℹ️ لا يوجد أي طلبات انضمام معلقة.' }, { quoted: m });
    }

    // الرقم اللي حدده المستخدم
    let count = parseInt(args[0]);
    if (!count || count <= 0) {
      return await conn.sendMessage(m.chat, { text: '❌ الرجاء كتابة رقم صحيح.' }, { quoted: m });
    }

    // لو الرقم أكبر من عدد الطلبات، نقبل الكل
    let toApprove = pendingRequests.slice(0, count);

    for (let user of toApprove) {
      await conn.groupRequestParticipantsUpdate(m.chat, [user.jid], "approve");
      await conn.sendMessage(m.chat, { 
        text: `👋 تم قبول @${user.jid.split('@')[0]} في المجموعة ✅`, 
        mentions: [user.jid] 
      });
    }

    await conn.sendMessage(m.chat, { text: `✅ تم قبول ${toApprove.length} طلب/طلبات انضمام.` }, { quoted: m });

  } catch (err) {
    console.error(err);
    await conn.sendMessage(m.chat, { text: '❌ حدث خطأ أثناء محاولة قبول الطلبات.' }, { quoted: m });
  }
};

handler.command = /^(قبول|accept)$/i;
handler.group = true;
handler.botAdmin = true;

export default handler;