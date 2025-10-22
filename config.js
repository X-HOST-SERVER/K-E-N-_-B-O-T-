// يجب عليك عدم تعديل اي شئ من بدايه السطر ال13 لعدم تخريب اللبوت #
// 𝑲𝑬𝑵 𝑪𝒐𝒓𝒍𝒆𝒐𝒏𝒆 𝑩𝑶𝑻-𝑴𝑫
import { watchFile, unwatchFile } from 'fs' 
import chalk from 'chalk'
import { fileURLToPath } from 'url'


global.owner = [
  ['201021902759', '𝑲𝑬𝑵', true],
  ['201021902759', '𝑲𝑬𝑵', true],
]


global.mods = []
global.prems = []

global.libreria = 'Baileys'
global.baileys = 'V 6.7.16' 
global.vs = '2.2.0'
global.nameqr = '𝑸𝑹'
global.namebot = '𝑲𝑬𝑵'
global.sessions = 'bodesessions'
global.jadi = 'JadiBots' 
global.yukiJadibts = true

global.packname = '𝑲𝑬𝑵 𝑩𝑶𝑻'
global.namebot = '𝑲𝑬𝑵 𝑩𝑶𝑻'
global.author = '𝑲𝑬𝑵 𝑩𝑶𝑻'
global.moneda = 'Dolar'
global.canalreg = '120363421205065989@newsletter'

global.namecanal = '⌜📮 𝑲𝑬𝑵 𝑩𝑶𝑻 📮|'
global.canal = 'https://whatsapp.com/channel/0029VbB5lRa77qVL1zoGaH2A'
global.idcanal = '120363421205065989@newsletter'

global.ch = {
ch1: '120363421205065989@newsletter',
}

global.multiplier = 69 
global.maxwarn = '2'


let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  import(`${file}?update=${Date.now()}`)
})