// add-dollar-fixed.js
let handler = async (m, { conn, args, text, usedPrefix }) => {
  try {
    // التأكد من وجود DB
    if (!global.db || !global.db.data || !global.db.data.users) {
      return conn.reply(m.chat, '❌ قاعدة البيانات غير مُهيّأة. تأكد من وجود global.db.data.users', m);
    }

    // نحدد الهدف (who)
    let who = null;
    // 1) إن كان هنالك منشن داخل الجروب
    if (m.isGroup && Array.isArray(m.mentionedJid) && m.mentionedJid.length > 0) {
      who = m.mentionedJid[0];
    }
    // 2) إن كان الأمر رد على رسالة (reply)
    else if (m.quoted && m.quoted.sender) {
      who = m.quoted.sender;
    }
    // 3) إن كان خارج جروب -> صاحب الشات
    else if (!m.isGroup) {
      who = m.chat;
    }

    if (!who) {
      // حاول العثور على jid داخل النص إن كتبه المستخدم يدوياً (مثل 2012xxxx@s.whatsapp.net أو @1234567890)
      const raw = (text || args && args.join(' ') || '').trim();
      const maybe = raw.split(/\s+/).find(t => /@?\d{5,}/.test(t));
      if (maybe) {
        // تنظيف من @
        const phone = maybe.replace(/@/, '').replace(/\D/g, '');
        if (phone) who = (phone.includes('@')) ? phone : `${phone}@s.whatsapp.net`;
      }
    }

    if (!who) {
      return conn.reply(m.chat,
`╔═━━••【🧬】••━━═╗
✦ ❗ من فضلك: قم بعمل منشن للمستخدم أو رد على رسالته لإضافة دولارات ✦
╚═━━••【📮】••━━═╝`, m);
    }

    // استخراج المبلغ من النص أو الأرجز
    const rawInput = (text || args && args.join(' ') || '').replace('@' + who.split('@')[0], '').trim();
    // نبحث عن أول رقم صحيح موجب في النص
    const found = rawInput.match(/-?\d+/g);
    if (!found || found.length === 0) {
      return conn.reply(m.chat,
`╔═━━••【🧬】••━━═╗
✦ ❗ الرجاء إدخال المبلغ بالأرقام. مثال:
${usedPrefix || '.'}دولار @user 100 ✦
╚═━━••【📮】••━━═╝`, m);
    }

    const amount = parseInt(found[0]);
    if (isNaN(amount) || amount <= 0) {
      return conn.reply(m.chat,
`╔═━━••【🧬】••━━═╗
✦ ❗ المبلغ يجب أن يكون رقم صحيح أكبر من صفر ✦
╚═━━••【📮】••━━═╝`, m);
    }

    // تهيئة سجل المستخدم إن لم يكن موجود
    if (typeof global.db.data.users[who] === 'undefined') global.db.data.users[who] = {};
    if (typeof global.db.data.users[who].credit !== 'number') {
      global.db.data.users[who].credit = Number(global.db.data.users[who].credit) || 0;
    }

    // إضافة المبلغ
    global.db.data.users[who].credit += amount;

    // رسالة تأكيد مزخرفة مع منشن
    const name = conn.getName ? conn.getName(who) : who.split('@')[0];
    const replyMsg =
`╔═━━••【🧬】••━━═╗
✦ ✅ تمت الإضافة بنجاح ✦
╚═━━••【📮】••━━═╝

👤 المستخدم: @${who.split('@')[0]}
💵 المبلغ المضاف: ${amount} دولار
💰 الرصيد الحالي: ${global.db.data.users[who].credit} دولار

╔═━━••【🧬】••━━═╗
✦ ⚡ 𝑲𝑬𝑵 𝑩𝑶𝑻 ⚡ ✦
╚═━━••【📮】••━━═╝`;

    await conn.reply(m.chat, replyMsg, m, { mentions: [who] });

  } catch (err) {
    console.error('add-dollar error:', err);
    return conn.reply(m.chat,
`╔═━━••【🧬】••━━═╗
✦ ❌ حدث خطأ: ${err.message || err} ✦
╚═━━••【📮】••━━═╝`, m);
  }
};

handler.help = ['دولار <@user> <amount>'];
handler.tags = ['economy'];
handler.command = ['دولار'];
handler.rowner = true;

export default handler;