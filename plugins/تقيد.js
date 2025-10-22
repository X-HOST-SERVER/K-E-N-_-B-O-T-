let handler = async (m, { conn, usedPrefix, command, args, isROwner }) => {
    let isEnable = /true|enable|(turn)?on|1|فك/i.test(command)
    let setting = global.db.data
    let cmd = (args[0] || '').toLowerCase()

    if (!cmd) {
        return conn.reply(m.chat, `❌ *أدخل اسم الأمر الذي تريد ${isEnable ? 'فك تقييده' : 'تقييده'}!*\n\n📌 مثال:\n${usedPrefix + command} games`, m)
    }

    setting.blockedCommands = setting.blockedCommands || []

    // تحقق من صلاحيات المالك الرئيسي
    if (!isROwner) throw '❌ هذا الأمر خاص بالمطور فقط.'

    if (isEnable) {
        let index = setting.blockedCommands.indexOf(cmd)
        if (index === -1) throw `❌ الأمر *${cmd}* غير مقيد.`
        setting.blockedCommands.splice(index, 1)
    } else {
        if (setting.blockedCommands.includes(cmd)) {
            throw `❌ الأمر *${cmd}* مقيد بالفعل.`
        }
        setting.blockedCommands.push(cmd)
    }

    await conn.sendMessage(m.chat, {
        text: `✅ *تم ${isEnable ? 'فك تقييد' : 'تقييد'} الأمر:* ${cmd}`,
        footer: '⚙️ إدارة أوامر البوت',
        buttons: [
            {
                buttonId: `${isEnable ? '.تقيد' : '.تقيدفك'} ${cmd}`,
                buttonText: { displayText: isEnable ? '🔒 تقييد' : '✅ فك التقييد' }
            },
            {
                buttonId: '.menu',
                buttonText: { displayText: '📜 القائمة' }
            }
        ],
        viewOnce: true,
        headerType: 1
    }, { quoted: m })
}

handler.help = ['تقيد <أمر>', 'تقيدفك <أمر>']
handler.tags = ['المالك']
handler.command = /^تقيدفك|تقيد$/i
handler.rowner = true

export default handler