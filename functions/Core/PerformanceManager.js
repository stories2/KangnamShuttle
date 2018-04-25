exports.PreventColdStart = function () {
    global.logManager.PrintLogMessage("PerformanceManager", "PreventColdStart", "set still warm", global.defineManager.LOG_LEVEL_DEBUG)
    setInterval(this.TickTock, 60000)
    while(true){

    }
}

exports.TickTock = function () {
    global.logManager.PrintLogMessage("PerformanceManager", "TickTock", "i am still warm", global.defineManager.LOG_LEVEL_DEBUG)
}