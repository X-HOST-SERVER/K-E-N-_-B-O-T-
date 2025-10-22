let handler = async (m, { conn, args }) => {
  try {
    let id = args?.[0]?.match(/\d+\-\d+@g.us/) || m.chat;

    const uniqueOnline = Object.values(conn.chats[id]?.messages || {})
      .map(item => item.key.participant)
      .filter((value, index, self) => value && self.indexOf(value) === index);

    const sortedOnline = uniqueOnline.sort((a, b) => a.split('@')[0].localeCompare(b.split('@')[0]));

    const onlineList = sortedOnline
      .map((k, i) => `✦ ${i + 1}. @${k.split('@')[0]}`)
      .join('\n') || '✦ لا يوجد مستخدمون متصلون حاليا ✦';

    await conn.sendMessage(m.chat, { react: { text: '🌐', key: m.key } });

    let teks = `╔═━━••【🧬】••━━═╗
✦ قائمة المتصلين الآن ✦
╚═━━••【🧬】••━━═╝

${onlineList}

╔═━━••【🧬】••━━═╗
✦ 𝑲𝑬𝑵 𝑩𝑶𝑻 دائما بالخدمة ✦
╚═━━••【🧬】••━━═╝`;

    await conn.reply(m.chat, teks, m, {
      contextInfo: { mentionedJid: sortedOnline }
    });
  } catch (e) {
    console.error(e);
    conn.reply(m.chat, '╔═━━••【🧬】••━━═╗\n✦ حدث خطأ أثناء جلب المتصلين ✦\n╚═━━••【🧬】••━━═╝', m);
  }
};

handler.help = ['المتصلين'];
handler.tags = ['group'];
handler.command = /^(المتصلين)$/i;
handler.group = true;

export default handler;