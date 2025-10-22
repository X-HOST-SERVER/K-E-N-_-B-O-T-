import { prepareWAMessageMedia, generateWAMessageFromContent } from '@whiskeysockets/baileys';

const timeout = 60000;

let handler = async (m, { conn, command }) => {
    if (command.startsWith('اجاب_')) {
        let id = m.chat;
        let obito = conn.obito[id];

        if (!obito) {
            return conn.reply(m.chat, `
╔═━━••【🧬】••━━═╗
*✦ لا توجد لعبة نشطة الآن 📮✦*
╚═━━••【📮】••━━═╝`, m);
        }

        let selectedAnswerIndex = parseInt(command.split('_')[1]);
        if (isNaN(selectedAnswerIndex) || selectedAnswerIndex < 1 || selectedAnswerIndex > 4) {
            return conn.reply(m.chat, `
╔═━━••【🧬】••━━═╗
*✦ اختيار غير صالح يا صديقي 📮✦*
╚═━━••【📮】••━━═╝`, m);
        }

        let selectedAnswer = obito.options[selectedAnswerIndex - 1];
        let isCorrect = obito.correctAnswer === selectedAnswer;

        if (isCorrect) {
            await conn.reply(m.chat, `
╔═━━••【🧬】••━━═╗
*✦ إجابة صحيحة ✅🧬✦*
*✦ الجائزة ⇇『500xp』📮✦*
╚═━━••【📮】••━━═╝`, m);
            global.db.data.users[m.sender].exp += 500;
            clearTimeout(obito.timer);
            delete conn.obito[id];
        } else {
            obito.attempts -= 1;
            if (obito.attempts > 0) {
                await conn.reply(m.chat, `
╔═━━••【🧬】••━━═╗
*✦ إجابة خاطئة ❌📮✦*
*✦ المحاولات المتبقية ⇇『${obito.attempts}』🧬✦*
╚═━━••【📮】••━━═╝`, m);
            } else {
                await conn.reply(m.chat, `
╔═━━••【🧬】••━━═╗
*✦ انتهت محاولاتك 📮✦*
*✦ الإجابة الصحيحة ⇇『${obito.correctAnswer}』🧬✦*
╚═━━••【📮】••━━═╝`, m);
                clearTimeout(obito.timer);
                delete conn.obito[id];
            }
        }
    } else {
        try {
            conn.obito = conn.obito || {};
            let id = m.chat;

            if (conn.obito[id]) {
                return conn.reply(m.chat, `
╔═━━••【🧬】••━━═╗
*✦ لديك لعبة قيد التشغيل بالفعل 📮✦*
╚═━━••【📮】••━━═╝`, m);
            }

            const response = await fetch('https://raw.githubusercontent.com/ze819/game/master/src/game.js/luffy1.json');
            const obitoData = await response.json();

            if (!obitoData) {
                throw new Error(`
╔═━━••【🧬】••━━═╗
*✦ فشل الحصول على بيانات اللعبة 📮✦*
╚═━━••【📮】••━━═╝`);
            }

            const obitoItem = obitoData[Math.floor(Math.random() * obitoData.length)];
            const { img, name } = obitoItem;

            let options = [name];
            while (options.length < 4) {
                let randomItem = obitoData[Math.floor(Math.random() * obitoData.length)].name;
                if (!options.includes(randomItem)) {
                    options.push(randomItem);
                }
            }
            options.sort(() => Math.random() - 0.5);

            const media = await prepareWAMessageMedia({ image: { url: img } }, { upload: conn.waUploadToServer });

            const interactiveMessage = {
                body: {
                    text: `
╔═━━••【🧬】••━━═╗
*✦ لعبة "اعرف علم الدولة" 🧬✦*
*✦ الوقت ⇇『60 ثانية』📮✦*
*✦ الجائزة ⇇『500xp』🧬✦*
╚═━━••【📮】••━━═╝`,
                },
                footer: { text: 'BY :KEN' },
                header: {
                    title: 'ㅤ',
                    subtitle: 'اختر الإجابة الصحيحة من الأسفل 📮',
                    hasMediaAttachment: true,
                    imageMessage: media.imageMessage,
                },
                nativeFlowMessage: {
                    buttons: options.map((option, index) => ({
                        name: 'quick_reply',
                        buttonParamsJson: JSON.stringify({
                            display_text: `┊${index + 1}┊⇇『${option}』`,
                            id: `.اجاب_${index + 1}`
                        })
                    })),
                },
            };

            let msg = generateWAMessageFromContent(m.chat, {
                viewOnceMessage: {
                    message: { interactiveMessage },
                },
            }, { userJid: conn.user.jid, quoted: m });

            conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

            conn.obito[id] = {
                correctAnswer: name,
                options: options,
                timer: setTimeout(async () => {
                    if (conn.obito[id]) {
                        await conn.reply(m.chat, `
╔═━━••【🧬】••━━═╗
*✦ انتهى الوقت 📮✦*
*✦ الإجابة الصحيحة ⇇『${name}』🧬✦*
╚═━━••【📮】••━━═╝`, m);
                        delete conn.obito[id];
                    }
                }, timeout),
                attempts: 2
            };

        } catch (e) {
            console.error(e);
            conn.reply(m.chat, '*✦ حدث خطأ في إرسال الرسالة 📮✦*', m);
        }
    }
};

handler.help = ['اوبيتو'];
handler.tags = ['اوبيتو'];
handler.command = /^(علم|اعلام|اجاب_\d+)$/i;

export default handler;