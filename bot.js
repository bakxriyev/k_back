import TelegramBot from 'node-telegram-bot-api';
import axios from 'axios';
import ExcelJS from 'exceljs';
import fs from 'fs';
import path from 'path';
import * as dotenv from 'dotenv';
dotenv.config();

dotenv.config();

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

const ADMIN_LOGIN = process.env.ADMIN_LOGIN || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '12345';
const BACKEND_URL = process.env.BACKEND_URL || 'https://backend.khanov.uz/userss';

const sessions = {}; // login sessiyalari

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  sessions[chatId] = { step: 'login' };
  bot.sendMessage(chatId, '👋 Salom! Loginni kiriting:');
});

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text?.trim();
  if (!sessions[chatId]) return;

  const step = sessions[chatId].step;

  if (step === 'login') {
    sessions[chatId].login = text;
    sessions[chatId].step = 'password';
    return bot.sendMessage(chatId, '🔑 Parolni kiriting:');
  }

  if (step === 'password') {
    const { login } = sessions[chatId];
    if (login === ADMIN_LOGIN && text === ADMIN_PASSWORD) {
      sessions[chatId].isAuthenticated = true;
      sessions[chatId].step = 'menu';
      return showMenu(chatId);
    } else {
      sessions[chatId] = { step: 'login' };
      return bot.sendMessage(chatId, '❌ Login yoki parol xato, qayta urinib ko‘ring.');
    }
  }

  if (!sessions[chatId].isAuthenticated) return;
  if (text === '🧾 Barcha leadlar') return sendAllLeads(chatId);
  if (text === '📅 Kunlar bo‘yicha hisob') return sendDailyStats(chatId);
  if (text === '📊 Excel faylni yuklab olish') return sendExcel(chatId);
  if (text === '🚪 Chiqish') {
    delete sessions[chatId];
    return bot.sendMessage(chatId, '✅ Sessiya tugatildi. /start orqali qayta kirish mumkin.');
  }
});

async function showMenu(chatId) {
  await bot.sendMessage(chatId, '✅ Tizimga kirdingiz. Bo‘limni tanlang:', {
    reply_markup: {
      keyboard: [
        ['🧾 Barcha leadlar'],
        ['📅 Kunlar bo‘yicha hisob'],
        ['📊 Excel faylni yuklab olish'],
        ['🚪 Chiqish'],
      ],
      resize_keyboard: true,
    },
  });
}

async function sendAllLeads(chatId) {
  try {
    const { data } = await axios.get(BACKEND_URL);
    if (!data.length) return bot.sendMessage(chatId, '⚠️ Hozircha lead yo‘q.');
    const text = data
      .map(
        (u, i) =>
          `${i + 1}. 👤 ${u.full_name}\n📞 ${u.phone_number || '-'}\n📋 ${u.type || '-'}\n📍 ${u.address || '-'}`
      )
      .join('\n\n');
    await bot.sendMessage(chatId, `<b>Barcha leadlar:</b>\n\n${text}`, { parse_mode: 'HTML' });
  } catch (e) {
    bot.sendMessage(chatId, '❌ Maʼlumot olishda xato.');
  }
}

async function sendDailyStats(chatId) {
  try {
    const { data } = await axios.get(BACKEND_URL);
    if (!data.length) return bot.sendMessage(chatId, '⚠️ Leadlar yo‘q.');
    const stats = {};
    data.forEach((u) => {
      const day = new Date(u.createdAt).toLocaleDateString('uz-UZ');
      stats[day] = (stats[day] || 0) + 1;
    });
    const txt = Object.entries(stats)
      .map(([day, count]) => `📅 ${day} — ${count} ta`)
      .join('\n');
    await bot.sendMessage(chatId, `<b>Kunlar bo‘yicha leadlar:</b>\n\n${txt}`, { parse_mode: 'HTML' });
  } catch {
    bot.sendMessage(chatId, '❌ Statistikani olishda xato.');
  }
}

async function sendExcel(chatId) {
  try {
    const { data } = await axios.get(BACKEND_URL);
    if (!data.length) return bot.sendMessage(chatId, '⚠️ Maʼlumot yo‘q.');

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Leads');
    sheet.columns = [
      { header: 'ID', key: 'id', width: 8 },
      { header: 'Ism', key: 'full_name', width: 20 },
      { header: 'Telefon', key: 'phone_number', width: 20 },
      { header: 'Tur', key: 'type', width: 15 },
      { header: 'Manzil', key: 'address', width: 25 },
      { header: 'Sana', key: 'createdAt', width: 20 },
    ];
    data.forEach((u) => sheet.addRow(u));

    const file = path.resolve(`leads_${Date.now()}.xlsx`);
    await workbook.xlsx.writeFile(file);
    await bot.sendDocument(chatId, file);
    fs.unlinkSync(file);
  } catch {
    bot.sendMessage(chatId, '❌ Excel yaratishda xato.');
  }
}
