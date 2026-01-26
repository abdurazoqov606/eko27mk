
# -*- coding: utf-8 -*-
"""
EcoQadam 2026 - Telegram Management System
Yaratuvchi: Abdurazoqov Abbos (Tayloq, 27-maktab)
Maqsad: Ekologik ko'ngillilarni birlashtirish va loyihani tarqatish.
"""

import logging
import os
from telethon import TelegramClient, events, Button

# --- SOZLAMALAR ---
# API ma'lumotlarini o'zgartirmang, bular siz bergan ma'lumotlar
API_ID = 26790161
API_HASH = '0da2c93308d6f99444c87ed7af1973fd'
# Bot tokenini @BotFather dan olib, quyidagiga qo'ying:
BOT_TOKEN = 'YOUR_BOT_TOKEN_HERE' 

# Admin ID (Sizning Telegram ID-ingizni bu yerga yozing)
ADMIN_ID = 567891234 

# Clientni ishga tushirish
client = TelegramClient('eco_qadam_session', API_ID, API_HASH).start(bot_token=BOT_TOKEN)

logging.basicConfig(level=logging.INFO)

# --- MATNLAR ---
WELCOME_MSG = (
    "🌿 **EcoQadam 2026 Rasmiy Botiga Xush Kelibsiz!**\n\n"
    "Bu bot orqali siz Tayloq tumani va 27-maktab ekologik tashabbuslarida "
    "faol qatnashishingiz mumkin.\n\n"
    "**Siz nima qila olasiz?**\n"
    "✅ 27-maktab ko'ngillisi bo'lish\n"
    "✅ Hududdagi chiqindilar haqida xabar berish\n"
    "✅ Loyihani do'stlarga ulashib, ball yig'ish\n\n"
    "Keling, tabiatni birga asraymiz! 👇"
)

# --- HANDLERS ---

@client.on(events.NewMessage(pattern='/start'))
async def start_handler(event):
    # Asosiy menyu tugmalari
    buttons = [
        [Button.inline("📋 Ko'ngilli bo'lish", b'register')],
        [Button.inline("📸 Muammo haqida xabar (Rasm+Geo)", b'report')],
        [Button.url("🌐 Loyiha Sayti", 'https://eko27mk.vercel.app/')],
        [Button.inline("📢 Loyihani tarqatish", b'share')],
        [Button.inline("📊 Mening natijam", b'stats')]
    ]
    await event.respond(WELCOME_MSG, buttons=buttons)

@client.on(events.CallbackQuery(data=b'register'))
async def register_callback(event):
    await event.edit(
        "📋 **Ko'ngillilar safiga qo'shilish**\n\n"
        "Siz 27-maktab eko-tizimining faol a'zosiga aylanasiz.\n"
        "Iltimos, pastdagi tugmani bosib telefon raqamingizni tasdiqlang:",
        buttons=[Button.request_phone("📞 Telefonni yuborish", resize=True)]
    )

@client.on(events.NewMessage(func=lambda e: e.contact))
async def contact_handler(event):
    phone = event.contact.phone_number
    # Bu yerda ma'lumotlar bazasiga saqlash mumkin
    await event.respond(
        f"✅ **Tabriklaymiz!**\n\n"
        f"Sizning raqamingiz ({phone}) muvaffaqiyatli ro'yxatdan o'tdi.\n"
        "Tez orada operatorlarimiz siz bilan bog'lanib, navbatdagi daraxt ekish aksiya vaqtini aytishadi.",
        buttons=[Button.inline("📢 Endi loyihani ulashing", b'share')]
    )

@client.on(events.CallbackQuery(data=b'report'))
async def report_callback(event):
    await event.edit(
        "📸 **Ekologik muammo haqida xabar berish**\n\n"
        "Iltimos, ifloslangan hudud yoki kesilgan daraxt rasmini yuboring.\n"
        "So'ngra o'sha joyning **geolokatsiyasini** yuboring.\n\n"
        "Biz bu ma'lumotni tuman ekologiya bo'limiga taqdim etamiz.",
        buttons=[Button.inline("⬅️ Orqaga", b'back')]
    )

@client.on(events.NewMessage(func=lambda e: e.photo))
async def photo_handler(event):
    await event.respond(
        "✅ Rasm qabul qilindi! Endi ushbu joyning **Geolokatsiyasini** yuboring (Location).",
    )

@client.on(events.NewMessage(func=lambda e: e.geo))
async def geo_handler(event):
    await event.respond(
        "🚀 **Hisobot yuborildi!**\n\n"
        "Ma'lumotlar Tayloq tumani ishchi guruhiga yuborildi. Faolligingiz uchun rahmat!"
    )

@client.on(events.CallbackQuery(data=b'share'))
async def share_callback(event):
    # Xavfsiz va professional ulashish tizimi
    share_text = (
        "🌿 Men Tayloq 27-maktabning EcoQadam loyihasiga qo'shildim! "
        "Siz ham biz bilan birga daraxt eking va sovg'alar yuting.\n\n"
        "Batafsil ma'lumot: https://eko27mk.vercel.app/"
    )
    # Telegram share URL
    share_url = f"https://t.me/share/url?url=https://eko27mk.vercel.app/&text={share_text.replace(' ', '%20')}"
    
    await event.edit(
        "📢 **Loyihani qanday tarqatish kerak?**\n\n"
        "1. Pastdagi '🚀 Hozirroq tarqatish' tugmasini bosing.\n"
        "2. Do'stlaringizni yoki guruhlarni tanlang.\n"
        "3. Xabarni yuboring!\n\n"
        "Bu usul orqali siz ko'proq odamni jalb qilasiz va ballar yig'asiz.",
        buttons=[Button.url("🚀 Hozirroq tarqatish", share_url)]
    )

@client.on(events.CallbackQuery(data=b'back'))
async def back_callback(event):
    buttons = [
        [Button.inline("📋 Ko'ngilli bo'lish", b'register')],
        [Button.inline("📸 Muammo haqida xabar", b'report')],
        [Button.url("🌐 Loyiha Sayti", 'https://eko27mk.vercel.app/')],
        [Button.inline("📢 Loyihani tarqatish", b'share')]
    ]
    await event.edit(WELCOME_MSG, buttons=buttons)

# --- ADMIN BROADCAST FUNKSIYASI ---
@client.on(events.NewMessage(pattern='/send_all', from_users=ADMIN_ID))
async def admin_broadcast(event):
    # Faqat admin barcha foydalanuvchilarga xabar yuborishi mumkin
    msg_to_send = event.text.replace('/send_all ', '')
    if not msg_to_send:
        await event.respond("Xabar matnini ham yozing. Masalan: `/send_all Salom hamma ko'ngillilarga!`")
        return
    
    # Eslatma: Bu yerda foydalanuvchilar bazasi bo'lishi kerak. 
    # Hozircha faqat bitta foydalanuvchiga (o'ziga) test uchun yuboradi.
    await event.respond(f"📢 Xabar yuborish boshlandi: {msg_to_send}")

print("EcoQadam 2026 Bot ishga tushdi...")
client.run_until_disconnected()
