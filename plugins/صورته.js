// plugin-pp-mention-only.js
// استخدام: .صورته أو .photo
// الميزة: يظهر فقط صورة الأشخاص الممنشنين، ولا يظهر صورتك إذا ما فيش منشن

let handler = async (m, { conn }) => {
  try {
    // نأخذ فقط الـ mentionedJid
    let targets = [];
    if (m.mentionedJid && Array.isArray(m.mentionedJid) && m.mentionedJid.length) {
      targets = m.mentionedJid.slice(0, 5); // حد أقصى 5 لمنع الفلاش
    } else {
      // لو ما فيش منشن، لا نعرض أي صورة ولا نجيب صورتك
      return await m.reply(
`╔═━━••【🧬】••━━═╗
✦ من فضلك منشن الشخص اللي عايز صورته.
╚═━━••【📮】••━━═╝`
      );
    }

    // دالة مساعدة لجلب رابط الصورة
    const getPP = async (jid) => {
      let pp = null;
      try {
        if (conn.profilePictureUrl) {
          pp = await conn.profilePictureUrl(jid).catch(() => null);
        }
      } catch (e) {
        pp = null;
      }
      if (!pp && conn.getProfilePicture) {
        try {
          pp = await conn.getProfilePicture(jid).catch(() => null);
        } catch (e) {
          pp = null;
        }
      }
      return pp;
    };

    const defaultPic = 'https://telegra.ph/file/9f0b8b6a2a9f7b0b8a7d9.png';

    for (let i = 0; i < targets.length; i++) {
      const jid = targets[i];
      const ppUrl = await getPP(jid);

      if (!ppUrl) {
        await conn.sendMessage(
          m.chat,
          {
            image: { url: defaultPic },
            caption:
`╔═━━••【🧬】••━━═╗
✦ لا توجد صورة أو لا يمكن الوصول إليها.
✦ الهدف: ${jid}
╚═━━••【📮】••━━═╝`
          },
          { quoted: m }
        );
      } else {
        await conn.sendMessage(
          m.chat,
          {
            image: { url: ppUrl },
            caption:
`╔═━━••【🧬】••━━═╗
✦ صورة البروفايل للمستخدم: ${jid}
╚═━━••【📮】••━━═╝`
          },
          { quoted: m }
        );
      }
    }

  } catch (err) {
    console.error(err);
    await m.reply(
`╔═━━••【🧬】••━━═╗
✦ حصل خطأ أثناء جلب الصور. تأكد أن البوت عنده صلاحية رؤية صور الملف الشخصي.
╚═━━••【📮】••━━═╝`
    );
  }
};

handler.command = /^(صورته|صورته\?|photo|pp)$/i;
handler.help = ['صورته', 'photo'];
handler.tags = ['tools'];
handler.group = false;
handler.private = false;

export default handler;