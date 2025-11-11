import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class TelegramService {
  private readonly botToken = process.env.TELEGRAM_BOT_TOKEN;
  private readonly chatId = process.env.TELEGRAM_CHAT_ID;
  private readonly logger = new Logger(TelegramService.name);

  async sendUserCreatedNotification(user: {
    full_name: string;
    phone_number?: string;
    type?: string;
    address?: string;
  }) {
    try {
      const text = `
🆕 <b>Yangi foydalanuvchi qo‘shildi!</b>

👤 <b>Ism:</b> ${user.full_name || 'Nomaʼlum'}
📞 <b>Telefon:</b> ${user.phone_number || 'Kiritilmagan'}
📋 <b>Tur:</b> ${user.type || 'Nomaʼlum'}
📍 <b>Manzil:</b> ${user.address || 'Kiritilmagan'}
📅 <b>Sana:</b> ${new Date().toLocaleString('uz-UZ')}
`;

      const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
      await axios.post(url, { chat_id: this.chatId, text, parse_mode: 'HTML' });
      this.logger.log(`✅ Telegram kanalga foydalanuvchi yuborildi: ${user.full_name}`);
    } catch (error) {
      this.logger.error('❌ Telegramga yuborishda xato', error?.response?.data || error.message);
    }
  }
}
