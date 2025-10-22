const handler = async (m, { conn }) => {
  try {
    const revoke = await conn.groupRevokeInvite(m.chat);
    const newLink = 'https://chat.whatsapp.com/' + revoke;

    let teks = `╔═━━••【🧬】••━━═╗
✦ تـم تـغـيـيـر رابـط الـجروب ✦
╚═━━••【🧬】••━━═╝

🔹️ *الـرابـط الـجديـد:*
${newLink}

╔═━━••【🧬】••━━═╗
✦ 𝑲𝑬𝑵 𝑩𝑶𝑻 دائما بالخدمة ✦
╚═━━••【🧬】••━━═╝`;

    await conn.reply(m.chat, teks, m);
  } catch (e) {
    console.error(e);
    await conn.reply(
      m.chat,
      `╔═━━••【🧬】••━━═╗
✦ حدث خطأ أثناء تجديد الرابط ✦
╚═━━••【🧬】••━━═╝`,
      m
    );
  }
};

handler.command = ['resetlink', 'تغيير_اللينك', 'رستر', 'تجديد'];
handler.botAdmin = true;
handler.admin = true;
handler.group = true;

export default handler;