import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const handler = async (m, { text, conn, args, command, usedPrefix }) => {
    if (!text) {
        return conn.reply(m.chat, 'أدخل رابط صالح.', m);
    }

    try {
        const res = await fetch(text);

        if (!res.ok) {
            throw new Error(`فشل في تحميل الرابط: ${res.statusText}`);
        }

        const body = await res.text();

        // التحقق من أن المحتوى ليس فارغًا
        if (!body || body.trim() === '') {
            return conn.reply(m.chat, 'المحتوى فارغ أو غير قابل للعرض.', m);
        }

        // تحديد مسار الملف
        const fileName = path.join(__dirname, 'content.html');

        // كتابة النص داخل الملف
        fs.writeFileSync(fileName, body, 'utf8');

        // قراءة الملف باستخدام readFileSync
        const fileBuffer = fs.readFileSync(fileName);

        // إرسال الملف HTML
        await conn.sendMessage(m.chat, {
            document: fileBuffer,
            fileName: 'content.html',
            mimetype: 'text/html',
            caption: 'تم كتابة النص داخل الملف وإرساله كملف HTML.'
        }, { quoted: m });

        // حذف الملف بعد الإرسال لتوفير المساحة
        fs.unlinkSync(fileName);

    } catch (error) {
        console.error('Error processing text:', error);
        conn.reply(m.chat, `حدث خطأ : ${error.message}`, m);
    }
};

handler.command = /^(حلل)$/i;
export default handler;