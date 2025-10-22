import fs from 'fs';
import pathModule from 'path';

const handler = async (m, { text, usedPrefix, command }) => {

  const devNumber = '201021902759'; // رقم المطور المسموح فقط

  if (m.sender !== devNumber + '@s.whatsapp.net') {
    return m.reply('〘 ❗ 〙 أنت غير مصرح لك باستخدام هذا الأمر.');
  }

  // تعديل هنا: بدل throw، نرسل رسالة إذا لم يكن هناك نص
  if (!text) return m.reply(`〘 ❗ 〙 يرجى إدخال اسم الملف بعد الأمر`);

  const q = m.quoted || m;
  const mime = q.mimetype || '';
  const isTextMessage = q.text;

  // تأكد من وجود مجلد plugins
  const pluginsDir = 'plugins';
  if (!fs.existsSync(pluginsDir)) fs.mkdirSync(pluginsDir, { recursive: true });

  const filePath = pathModule.join(pluginsDir, `${text}.js`);
  let isAdd = false;
  let isDel = false;

  try {

    switch (command) {

      case 'احفظ':

        if (!q || (!isTextMessage && !mime)) {
          throw `〘 ❗ 〙 يرجى الرد على رسالة نصية أو مستند ليتم حفظه كملف`;
        }

        if (isTextMessage) {
          const content = isTextMessage.trim();
          if (!content) throw `〘 ❗ 〙 النص المستلم فارغ.`;
          fs.writeFileSync(filePath, content, 'utf8');
          isAdd = true;
        } else if (mime === 'application/javascript' && q.download) {
          const buffer = await q.download();
          const content = buffer.toString('utf8');
          if (!content.trim()) throw `〘 ❗ 〙 الملف المرفق فارغ أو لا يحتوي على نصوص صالحة.`;
          fs.writeFileSync(filePath, content, 'utf8');
          isAdd = true;
        } else {
          throw `〘 ❗ 〙 الملف المرفق غير مدعوم.`;
        }
        break;

      case 'امسح':

        if (!fs.existsSync(filePath)) {
          throw `〘 ❗ 〙 الملف "${filePath}" غير موجود لحذفه`;
        }

        fs.unlinkSync(filePath);
        isDel = true;
        break;

      default:

        throw `〘 ❗ 〙 الأمر غير معروف

استخدم أحد الأوامر التالية:

- ${usedPrefix}احفظ

- ${usedPrefix}امسح`;
    }

    if (isAdd) {
      m.reply(`〘 ✅ 〙 تم حفظ الملف بنجاح: "${filePath}"`);
    } else if (isDel) {
      m.reply(`〘 ✅ 〙 تم حذف الملف بنجاح: "${filePath}"`);
    }

  } catch (error) {
    m.reply(`〘 ❗ 〙 حدث خطأ: ${error.message || error}`);
  }

};

handler.help = ['احفظ', 'امسح'];
handler.tags = ['owner'];
handler.command = ['احفظ', 'امسح'];
handler.owner = true;

export default handler;