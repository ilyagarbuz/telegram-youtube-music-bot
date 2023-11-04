const { isYouTubeVideoLink } = require('./helpers/validation');
const { getStartMsg, getHelpMsg } = require('./messages/messages');
const { downloadAndSendAudio } = require('./audioProcessor');
const {handleError} = require('./error-handler')

const chatProcessing = {};

function initBot(bot) {
    bot.on('polling_error', err => console.log('Polling error: ', err.data.error.message));

    bot.on('text', async msg => {
        const chatId = msg.chat.id;
        const msgText = msg.text;
        try {
            if (chatProcessing[chatId]) {
                const err = new Error()
                err.errMsg = '⚠️ Пожалуйста, подождите, пока текущий запрос завершится.'
                await bot.deleteMessage(chatId, msg.message_id)
                await handleError(bot, chatId, err)
                return
            }

            chatProcessing[chatId] = true;

            if (msgText === '/start') {
                await bot.sendMessage(chatId, getStartMsg(msg.from.first_name, msg.from.username), {
                    parse_mode: "HTML",
                    disable_web_page_preview: true,
                });
                chatProcessing[chatId] = false;
                return;
            }

            if (msgText === '/help') {
                await bot.sendMessage(chatId, getHelpMsg(), {
                    parse_mode: "HTML",
                    disable_web_page_preview: true,
                });
                chatProcessing[chatId] = false;
                return;
            }

            if (!isYouTubeVideoLink(msgText)) {
                const err = new Error()
                err.errMsg = '❌ Похоже, что вы отправили не корректную ссылку на видео'
                throw err
            }

            await downloadAndSendAudio(bot, chatId, msgText, chatProcessing);

        } catch (err) {
            chatProcessing[chatId] = false
            await handleError(bot, chatId, err)
        }
    });
}

module.exports = {
    initBot,
};
