const fs = require("fs");
const path = require("path");
const ytdl = require("ytdl-core");
const { v4: uuidv4 } = require('uuid');

async function downloadAndSendAudio(bot, chatId, youtubeUrl, chatProcessing) {
    const msgWait = await bot.sendMessage(chatId, "⬇️ Загружаем аудио...");

    const videoInfo = await ytdl.getInfo(youtubeUrl);
    const fileTitle = videoInfo.videoDetails.title;

    const fileName = `${fileTitle}-${uuidv4()}.mp3`;
    const filePath = path.join(__dirname, 'audio', fileName);

    const downloadAudio = ytdl(youtubeUrl, { filter: 'audioonly' });
    downloadAudio.pipe(fs.createWriteStream(filePath, 'binary'));

    downloadAudio.on('end', async () => {
        // Обработка успешного завершения загрузки
        await sendAudio(bot, chatId, filePath, fileTitle, msgWait);
        chatProcessing[chatId] = false;
    });

    downloadAudio.on('error', (err) => {
        err.errMsg = '❌ Произошла ошибка при скачивании аудио.'
        throw err;
    });
}

async function sendAudio(bot, chatId, filePath, fileTitle, msgWait) {
    const stats = await fs.promises.stat(filePath);
    const fileSizeInBytes = stats.size;
    const fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);

    if (fileSizeInMegabytes > 50) {
        fs.unlink(filePath, (err) => {
            if (err) console.log(err);
        });
        const err = new Error()
        err.errMsg = '❌ Не удалось отправить аудио. Файл слишком большой.'
        throw err;
    } else {
        await bot.editMessageText('⬆️ Отправляем...', {
            chat_id: chatId,
            message_id: msgWait.message_id
        });

        await bot.sendAudio(chatId, filePath, {}, { filename: fileTitle, contentType: 'audio/mpeg' });
        fs.unlink(filePath, (err) => {
            if (err) console.log(err);
        });
        await bot.deleteMessage(chatId, msgWait.message_id);
    }
}

module.exports = {
    downloadAndSendAudio,
};
