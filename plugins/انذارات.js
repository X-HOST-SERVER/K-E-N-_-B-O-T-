const handler = async (m, { conn, isOwner }) => {
  // نجيب كل المستخدمين اللي عندهم إنذارات
  const adv = Object.entries(global.db.data.users).filter(([_, data]) => data.warn);

  const caption = `
╔═━━••【🧬】••━━═╗
✦ قائمة الإنذارات ✦
╚═━━••【🧬】••━━═╝

${adv.length > 0 
  ? adv.map(([jid, user], i) => `
✦ المستخدم: @${isOwner ? jid.split`@`[0] : jid}  
✦ إنذاراته: ❪${user.warn}/3❫
╔═━━••【🧬】••━━═╗`).join('\n') 
  : '✦ لا يوجد مستخدمون لديهم إنذارات حالياً ✦'}
  `.trim();

  await conn.sendMessage(m.chat, { react: { text: '🚨', key: m.key } });

  await conn.sendMessage(
    m.chat, 
    { text: caption, mentions: await conn.parseMention(caption) }, 
    { quoted: m }
  );
};

handler.command = /^(listwarn|انذارات|التحذيرات)$/i;
handler.group = true;
handler.admin = true;

export default handler;