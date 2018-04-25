exports.PreventColdStart3 = function () {
    global.logManager.PrintLogMessage("PerformanceManager", "PreventColdStart3", "set still warm", global.defineManager.LOG_LEVEL_DEBUG)
    setTimeout(global.performanceManager.Tick3, 1000)
}

exports.Tick3 = function () {
    global.logManager.PrintLogMessage("PerformanceManager", "Tick3", "i am still warm", global.defineManager.LOG_LEVEL_DEBUG)
    setTimeout(global.performanceManager.Tock3, 15000)
}

exports.Tock3 = function () {
    global.logManager.PrintLogMessage("PerformanceManager", "Tock3", "i am still warm", global.defineManager.LOG_LEVEL_DEBUG)
    setTimeout(global.performanceManager.Tick3, 15000)
}