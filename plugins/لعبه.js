// game-rps-emoji.js
let handler = async (m, { conn, text, usedPrefix, command }) => {
  const choices = ['حجر 🪨', 'ورقة 📄', 'مقص ✂️'];
  const clean = (s = '') => s.replace(/[^أ-يa-z]/gi, '').toLowerCase();

  const user = clean(text);

  // لو المستخدم ما كتبش اختياره
  if (!['حجر', 'ورقة', 'مقص'].includes(user)) {
    let msg = `✊ ✋ ✌️ *لعبة حجر ورقة مقص*\n\nاختر أحد الخيارات:\n${usedPrefix + command} حجر 🪨\n${usedPrefix + command} ورقة 📄\n${usedPrefix + command} مقص ✂️`;
    return conn.sendMessage(m.chat, { text: msg }, { quoted: m });
  }

  // اختيار البوت
  const mapEmoji = { حجر: 'حجر 🪨', ورقة: 'ورقة 📄', مقص: 'مقص ✂️' };
  let bot = ['حجر', 'ورقة', 'مقص'][Math.floor(Math.random() * 3)];
  let result = '';

  // تأكد من وجود db
  if (!global.db) global.db = { data: { users: {} } };
  if (!global.db.data.users[m.sender]) global.db.data.users[m.sender] = { exp: 0 };

  if (user === bot) {
    global.db.data.users[m.sender].exp += 200;
    result = `🔰 *تعادل!*\n\nأنت: ${mapEmoji[user]}\nالبوت: ${mapEmoji[bot]}\n🎁 حصلت على +200 نقطة`;
  } else if (
    (user === 'حجر' && bot === 'مقص') ||
    (user === 'ورقة' && bot === 'حجر') ||
    (user === 'مقص' && bot === 'ورقة')
  ) {
    global.db.data.users[m.sender].exp += 500;
    result = `🥳 *فزت!*\n\nأنت: ${mapEmoji[user]}\nالبوت: ${mapEmoji[bot]}\n🎁 حصلت على +500 نقطة`;
  } else {
    global.db.data.users[m.sender].exp -= 100;
    result = `☠️ *خسرت!*\n\nأنت: ${mapEmoji[user]}\nالبوت: ${mapEmoji[bot]}\n❌ تم خصم -100 نقطة`;
  }

  return conn.sendMessage(m.chat, { text: result }, { quoted: m });
};

handler.help = ['rps'];
handler.tags = ['game'];
handler.command = /^(rps|ppt|لعبه|لعبة|حجر|ورقة|ورقه|مقص)$/i;

export default handler;