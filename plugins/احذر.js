import { prepareWAMessageMedia, generateWAMessageFromContent } from '@whiskeysockets/baileys';

const timeout = 60000;

let handler = async (m, { conn, command }) => {
    if (command.startsWith('جوابي_')) {
        let id = m.chat;
        let obito = conn.obito[id];

        if (!obito) {
            return conn.reply(m.chat, '*╔═━━••【📮】••━━═╗*\n*✦ لا توجد لعبة نشطة الان 🧬*_\n*╚═━━••【📮】••━━═╝*', m);
        }

        let selectedAnswerIndex = parseInt(command.split('_')[1]);
        if (isNaN(selectedAnswerIndex) || selectedAnswerIndex < 1 || selectedAnswerIndex > 4) {
            return conn.reply(m.chat, '*╔═━━••【📮】••━━═╗*\n*✦ اختيار غير صالح ❌*_\n*╚═━━••【📮】••━━═╝*', m);
        }

        let selectedAnswer = obito.options[selectedAnswerIndex - 1];
        let isCorrect = obito.correctAnswer === selectedAnswer;

        if (isCorrect) {
            await conn.reply(m.chat, `*╔═━━••【📮】••━━═╗*\n*✦ إجابة صحيحة مبروك 🧬✅*_\n*✦ الجائزة: 500xp*\n*╚═━━••【📮】••━━═╝*`, m);
            global.db.data.users[m.sender].exp += 500;
            clearTimeout(obito.timer);
            delete conn.obito[id];
        } else {
            obito.attempts -= 1;
            if (obito.attempts > 0) {
                await conn.reply(m.chat, `*╔═━━••【📮】••━━═╗*\n*✦ إجابة خاطئة 🧬❌*_\n*✦ المحاولات المتبقية: ${obito.attempts}*\n*╚═━━••【📮】••━━═╝*`, m);
            } else {
                await conn.reply(m.chat, `*╔═━━••【📮】••━━═╗*\n*✦ إجابة خاطئة 😢*\n*✦ انتهت محاولاتك*\n*✦ الإجابة الصحيحة: ${obito.correctAnswer}*\n*╚═━━••【📮】••━━═╝*`, m);
                clearTimeout(obito.timer);
                delete conn.obito[id];
            }
        }
    } else {
        try {
            conn.obito = conn.obito || {};
            let id = m.chat;

            if (conn.obito[id]) {
                return conn.reply(m.chat, '*╔═━━••【📮】••━━═╗*\n*✦ لا يمكنك بدء لعبة جديدة، يوجد لعبة سابقة لم تنتهي ❌*_\n*╚═━━••【📮】••━━═╝*', m);
            }

            const response = await fetch('https://gist.githubusercontent.com/Kyutaka101/98d564d49cbf9b539fee19f744de7b26/raw/f2a3e68bbcdd2b06f9dbd5f30d70b9fda42fec14/guessflag');
            const obitoData = await response.json();

            const obitoItem = obitoData[Math.floor(Math.random() * obitoData.length)];
            const { img, name } = obitoItem;

            let options = [name];
            while (options.length < 4) {
                let randomItem = obitoData[Math.floor(Math.random() * obitoData.length)].name;
                if (!options.includes(randomItem)) options.push(randomItem);
            }
            options.sort(() => Math.random() - 0.5);

            const media = await prepareWAMessageMedia({ image: { url: img } }, { upload: conn.waUploadToServer });

            const interactiveMessage = {
                body: {
                    text: `*╔═━━••【📮】••━━═╗*\n*✦ لعبة تعرف على شخصية الأنمي من صورته 🧬*_\n*✦ الوقت: 60 ثانية*\n*✦ الجائزة: 500xp*\n*╚═━━••【📮】••━━═╝*`,
                },
                footer: { text: 'BY : KEB' },
                header: {
                    title: 'ㅤ',
                    subtitle: 'اختر اسم الشخصية من الخيارات ⇊',
                    hasMediaAttachment: true,
                    imageMessage: media.imageMessage,
                },
                nativeFlowMessage: {
                    buttons: options.map((option, index) => ({
                        name: 'quick_reply',
                        buttonParamsJson: JSON.stringify({
                            display_text: `┊${index + 1}┊⇇『${option}』`,
                            id: `.جوابي_${index + 1}`
                        })
                    })),
                },
            };

            let msg = generateWAMessageFromContent(m.chat, {
                viewOnceMessage: { message: { interactiveMessage } },
            }, { userJid: conn.user.jid, quoted: m });

            conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

            conn.obito[id] = {
                correctAnswer: name,
                options: options,
                timer: setTimeout(async () => {
                    if (conn.obito[id]) {
                        await conn.reply(m.chat, `*╔═━━••【📮】••━━═╗*\n*✦ انتهى الوقت*\n*✦ الإجابة الصحيحة: ${name}*\n*╚═━━••【📮】••━━═╝*`, m);
                        delete conn.obito[id];
                    }
                }, timeout),
                attempts: 2
            };

        } catch (e) {
            console.error(e);
            conn.reply(m.chat, '*╔═━━••【📮】••━━═╗*\n*✦ حدث خطأ في إرسال الرسالة*\n*╚═━━••【📮】••━━═╝*', m);
        }
    }
};

handler.help = ['ao'];
handler.tags = ['ao'];
handler.command = /^(احزر|احذر|جوابي_\d+)$/i;

export default handler;