exports.RollingDice = function () {
    max = 6
    min = 1
    diceNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    resultStr = global.util.format(global.defineManager.DICE_NUMBER_RESULT_STR, diceNumber)
    global.logManager.PrintLogMessage("ContentsManager", "RollingDice", "the dice result is: " + resultStr,
        global.defineManager.LOG_LEVEL_INFO)
    return resultStr
}

exports.NoticeMonday = function () {
    
}

exports.WhatShallWeEatToday = function () {
    
}