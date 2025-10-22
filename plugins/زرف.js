const { makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('auth');
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        auth: state,
        version,
        printQRInTerminal: true
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async ({ messages, type }) => {
        const msg = messages[0];
        if (!msg.message || !msg.key.remoteJid.endsWith('@g.us')) return; // فقط القروبات
        const from = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;

        const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
        if (!text) return;

        if (text === '!زرف') {
            try {
                const metadata = await sock.groupMetadata(from);
                const participants = metadata.participants;

                const senderData = participants.find(p => p.id === sender);
                if (!senderData?.admin) {
                    await sock.sendMessage(from, { text: '❌ فقط المشرفين يمكنهم استخدام هذا الأمر.' });
                    return;
                }

                await sock.sendMessage(from, { text: '🚨 جاري تصفية المجموعة...' });

                for (let participant of participants) {
                    const isAdmin = participant.admin === 'admin' || participant.admin === 'superadmin';
                    const isSelf = participant.id === sock.user.id;

                    if (!isAdmin && !isSelf) {
                        try {
                            await sock.groupParticipantsUpdate(from, [participant.id], 'remove');
                            console.log(`✅ تم طرد: ${participant.id}`);
                        } catch (err) {
                            console.log(`❌ فشل في طرد: ${participant.id}`, err);
                        }
                    }
                }

                await sock.sendMessage(from, { text: '✅ تم طرد جميع الأعضاء (عدا المشرفين).' });
            } catch (err) {
                console.error('حدث خطأ أثناء تنفيذ الأمر:', err);
                await sock.sendMessage(from, { text: '❌ حدث خطأ أثناء تنفيذ الأمر.' });
            }
        }
    });

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
            if (reason === DisconnectReason.loggedOut) {
                console.log('❌ تم تسجيل الخروج من واتساب');
            } else {
                console.log('🔄 إعادة الاتصال...');
                startBot();
            }
        } else if (connection === 'open') {
            console.log('✅ تم الاتصال بواتساب');
        }
    });
}

startBot();