import { WAMessageStubType } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return true;

  // الرقم الصحيح للشخص
  const userJid = m.messageStubParameters?.[0] || m.participant;
  if (!userJid) return;

  const numeroUsuario = userJid.split('@')[0];

  const fkontak = {
    key: {
      participants: "0@s.whatsapp.net",
      remoteJid: "status@broadcast",
      fromMe: false,
      id: "Halo"
    },
    message: {
      contactMessage: {
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:مستخدم\nEND:VCARD`
      }
    },
    participant: "0@s.whatsapp.net"
  };

  let pp;
  try {
    pp = await conn.profilePictureUrl(userJid, 'image');
  } catch {
    pp = 'https://files.catbox.moe/04u4qi.jpg';
  }

  let img;
  try {
    img = await (await fetch(pp)).buffer();
  } catch {
    img = null;
  }

  const chat = global.db.data.chats[m.chat];
  const txt = `⬣━『 دخـــــــول مشترك 』━⬣`;
  const txt1 = `⬣━『 خــروج مـشــتـرك 』━⬣`;

  let redes = 'https://github.com/Yuji-XDev';
  let groupSize = participants.length;
  if (m.messageStubType == WAMessageStubType.GROUP_PARTICIPANT_ADD) groupSize++;
  else if (
    m.messageStubType == WAMessageStubType.GROUP_PARTICIPANT_REMOVE ||
    m.messageStubType == WAMessageStubType.GROUP_PARTICIPANT_LEAVE
  ) groupSize--;

  // ترحيب
  if (chat?.welcome && m.messageStubType == 27) {
    let bienvenida = `
*~⌝˼※⪤˹͟͞≽━┈⌯⧽°⸂◞🧬◜⸃°⧼⌯┈━≼˹͟͞⪤※˹⌞~*

> *「⸂♤┊⪼• ◈˼✦ رســـالــة تـــرحــيــب ◈」*

*⌗╎يـــا أهـــلا وســـهلا بڪ فـي نـقـابـتـنـا ♥╎⌗*

*⌗╎يـشــرفــنـا إنـضـمـامڪ ضمـــن عائلـــتـنـا╎⌗*

*⌗╎نـتـمـنـى مـشـاركـتـڪ و تـفـاعـلـڪ╎⌗*

*~⌝˼※⪤˹͟͞≽━┈⌯⧽°⸂◞🧬◜⸃°⧼⌯┈━≼˹͟͞⪤※˹⌞~*

> *⊢❉ الـمـنـشـن ╎❯ 〖@${numeroUsuario}〗*

> *⊢❉ إســم الــجــروب ╎❯ 〖${groupMetadata.subject}〗*
*~⌝˼※⪤˹͟͞≽━┈⌯⧽°⸂◞🧬◜⸃°⧼⌯┈━≼˹͟͞⪤※˹⌞~*`;

    await conn.sendMini(m.chat, txt, '𝑲𝑬𝑵_𝑩𝑶𝑻', bienvenida, img, img, redes, fkontak);
  }

  // وداع
  if (chat?.welcome && (m.messageStubType == 28 || m.messageStubType == 32)) {
    let bye = `
*~⌝˼※⪤˹͟͞≽━┈⌯⧽°⸂◞🧬◜⸃°⧼⌯┈━≼˹͟͞⪤※˹⌞~*

> *「⸂♤┊⪼• ◈˼✦ رســـالــة مـغــادرة ◈」*

> *⊢❉ الـمـنـشـن ╎❯ 〖@${numeroUsuario}〗*

> *⊢❉ نتــمـنـى إنڪ قـضـيـت وقـت جـمـيـل مـعـنـا ♥*

*~⌝˼※⪤˹͟͞≽━┈⌯⧽°⸂◞🧬◜⸃°⧼⌯┈━≼˹͟͞⪤※˹⌞~*`;

    await conn.sendMini(m.chat, txt1, '𝑲𝑬𝑵_𝑩𝑶𝑻', bye, img, img, redes, fkontak);
  }
}