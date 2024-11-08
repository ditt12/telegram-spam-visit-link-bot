import { Telegraf } from 'telegraf';
import fetch from 'node-fetch';
import fs from 'fs';

const settings = JSON.parse(fs.readFileSync('settings.json', 'utf8'));
const botToken = settings.bot_token;

const bot = new Telegraf(botToken);

// Panduan saat user pertama kali mulai
bot.start(async (ctx) => {
  const botName = ctx.botInfo.first_name; // Nama bot
  return ctx.reply(
    `Halo! Selamat datang di bot ${botName}. Berikut adalah cara menggunakan bot ini:\n\n` +
    '/spam link.com - Untuk mengunjungi URL yang diberikan secara terus menerus.\n' +
    'Gunakan /spam atau !spam diikuti dengan URL yang ingin dikunjungi.\n\n' +
    'Contoh: /spam https://example.com'
  );
});

// Command untuk spam URL
bot.command(['spam', '!spam'], async (ctx) => {
  const args = ctx.message.text.split(' ');
  if (args.length < 2) {
    return ctx.reply('Tolong masukkan URL setelah perintah. Contoh: /spam link.com atau !spam link.com');
  }

  const url = args[1];

  await ctx.reply(`Mulai mengunjungi ${url} secara terus menerus...`);

  let count = 0;

  while (true) {
    try {
      await fetch(url);

      count++;

      if (count % 10 === 0) {
        await ctx.reply(`Telah mengunjungi ${url} sebanyak ${count} kali.`);
      }
    } catch (error) {
      console.log(`Error saat visit ke ${url}:`, error);
      await ctx.reply(`Gagal mengunjungi ${url}.`);
      break; 
    }
  }
});

bot.launch();
