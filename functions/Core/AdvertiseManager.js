exports.GetTimeAdvertise = function (database, baseStr) {
    responseMessage = {}
    responseMessage["text"] = baseStr

    var currentDate = new Date();
    // var hour = (currentDate.getHours() + global.defineManager.GMT_KOREA_TIME) % global.defineManager.DAY_TO_HOUR
    currentTimezoneDate = new Date(currentDate.valueOf() + global.defineManager.GMT_KOREA_TIME_MIN * global.defineManager.HOUR_TO_MILE)
    currentHour = currentTimezoneDate.getHours()
    global.logManager.PrintLogMessage("AdvertiseManager", "GetTimeAdvertise",
        "current timezone time: " + currentTimezoneDate + " current hour: " + currentHour, global.defineManager.LOG_LEVEL_INFO)

    advertiseHourInfo = database[currentHour]
    advertiseDeadline = new Date(advertiseHourInfo["deadline"])
    advertiseStartDate = new Date(advertiseHourInfo["startDate"])
    dayOfWeek = advertiseHourInfo["dayOfWeek"]
    currentDay = currentTimezoneDate.getDay()

    if(currentTimezoneDate - advertiseStartDate >= global.defineManager.ZERO &&
        currentTimezoneDate - advertiseDeadline < global.defineManager.ZERO) {
        if(advertiseHourInfo["enable"] == global.defineManager.ENABLE &&
            dayOfWeek[currentDay] == global.defineManager.ENABLE) {
            global.logManager.PrintLogMessage("AdvertiseManager", "GetTimeAdvertise",
                "This advertisement still on going photo: " + advertiseHourInfo["photoEnable"] +
                " btn: " + advertiseHourInfo["messageButtonEnable"], global.defineManager.LOG_LEVEL_INFO)
            responseMessage["text"] = baseStr + "\n\n" + advertiseHourInfo["text"]
            if(advertiseHourInfo["photoEnable"] == global.defineManager.ENABLE) {
                responseMessage["photo"] = advertiseHourInfo["photo"]
            }
            if(advertiseHourInfo["messageButtonEnable"] == global.defineManager.ENABLE) {
                responseMessage["message_button"] = advertiseHourInfo["message_button"]
            }
        }
        else {
            global.logManager.PrintLogMessage("AdvertiseManager", "GetTimeAdvertise",
                "This advertisement was disabled", global.defineManager.LOG_LEVEL_WARN)
        }
    }
    else {
        global.logManager.PrintLogMessage("AdvertiseManager", "GetTimeAdvertise",
            "This advertisement closed", global.defineManager.LOG_LEVEL_WARN)
    }
    return responseMessage
}