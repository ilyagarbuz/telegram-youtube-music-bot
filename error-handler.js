const handleError = async(bot, chatId, err) => {
    if(!err.errMsg) err.errMsg = '❌ Произошла ошибка'
    console.log(err);
    await bot.sendMessage(chatId, err.errMsg);
}

module.exports = {handleError}