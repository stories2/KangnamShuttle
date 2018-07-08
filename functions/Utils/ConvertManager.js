exports.ConvertOrderToNumber = function (order) {
    convertedID = global.defineManager.ORDER_TO_ID[order]
    if(typeof convertedID == 'undefined') {
        convertedID = global.defineManager.NOT_AVAILABLE
    }
    global.logManager.PrintLogMessage("ConvertManager", "ConvertOrderToNumber", "input order: " + order + " converted: " + convertedID,
        global.defineManager.LOG_LEVEL_INFO)
    return convertedID
}

exports.ConvertKelvinToCelsius = function (kelvin) {
    return kelvin - 273.15
}

exports.ConvertCurrentDayOfWeekStartAtOne = function () {
    var currentDate = new Date();
    currentTimezoneDate = new Date(currentDate.valueOf() + global.defineManager.GMT_KOREA_TIME_MIN * global.defineManager.HOUR_TO_MILE)
    if(currentTimezoneDate.getDay() == global.defineManager.DATE_TIME_SATURDAY) {
        global.logManager.PrintLogMessage("ConvertManager", "ConvertCurrentDayOfWeekStartAtOne", "converted to sat", global.defineManager.LOG_LEVEL_INFO)
        return global.defineManager.SUBWAY_SATURDAY_OF_WEEK
    }
    else if(currentTimezoneDate.getDay() == global.defineManager.DATE_TIME_SUNDAY) {
        global.logManager.PrintLogMessage("ConvertManager", "ConvertCurrentDayOfWeekStartAtOne", "converted to sun", global.defineManager.LOG_LEVEL_INFO)
        return global.defineManager.SUBWAY_SUNDAY_OF_WEEK
    }
    else {
        global.logManager.PrintLogMessage("ConvertManager", "ConvertCurrentDayOfWeekStartAtOne", "converted to normal", global.defineManager.LOG_LEVEL_INFO)
        return global.defineManager.SUBWAY_NORMAL_DAY_OF_WEEK
    }
}

exports.ConvertDateTimeToStr = function () {
    date = new Date()
    var currentDate = date
    date = new Date(currentDate.valueOf() + global.defineManager.GMT_KOREA_TIME_MIN * global.defineManager.HOUR_TO_MILE)
    dateStr = date.toISOString()
    return dateStr
}