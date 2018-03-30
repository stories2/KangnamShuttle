function PrintLogMessage(className, methodName, message, logLevel) {
    logDateTime = new Date().toISOString()

    logMsg = "" + logDateTime + " "

    if(logLevel == LOG_LEVEL_VERBOSE) {
        logMsg = logMsg + "V: "
        logMsg = logMsg + "[" + className + "] {" + methodName + "} (" + message + ")"
        console.log(logMsg)
    }
    else if(logLevel == LOG_LEVEL_INFO) {
        logMsg = logMsg + "I: "
        logMsg = logMsg + "[" + className + "] {" + methodName + "} (" + message + ")"
        console.log(logMsg)
    }
    else if(logLevel == LOG_LEVEL_DEBUG) {
        logMsg = logMsg + "D: "
        logMsg = logMsg + "[" + className + "] {" + methodName + "} (" + message + ")"
        console.log(logMsg)
    }
    else if(logLevel == LOG_LEVEL_WARN) {
        logMsg = logMsg + "W: "
        logMsg = logMsg + "[" + className + "] {" + methodName + "} (" + message + ")"
        console.log(logMsg)
    }
    else if(logLevel == LOG_LEVEL_ERROR) {
        logMsg = logMsg + "E: "
        logMsg = logMsg + "[" + className + "] {" + methodName + "} (" + message + ")"
        console.log(logMsg)
    }
    else {
        logMsg = logMsg + "W: "
        logMsg = logMsg + "[" + className + "] {" + methodName + "} (" + message + ")"
        console.log(logMsg)
    }
    return;
}