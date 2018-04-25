exports.PreventColdStart2 = function () {
    global.logManager.PrintLogMessage("PerformanceManager", "PreventColdStart2", "set still warm", global.defineManager.LOG_LEVEL_DEBUG)
    setTimeout(global.performanceManager.Tick2, 1000)
}

exports.Tick2 = function () {
    global.logManager.PrintLogMessage("PerformanceManager", "Tick2", "i am still warm", global.defineManager.LOG_LEVEL_DEBUG)
    setTimeout(global.performanceManager.Tock2, 15000)
}

exports.Tock2 = function () {
    global.logManager.PrintLogMessage("PerformanceManager", "Tock2", "i am still warm", global.defineManager.LOG_LEVEL_DEBUG)
    setTimeout(global.performanceManager.Tick2, 15000)
}