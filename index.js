const { config } = require('dotenv');
const TelegramBot = require('node-telegram-bot-api');
const { initBot } = require('./bot');

config();

const bot = new TelegramBot(process.env.TELEGRAM_API_TOKEN, {
    polling: {
        interval: 300,
        autoStart: true,
    }
});

initBot(bot);
