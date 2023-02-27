const TelegramBotApi = require('node-telegram-bot-api');

const token = '5901446822:AAGdSra99pFySX50HoWDAfBCsfNf-89_pbo';
const { gameOptions, againOptions } = require('./options');

const bot = new TelegramBotApi(token, { polling: true });

const chats = {};

const startGame = async chatId => {
    await bot.sendMessage(chatId, `Сейчас я загадаю цифру от 0 до 9, а ты должен ее угадать!`);
    chats[chatId] = Math.floor(Math.random() * 10);
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions);
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветствие'},
        {command: '/info', description: 'Получить информацию о пользователе'},
        {command: '/game', description: 'Игра угадай число'},
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        if (text === '/start') {
            await bot.sendAnimation(chatId, 'https://media.tenor.com/8iMyvddJvmIAAAAd/gachimuchi-steve-rambo.gif');
            await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/1b5/0ab/1b50abf8-8451-40ca-be37-ffd7aa74ec4d/1.webp');
            return bot.sendMessage(chatId, 'Добро пожаловать в телеграм бот BuritoBotCourse')
        }

        if (text === '/info') {
            const { first_name, last_name } = msg.from;
            return bot.sendMessage(chatId, `Тебя зовут ${first_name} ${last_name}`)
        }

        if (text === '/game') {
           return startGame(chatId);
        }

        return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй еще раз');
    });

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;

        if (data === '/again') {
            return startGame(chatId);
        }

        const gameMessage = +data === chats[chatId]
            ? `Поздравляю, ты угадал цифру ${data}`
            : `К сожалению ты не угадал, бот загадал цифру ${chats[chatId]}`;

        return bot.sendMessage(chatId, gameMessage, againOptions);
    })
};

start();
