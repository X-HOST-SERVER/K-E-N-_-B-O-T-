// broadcast.js
export default async function handler(m, { conn, args, isOwner, isROwner }) {
  try {
    // يسمح للمطور فقط
    if (!isOwner && !isROwner) return await conn.sendMessage(m.chat, { text: '❌ فقط للمطور (owner) مُمكن تنفيذ هذا الأمر.' }, { quoted: m });

    // جمع نص الرسالة: من الوسيط أو من رسالة مقتبسة
    let text = args && args.length ? args.join(' ') : '';
    if (!text && m.quoted && (m.quoted?.text || m.quoted?.message)) {
      // إذا كانت رسالة مقتبسة، حاول استخراج نصها أو تحويلها للـ forward
      if (m.quoted.text) text = m.quoted.text;
      else if (typeof m.quoted?.message === 'object') {
        // fallback بسيط
        text = '[محتوى مُقتبس — قم بمراجعته في القناة المقتبسة]';
      }
    }

    if (!text) return await conn.sendMessage(m.chat, { text: '❗ ارسل نص اذاعة أو اقتبس رسالة ثم نفّذ الأمر.\nمثال: ```/broadcast مرحباً جميعاً```' }, { quoted: m });

    // بناء نص مزخرف (الإطار الذي طلبته)
    const decorated = `╔═━━••【 *اذاعه المطور* 】••━━═╗\n✦ ${text}\n╚═━━••【 *المطور ڪين* 】••━━═╝`;

    // الحصول على جميع الجروبات بطرق متنوعة لتوافق إصدارات Baileys المختلفة
    let allJids = [];

    // 1) conn.chats إذا كانت كائن أو Map
    try {
      if (conn.chats) {
        if (typeof conn.chats === 'object' && !conn.chats.keys) {
          allJids = allJids.concat(Object.keys(conn.chats));
        } else if (conn.chats instanceof Map || typeof conn.chats.keys === 'function') {
          allJids = allJids.concat(Array.from(conn.chats.keys()));
        }
      }
    } catch (e) { /* ignore */ }

    // 2) global.db.data.chats (بعض السكربتات تحفظ هناك)
    try {
      if (global && global.db && global.db.data && global.db.data.chats) {
        allJids = allJids.concat(Object.keys(global.db.data.chats));
      }
    } catch (e) { /* ignore */ }

    // 3) conn.store / conn.store.chats (بعض إصدارات baileys)
    try {
      if (conn.store && conn.store.chats) {
        if (typeof conn.store.chats === 'object' && !conn.store.chats.keys) {
          allJids = allJids.concat(Object.keys(conn.store.chats));
        } else if (conn.store.chats instanceof Map || typeof conn.store.chats.keys === 'function') {
          allJids = allJids.concat(Array.from(conn.store.chats.keys()));
        }
      }
    } catch (e) { /* ignore */ }

    // إزالة التكرارات وفلترة الجروبات فقط (jids تنتهي بـ @g.us)
    allJids = [...new Set(allJids)].filter(jid => typeof jid === 'string' && jid.endsWith('@g.us'));

    if (!allJids.length) return await conn.sendMessage(m.chat, { text: '⚠️ لم أجد أي جروبات في ذاكرة البوت.' }, { quoted: m });

    // تأكيد للمطور: كم جروب سيُرسل لهم
    await conn.sendMessage(m.chat, { text: `⏳ جاري الإرسال إلى ${allJids.length} جروب...` }, { quoted: m });

    // إرسال الرسالة إلى كل جروب مع تأخير بسيط لتقليل مخاطر الحظر/الـ rate-limit
    let sent = 0;
    for (const jid of allJids) {
      try {
        await conn.sendMessage(jid, { text: decorated });
        sent++;
        // تأخير بسيط 800-1200ms لتخفيف الضغط (يمكن تعديل)
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        // تجاهل أخطاء كل جروب حتى يُكمل للباقي
        console.error('Broadcast error to', jid, error?.message || error);
      }
    }

    // تقرير نهائي للمطور
    await conn.sendMessage(m.chat, { text: `✅ الانتهاء.\nتم الإرسال إلى ${sent} من أصل ${allJids.length} جروبات.` }, { quoted: m });
  } catch (err) {
    console.error(err);
    await conn.sendMessage(m.chat, { text: '❌ حدث خطأ أثناء تنفيذ الإذاعة. راجع سجلات السيرفر.' }, { quoted: m });
  }
}

handler.command = /^(broadcast|bc|اذاعة)$/i;
handler.rowner = true; // فقط مالك الروت/المطور