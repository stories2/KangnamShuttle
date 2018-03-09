exports.GetTimeAdvertise = function (database) {
    var currentDate = new Date();
    // var hour = (currentDate.getHours() + global.defineManager.GMT_KOREA_TIME) % global.defineManager.DAY_TO_HOUR
    currentTimezoneDate = new Date(currentDate.valueOf() + 540 * 60000)
    global.logManager.PrintLogMessage("AdvertiseManager", "GetTimeAdvertise",
        "current timezone time: " + currentTimezoneDate, global.defineManager.LOG_LEVEL_INFO)
    
}