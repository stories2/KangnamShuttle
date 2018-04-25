from Settings import DefineManager
from Utils import LogManager
import datetime
import requests
import time
import threading

def Runner(delayTime):
    while DefineManager.RUNNING_STATUS:
        response = requests.get('https://us-central1-kangnamshuttle.cloudfunctions.net/kakao/keyboard')
        LogManager.PrintLogMessage("RequestManager", "Runner", "status code: " + str(response.status_code),
                                   DefineManager.LOG_LEVEL_INFO)
        time.sleep(delayTime)

def PreventColdStart(enable):
    if DefineManager.RUNNING_STATUS == enable:
        LogManager.PrintLogMessage("RequestManager", "PreventColdStart", "same status not accepted: " + str(enable),
                                   DefineManager.LOG_LEVEL_WARN)
        return
    if enable == str(1):
        DefineManager.START_RUNNING_TIME = datetime.datetime.now()
        startRunTimeStr = DefineManager.START_RUNNING_TIME.strftime('%Y-%m-%d %H:%M:%S')
        LogManager.PrintLogMessage("RequestManager", "PreventColdStart", "start time: " + startRunTimeStr,
                                   DefineManager.LOG_LEVEL_INFO)
    elif enable == str(0):
        nowDateTime = datetime.datetime.now()
        if DefineManager.START_RUNNING_TIME == None:
            DefineManager.START_RUNNING_TIME = nowDateTime
        stopTimeStr = nowDateTime.strftime('%Y-%m-%d %H:%M:%S')

        LogManager.PrintLogMessage("RequestManager", "PreventColdStart", "process stopped time: " + stopTimeStr,
                                   DefineManager.LOG_LEVEL_INFO)

        if DefineManager.RUNNING_TIME == None:
            DefineManager.RUNNING_TIME = nowDateTime - DefineManager.START_RUNNING_TIME
        else:
            DefineManager.RUNNING_TIME += nowDateTime - DefineManager.START_RUNNING_TIME

        runTimeStr = str(DefineManager.RUNNING_TIME)
        LogManager.PrintLogMessage("RequestManager", "PreventColdStart", "process run time: " + runTimeStr,
                                   DefineManager.LOG_LEVEL_INFO)
    else:
        LogManager.PrintLogMessage("RequestManager", "PreventColdStart", "strange param accepted: " + str(enable) + " type: " + str(type(enable)),
                                   DefineManager.LOG_LEVEL_WARN)
        return

    DefineManager.RUNNING_STATUS = enable
    # Runner(15)
    threadRunner = threading.Thread(target=Runner, args=(DefineManager.REQUEST_THREAD_DELAY_TIME, ))
    threadRunner.start()
    return