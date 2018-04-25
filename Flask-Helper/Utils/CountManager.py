from Settings import DefineManager
from Utils import LogManager, ConvertManager

def GetUpTime():
    if DefineManager.RUNNING_TIME == None:
        LogManager.PrintLogMessage("CountManager", "GetUpTime", "process not running", DefineManager.LOG_LEVEL_WARN)
        return [0, 0, 0, 0]
    else:
        runningTime = ConvertManager.SecondsToDateTime(DefineManager.RUNNING_TIME.seconds)
        days = runningTime["days"]
        hours = runningTime["hours"]
        mins = runningTime["mins"]
        sec = runningTime["sec"]

        LogManager.PrintLogMessage("CountManager", "GetUpTime",
                                   "process run time: " + str(days) + " " + str(hours) + ":" + str(mins) + ":" + str(sec),
                                   DefineManager.LOG_LEVEL_WARN)

        return [days, hours, mins, sec]
