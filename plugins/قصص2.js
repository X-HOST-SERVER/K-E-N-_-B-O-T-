import fetch from 'node-fetch';

let handler = async (m, { conn }) => {
    try {
        const response = await fetch('https://kalemtayeb.com/safahat/sub/916');
        const html = await response.text();
        
        // حفظ HTML إلى ملف للفحص (للتdebug)
        const fs = require('fs');
        fs.writeFileSync('./debug_html.html', html);
        
        // البحث عن أي نص عربي
        const arabicText = html.match(/[\u0600-\u06FF\s\.\,\:\;\(\)]{10,200}/g);
        
        let message = '🔍 *نتيجة فحص الموقع:*\n\n';
        
        if (arabicText) {
            message += `📊 وجدت ${arabicText.length} نص عربي\n\n`;
            message += '📝 **العناوين المحتملة:**\n';
            arabicText.slice(0, 5).forEach((text, i) => {
                message += `${i+1}. ${text.trim().substring(0, 50)}...\n`;
            });
        } else {
            message += '❌ لم أعثر على أي نص عربي في الصفحة';
        }
        
        message += `\n📁 تم حفظ HTML في ملف debug_html.html للفحص`;
        
        m.reply(message);
        
    } catch (error) {
        m.reply(`❌ خطأ في الفحص: ${error.message}`);
    }
};

handler.command = ['فحص'];
handler.tags = ['tools'];
export default handler;