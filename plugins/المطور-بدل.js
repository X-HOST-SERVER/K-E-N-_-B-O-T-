import fs from 'fs';
import path from 'path';

const allowedNumbers = ['201021902759@s.whatsapp.net', '201021902759@s.whatsapp.net'];

const handler = async (m, { conn, text }) => {
  if (!allowedNumbers.includes(m.sender)) {
    await conn.sendMessage(m.chat, { text: `❌ غير مسموح لك باستخدام هذا الأمر، يا عبد 🧬` }, { quoted: m });
    return;
  }

  if (!text || !text.includes('|')) {
    await conn.sendMessage(m.chat, {
      text: '📮 يرجى كتابة الأمر بالشكل التالي:\n\n`.بدل الكلمة_القديمة|الكلمة_الجديدة`'
    }, { quoted: m });
    return;
  }

  const [oldWord, newWord] = text.split('|').map(s => s.trim());

  if (!oldWord || !newWord) {
    await conn.sendMessage(m.chat, {
      text: '📮 تأكد من أنك أدخلت الكلمتين بشكل صحيح (قديم|جديد).'
    }, { quoted: m });
    return;
  }

  const basePath = 'plugins';
  const files = fs.readdirSync(basePath).filter(file => file.endsWith('.js'));
  let changedFiles = 0;
  let errors = [];

  for (let file of files) {
    const filePath = path.join(basePath, file);
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      if (content.includes(oldWord)) {
        const newContent = content.split(oldWord).join(newWord);
        fs.writeFileSync(filePath, newContent, 'utf-8');
        changedFiles++;
      }
    } catch (err) {
      errors.push({ file, error: err.message });
    }
  }

  let message = `✅ تم استبدال "${oldWord}" بـ "${newWord}" في ${changedFiles} ملف/ملفات.\n`;
  if (errors.length > 0) {
    message += `\n📮 حدثت أخطاء في بعض الملفات:\n`;
    errors.forEach(({ file, error }) => {
      message += `- الملف: ${file}\n  الخطأ: ${error}\n`;
    });
  }

  await conn.sendMessage(m.chat, { text: message }, { quoted: m });
};

handler.help = ['بدل *<قديم>|<جديد>*'];
handler.tags = ['owner'];
handler.command = /^بدل$/i;
handler.owner = true;

export default handler;