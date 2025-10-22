let handler = async (m, { conn, args }) => {
  let setting = global.db.data.settings[conn.user.jid] || {};

  if (!args[0]) {
    return m.reply(`
⚙️ إعدادات "جادى بوت"

الحالة الحالية: *${setting.jadibotmd ? '✅ مفعّل' : '❌ معطّل'}*

الاستخدام:
- *.جادىبوت تشغيل* ← لتفعيل
- *.جادىبوت تعطيل* ← لإيقاف
`);
  }

  if (args[0].toLowerCase() === "تشغيل") {
    setting.jadibotmd = true;
    m.reply("✅ تم *تفعيل* ميزة جادى بوت بنجاح.");
  } else if (args[0].toLowerCase() === "تعطيل") {
    setting.jadibotmd = false;
    m.reply("❌ تم *تعطيل* ميزة جادى بوت.");
  } else {
    m.reply("⚠️ استخدم فقط: *تشغيل* أو *تعطيل*");
  }

  global.db.data.settings[conn.user.jid] = setting;
};

handler.help = ['جادبوت <تشغيل/تعطيل>'];
handler.tags = ['jadibot'];
handler.command = /^جادىبوت$/i;

export default handler;