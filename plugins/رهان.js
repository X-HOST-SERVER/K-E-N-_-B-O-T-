// roulette.js
let rouletteBets = {};      // { chatId: [ { user, amount, color } ] }
let rouletteTimers = {};    // { chatId: timeoutId }
let rouletteResult = {};    // { chatId: lastResultString }

const MIN_BET = 500;
const MAX_BET = 100000;
const ROUND_DELAY = 10 * 1000; // 10 ثواني (تقدر تغيّرها)

function mapColor(input) {
  if (!input) return null;
  input = input.toString().toLowerCase().trim();
  if (["red", "r", "أحمر", "احمر", "احم"].includes(input)) return "red";
  if (["black", "b", "أسود", "اسود", "سود"].includes(input)) return "black";
  return null;
}

const handler = async (m, { conn, args, usedPrefix, command }) => {
  try {
    // validate args
    if (!args || args.length < 2) {
      return m.reply(
`✳️ طريقة الاستخدام:
${usedPrefix + command} <المبلغ> <اللون>
مثال: ${usedPrefix + command} 500 أحمر`
      );
    }

    const amount = parseInt(args[0]);
    const color = mapColor(args[1]);
    const chatId = m.chat;

    if (isNaN(amount) || amount < MIN_BET) {
      return m.reply(`✳️ الحد الأدنى للرهان هو ${MIN_BET} ذهب.`);
    }
    if (!color) {
      return m.reply(`✳️ الرجاء اختيار لون صالح: أحمر أو أسود (أو red/black).`);
    }
    if (amount > MAX_BET) {
      return m.reply(`🟥 لا يمكنك المراهنة بأكثر من ${MAX_BET} ذهب.`);
    }

    // ensure user exists in DB
    const user = global.db && global.db.data && global.db.data.users && global.db.data.users[m.sender];
    if (!user) {
      return m.reply('✳️ المستخدم غير موجود في قاعدة البيانات.');
    }

    // ensure numeric credit field
    if (typeof user.credit !== 'number') user.credit = Number(user.credit) || 0;

    if (user.credit < amount) {
      return m.reply('✳️ ليس لديك ما يكفي من الذهب!');
    }

    // add bet
    if (!rouletteBets[chatId]) rouletteBets[chatId] = [];
    rouletteBets[chatId].push({ user: m.sender, amount, color });

    // reply confirmation (مزخرفة)
    const confirmMsg =
`╔═━━••【🧬】••━━═╗
✦ ✅ تم وضع رهان بقيمة ${amount} ذهب على اللون ${color} ✦
✦ بواسطة: ${conn.getName(m.sender)} ✦
╚═━━••【📮】••━━═╝`;
    await conn.reply(chatId, confirmMsg, m, { mentions: [m.sender] });

    // start timer if not already started for this chat
    if (!rouletteTimers[chatId]) {
      rouletteTimers[chatId] = setTimeout(() => {
        resolveRoulette(chatId, conn).catch(err => console.error('resolveRoulette error:', err));
      }, ROUND_DELAY);
    }

  } catch (err) {
    console.error('handler error:', err);
    return m.reply(`❌ حدث خطأ أثناء محاولة وضع الرهان: ${err.message || err}`);
  }
};

async function resolveRoulette(chatId, conn) {
  try {
    const bets = rouletteBets[chatId];
    if (!bets || bets.length === 0) {
      // nothing to do
      if (rouletteTimers[chatId]) {
        clearTimeout(rouletteTimers[chatId]);
        delete rouletteTimers[chatId];
      }
      return;
    }

    const colors = ['red', 'black'];
    const resultColor = colors[Math.floor(Math.random() * colors.length)];

    const winners = [];
    const losers = [];

    for (const bet of bets) {
      const userRecord = global.db && global.db.data && global.db.data.users && global.db.data.users[bet.user];
      if (!userRecord) {
        // skip if user not found (avoid crash)
        losers.push(`@${bet.user.split('@')[0]} (غير موجود في DB)`);
        continue;
      }
      // ensure numeric
      if (typeof userRecord.credit !== 'number') userRecord.credit = Number(userRecord.credit) || 0;

      if (resultColor === bet.color) {
        // نفس منطقك: فوز = إضافة المبلغ
        userRecord.credit += bet.amount;
        winners.push(`@${bet.user.split('@')[0]} ربح ${bet.amount}`);
      } else {
        userRecord.credit -= bet.amount;
        losers.push(`@${bet.user.split('@')[0]} خسر ${bet.amount}`);
      }
    }

    let resultMessage = 
`╔═━━••【🧬】••━━═╗
✦ 🎲 النتيجة: الكرة هبطت على *${resultColor}* ✦
╚═━━••【📮】••━━═╝

🎉 الفائزين:
${winners.length ? winners.join('\n') : 'لا يوجد فائزين ❌'}

🔻 الخاسرون:
${losers.length ? losers.join('\n') : 'لا يوجد خاسرين'}

╔═━━••【🧬】••━━═╗
✦ ⚡ 𝑲𝑬𝑵 𝑩𝑶𝑻 ⚡ ✦
╚═━━••【📮】••━━═╝`;

    // mentions only the involved users
    const mentions = bets.map(b => b.user).filter((v,i,a) => a.indexOf(v) === i);

    // send result
    await conn.sendMessage(chatId, { text: resultMessage }, { mentions });

    // cleanup
    delete rouletteBets[chatId];
    if (rouletteTimers[chatId]) {
      clearTimeout(rouletteTimers[chatId]);
      delete rouletteTimers[chatId];
    }
    rouletteResult[chatId] = resultMessage;

  } catch (err) {
    console.error('resolveRoulette caught error:', err);
    try {
      await conn.sendMessage(chatId, { text: `❌ حدث خطأ أثناء احتساب نتيجة الروليت.` });
    } catch (_) {}
    // cleanup to avoid stuck timers/bets
    delete rouletteBets[chatId];
    if (rouletteTimers[chatId]) {
      clearTimeout(rouletteTimers[chatId]);
      delete rouletteTimers[chatId];
    }
  }
}

handler.help = ['gamble <amount> <color>'];
handler.tags = ['economy'];
handler.command = ['رهان'];
handler.group = true;

export default handler;