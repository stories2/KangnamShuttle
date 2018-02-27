exports.PrintLogMessage = function (moduleName, methodName, message, logLevel) {
    logDateTime = this.GetCurrentTime()

    logMsg = "" + logDateTime + " "

    if(logLevel == global.defineManager.LOG_LEVEL_VERBOSE) {
        logMsg = logMsg + "V: "
        logMsg = logMsg + "[" + moduleName + "] {" + methodName + "} (" + message + ")"
        console.log(logMsg)
    }
    else if(logLevel == global.defineManager.LOG_LEVEL_INFO) {
        logMsg = logMsg + "I: "
        logMsg = logMsg + "[" + moduleName + "] {" + methodName + "} (" + message + ")"
        console.log(logMsg)
    }
    else if(logLevel == global.defineManager.LOG_LEVEL_DEBUG) {
        logMsg = logMsg + "D: "
        logMsg = logMsg + "[" + moduleName + "] {" + methodName + "} (" + message + ")"
        console.log(logMsg)
    }
    else if(logLevel == global.defineManager.LOG_LEVEL_WARN) {
        logMsg = logMsg + "W: "
        logMsg = logMsg + "[" + moduleName + "] {" + methodName + "} (" + message + ")"
        console.log(logMsg)
    }
    else if(logLevel == global.defineManager.LOG_LEVEL_ERROR) {
        logMsg = logMsg + "E: "
        logMsg = logMsg + "[" + moduleName + "] {" + methodName + "} (" + message + ")"
        console.log(logMsg)
    }
    else {
        logMsg = logMsg + "W: "
        logMsg = logMsg + "[" + moduleName + "] {" + methodName + "} (" + message + ")"
        console.log(logMsg)
    }
    return;
}

exports.GetCurrentTime = function () {
    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;
}