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
    var currentDate = new Date();
    // var hour = (currentDate.getHours() + global.defineManager.GMT_KOREA_TIME) % global.defineManager.DAY_TO_HOUR
    currentTimezoneDate = new Date(currentDate.valueOf() + global.defineManager.GMT_KOREA_TIME_MIN * global.defineManager.HOUR_TO_MILE)

    // global.logManager.PrintLogMessage("ContentsManager", "NoticeMonday", "current time: " + currentTimezoneDate,
    //     global.defineManager.LOG_LEVEL_DEBUG)

    todayDay = (currentTimezoneDate.getDay() + 7 - 1) % 7

    totalSec = 518400
    resultStr = ""

    if(todayDay == 0) { // Monday
        resultStr = "월요일이에요! >.<"
    }
    else {
        hour = currentTimezoneDate.getHours()
        min = currentTimezoneDate.getMinutes()
        sec = currentTimezoneDate.getSeconds()

        pastSec = totalSec - ((todayDay - 1) * 24 * 60 * 60 + hour * 60 * 60 + min * 60 + sec)
        leftPercent = Math.floor((totalSec - pastSec) / totalSec * 100)

        resultStr = global.util.format("월요일까지 %s% 남았어요!", leftPercent)
    }

    global.logManager.PrintLogMessage("ContentsManager", "NoticeMonday", "moday calculate result: " + resultStr,
        global.defineManager.LOG_LEVEL_INFO)

    return resultStr
}

exports.WhatShallWeEatToday = function () {
    
}