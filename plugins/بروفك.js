import fs from 'fs';
import fetch from 'node-fetch';

// هنا ضع الـ JID الخاص بالبوت إذا احتجت، غالبًا conn.user.jid يكفي
let botJid; // سيتم تحديثه تلقائيًا من conn.user.jid

let handler = async (m, { conn, text, args }) => {
    try {
        // فقط المطور يمكنه استخدام الأمر
        const isOwner = [/* ضع رقمك هنا */ '201021902759@s.whatsapp.net']; 
        if (!isOwner.includes(m.sender)) return m.reply('❌ أنت لست المطور!');

        // التأكد من وجود رابط أو صورة
        let url = args[0] || (m.quoted ? m.quoted.imageUrl : null);
        if (!url) return m.reply('❗ أرسل صورة أو رابط صورة لتحديث بروفايل البوت.');

        let imageBuffer;

        if (m.quoted && m.quoted.message.imageMessage) {
            // إذا كانت الصورة مقتبسة من رسالة
            const stream = await conn.downloadMediaMessage(m.quoted);
            imageBuffer = stream;
        } else {
            // إذا كان رابط
            const res = await fetch(url);
            imageBuffer = await res.arrayBuffer();
        }

        await conn.updateProfilePicture(botJid || conn.user.jid, Buffer.from(imageBuffer));
        m.reply('✅ تم تحديث صورة البوت بنجاح!');
    } catch (e) {
        console.log(e);
        m.reply('❌ حدث خطأ أثناء تحديث صورة البوت.');
    }
};

export default handler;
handler.command = /^(بروفك|profpic)$/i; // أو أي اسم تريده للأمر
handler.owner = true; // لتأكيد أنه مخصص للمطور