// salary.js

const SALARY_AMOUNT = 50000; // قيمة الراتب الشهري (تقدر تغيّرها)
const SALARY_COOLDOWN = 30 * 24 * 60 * 60 * 1000; // 30 يوم بالمللي ثانية

const handler = async (m, { conn, usedPrefix, command }) => {
  let user = global.db.data.users[m.sender];
  if (!user) return m.reply("❌ لم أتمكن من إيجاد بياناتك في قاعدة البيانات.");

  if (typeof user.credit !== 'number') user.credit = 0;
  if (!user.lastSalary) user.lastSalary = 0;

  let now = Date.now();
  let diff = now - user.lastSalary;

  if (diff < SALARY_COOLDOWN) {
    let remaining = SALARY_COOLDOWN - diff;
    let days = Math.floor(remaining / (24 * 60 * 60 * 1000));
    let hours = Math.floor((remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    let minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
    return m.reply(
`⏳ لقد استلمت راتبك بالفعل!
يرجى الانتظار ${days} يوم و ${hours} ساعة و ${minutes} دقيقة قبل الراتب القادم.`
    );
  }

  user.credit += SALARY_AMOUNT;
  user.lastSalary = now;

  let msg = 
`╔═━━••【🧬】••━━═╗
✦ 🎉 تم استلام راتبك الشهري ✦
✦ 👤 الاسم: ${conn.getName(m.sender)} ✦
✦ 💰 الراتب: ${SALARY_AMOUNT} ذهب ✦
✦ 🏦 رصيدك الحالي: ${user.credit} ✦
╚═━━••【📮】••━━═╝
⚡ 𝑲𝑬𝑵 𝑩𝑶𝑻 ⚡`;

  m.reply(msg);
};

handler.help = ['راتب'];
handler.tags = ['economy'];
handler.command = ['راتب'];

export default handler;