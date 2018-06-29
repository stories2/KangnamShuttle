exports.PrintFastestShuttle = function(selection, database) {
    var currentDate = new Date();
    var hour = (currentDate.getHours() + global.defineManager.GMT_KOREA_TIME) % global.defineManager.DAY_TO_HOUR
    var min = currentDate.getMinutes()
    var sec = currentDate.getSeconds()
    var resultText = "If you see this, plz report it. Your selection is: " + selection +
        " current time: " + hour + ":" + min + ":" + sec
    var bakShuttleSec = 0

    currentSec = this.TimeToSec(hour, min, sec)
    gapPastBusTimeSec = 0

    global.logManager.PrintLogMessage("BusTimeManager", "PrintFastestShuttle",
        "current time: " + currentDate + " -> sec: " + currentSec, global.defineManager.LOG_LEVEL_INFO)

    for(indexOfTime in database) {

        indexOfTime = indexOfTime * 1

        shuttleTime = database[indexOfTime].split(":")
        shuttleSec = this.TimeToSec(shuttleTime[0], shuttleTime[1], shuttleTime[2])
        shuttleTime = database[indexOfTime]

        if(indexOfTime == 0) { // 첫차 시간
            if(currentSec < shuttleSec) {
                global.logManager.PrintLogMessage("BusTimeManager", "PrintFastestShuttle",
                    "#" + indexOfTime + " shuttle time: " + shuttleTime + " -> sec: " + shuttleSec, global.defineManager.LOG_LEVEL_INFO)
                resultText = global.util.format(global.defineManager.BUS_FIRST_TIME_STR, shuttleTime, database[indexOfTime + 1])
                break
            }
        }
        else if(indexOfTime == database.length - 1){
            gapPastBusTimeSec =  currentSec - bakShuttleSec
            if(currentSec < shuttleSec) { // 마지막차 시간
                global.logManager.PrintLogMessage("BusTimeManager", "PrintFastestShuttle",
                    "#" + indexOfTime + " shuttle time: " + shuttleTime + " -> sec: " + shuttleSec, global.defineManager.LOG_LEVEL_INFO)
                resultText = global.util.format(global.defineManager.BUS_LAST_TIME_STR, shuttleTime)

                if(gapPastBusTimeSec < 120) {
                    resultText = resultText + global.util.format(global.defineManager.PASSED_BUS, gapPastBusTimeSec)
                }
                break
            }
            else if(currentSec >= shuttleSec) { // 마지막차 놓침
                global.logManager.PrintLogMessage("BusTimeManager", "PrintFastestShuttle",
                    "#" + indexOfTime + " shuttle time: " + shuttleTime + " -> sec: " + shuttleSec, global.defineManager.LOG_LEVEL_INFO)
                resultText = global.util.format(global.defineManager.BUS_END_STR, database[global.defineManager.ZERO])

                if(gapPastBusTimeSec < 120) {
                    resultText = resultText + global.util.format(global.defineManager.PASSED_BUS, gapPastBusTimeSec)
                }
                break
            }
        }
        else {
            gapPastBusTimeSec =  currentSec - bakShuttleSec
            if(bakShuttleSec < currentSec && currentSec < shuttleSec) { // 보통차 시간
                global.logManager.PrintLogMessage("BusTimeManager", "PrintFastestShuttle",
                    "#" + indexOfTime + " shuttle time: " + shuttleTime + " -> sec: " + shuttleSec, global.defineManager.LOG_LEVEL_INFO)
                resultText = global.util.format(global.defineManager.BUS_NORMAL_TIME_STR, shuttleTime, database[indexOfTime + 1])

                if(gapPastBusTimeSec < 120) {
                    resultText = resultText + global.util.format(global.defineManager.PASSED_BUS, gapPastBusTimeSec)
                }
                break
            }
        }

        bakShuttleSec = shuttleSec
    }
    return resultText
}

exports.PrintAllShuttle = function(selection, database) {
    resultText = global.defineManager.LET_ME_SHOW_ALL_OF_BUS_TIME

    resultText = resultText + global.defineManager.TEXT_GIHEUNG_TO_SCHOOL
    for(indexOfTime in database[global.defineManager.DATABASE_GIHEUNG_TO_SCHOOL]) {
        resultText = resultText + database[global.defineManager.DATABASE_GIHEUNG_TO_SCHOOL][indexOfTime] + "\n"
    }

    resultText = resultText + global.defineManager.TEXT_KANGNAM_UNIV_TO_SCHOOL
    for(indexOfTime in database[global.defineManager.DATABASE_KANGNAM_UNIV_TO_SCHOOL]) {
        resultText = resultText + database[global.defineManager.DATABASE_KANGNAM_UNIV_TO_SCHOOL][indexOfTime] + "\n"
    }

    resultText = resultText + global.defineManager.TEXT_SCHOOL_TO_GIHEUNG
    for(indexOfTime in database[global.defineManager.DATABASE_SCHOOL_TO_GIHEUNG]) {
        resultText = resultText + database[global.defineManager.DATABASE_SCHOOL_TO_GIHEUNG][indexOfTime] + "\n"
    }

    resultText = resultText + global.defineManager.TEXT_SCHOOL_TO_KANGNAM_UNIV
    for(indexOfTime in database[global.defineManager.DATABASE_SCHOOL_TO_KANGNAM_UNIV]) {
        resultText = resultText + database[global.defineManager.DATABASE_SCHOOL_TO_KANGNAM_UNIV][indexOfTime] + "\n"
    }
    return resultText
}

exports.SearchFastestShuttleBasedOnStartPoint = function(userContent, databaseSnapshot) {
    switch (userContent){
        case global.defineManager.GIHEUNG_TO_SCHOOL:
            responseText = this.PrintFastestShuttle(userContent, databaseSnapshot)
            break;
        case global.defineManager.KANGNAM_UNIV_STATION_TO_SCHOOL:
            responseText = this.PrintFastestShuttle(userContent, databaseSnapshot)
            break;
        case global.defineManager.SCHOOL_TO_GIHEUNG:
            responseText = this.PrintFastestShuttle(userContent, databaseSnapshot)
            break;
        case global.defineManager.SCHOOL_TO_KANGNAM_UNIV_STATION:
            responseText = this.PrintFastestShuttle(userContent, databaseSnapshot)
            break;
        default:
            responseText = "selection: " + userContent
            break;
    }
    return responseText
}

exports.PrintShuttleRoute = function (databaseSnapshot) {
    return global.util.format(global.defineManager.SHUTTLE_STATION_ROUTE, databaseSnapshot["BusStopSchedule"]["busStopRoutine"])
}

exports.SearchFastestShuttleBasedOnStartPointV2 = function (admin, busTimeListSavedPoint, callbackFunc) {
    global.logManager.PrintLogMessage("BusTimeManager", "SearchFastestShuttleBasedOnStartPointV2", "search fastest bus time", global.defineManager.LOG_LEVEL_INFO)

    busTimeListPath = global.defineManager.DATABASE_SERVICE_V2_0_0_BUS_INFO_SCHEDULE_LIST_PATH + "/" + busTimeListSavedPoint
    global.logManager.PrintLogMessage("BusTimeManager", "SearchFastestShuttleBasedOnStartPointV2", "search bus time path: " + busTimeListPath, global.defineManager.LOG_LEVEL_DEBUG)

    admin.database().ref(busTimeListPath).once('value', function (busTimeScheduleBasedOnMoveDirectionList) {

        busTimeScheduleBasedOnMoveDirectionList = JSON.parse(JSON.stringify(busTimeScheduleBasedOnMoveDirectionList))

        var currentDate = new Date();
        var hour = (currentDate.getHours() + global.defineManager.GMT_KOREA_TIME) % global.defineManager.DAY_TO_HOUR
        var min = currentDate.getMinutes()
        var sec = currentDate.getSeconds()

        currentSec = hour * 3600 + min * 60 + sec * 1
        shuttleSec = 0
        resultShuttleSec = 0
        bakShuttleSec = 0
        resultStatus = global.defineManager.BUS_STATUS_NORMAL
        nextShuttleSec = 0

        global.logManager.PrintLogMessage("BusTimeManager", "SearchFastestShuttleBasedOnStartPointV2", "current time sec: " + currentSec + " date: " + currentDate, global.defineManager.LOG_LEVEL_DEBUG)

        for(index in busTimeScheduleBasedOnMoveDirectionList) {
            shuttleSec = Number(busTimeScheduleBasedOnMoveDirectionList[index])
            console.log("sec: ", shuttleSec, " index: ", index)
            if(index == 0) { // 첫차 시간
                if(currentSec < shuttleSec) {
                    resultShuttleSec = shuttleSec;
                    resultStatus = global.defineManager.BUS_STATUS_FIRST
                    nextShuttleSec = Number(busTimeScheduleBasedOnMoveDirectionList[Number(index + 1)])
                    global.logManager.PrintLogMessage("BusTimeManager", "SearchFastestShuttleBasedOnStartPointV2", "we found first shuttle time: " + shuttleSec, global.defineManager.LOG_LEVEL_DEBUG)
                    break
                }
            }
            else if(index == busTimeScheduleBasedOnMoveDirectionList.length - 1){
                gapPastBusTimeSec =  currentSec - bakShuttleSec
                if(currentSec < shuttleSec) { // 마지막차 시간
                    resultShuttleSec = shuttleSec;
                    resultStatus = global.defineManager.BUS_STATUS_LAST
                    nextShuttleSec = 0
                    global.logManager.PrintLogMessage("BusTimeManager", "SearchFastestShuttleBasedOnStartPointV2", "we found last shuttle time: " + shuttleSec, global.defineManager.LOG_LEVEL_DEBUG)
                    break
                }
                else if(currentSec >= shuttleSec) { // 마지막차 놓침
                    resultShuttleSec = busTimeScheduleBasedOnMoveDirectionList[0];
                    resultStatus = global.defineManager.BUS_STATUS_MISSED_ALL
                    nextShuttleSec = 0
                    global.logManager.PrintLogMessage("BusTimeManager", "SearchFastestShuttleBasedOnStartPointV2", "missed last shuttle, so first shuttle time is: " + resultShuttleSec, global.defineManager.LOG_LEVEL_DEBUG)
                    break
                }
            }
            else {
                gapPastBusTimeSec =  currentSec - bakShuttleSec
                if(bakShuttleSec < currentSec && currentSec < shuttleSec) { // 보통차 시간
                    resultShuttleSec = shuttleSec;
                    resultStatus = global.defineManager.BUS_STATUS_NORMAL
                    nextShuttleSec = Number(busTimeScheduleBasedOnMoveDirectionList[Number(index + 1)])
                    global.logManager.PrintLogMessage("BusTimeManager", "SearchFastestShuttleBasedOnStartPointV2", "we found shuttle time: " + shuttleSec, global.defineManager.LOG_LEVEL_DEBUG)
                    break
                }
            }

            bakShuttleSec = shuttleSec
        }

        callbackFunc(resultShuttleSec, nextShuttleSec, resultStatus)
    })
}

exports.GenerateBusScheduleReview = function (responseMsgDic, resultTimeSec, nextShuttleSec, state) {
    global.logManager.PrintLogMessage("BusTimeManager", "GenerateBusScheduleReview", "fastest shuttle info-> result: "
        + resultTimeSec + " next: " + nextShuttleSec + " state: " + state, global.defineManager.LOG_LEVEL_DEBUG)

    responseMsgStr = responseMsgDic[state]

    var currentDate = new Date();
    var hour = (currentDate.getHours() + global.defineManager.GMT_KOREA_TIME) % global.defineManager.DAY_TO_HOUR
    var min = currentDate.getMinutes()
    var sec = currentDate.getSeconds()

    currentSec = hour * 3600 + min * 60 + sec * 1
    nearestTimeStr = ""
    nextNearestTimeStr = ""

    nearestTimeGap = resultTimeSec - currentSec
    nextNearestTimeGap = nextShuttleSec - currentSec
    if(nearestTimeGap < global.defineManager.PRINT_TIME_OR_LEFT_MIN_THRES_SEC) {
    //    print as left min
        nearestTimeStr = Math.floor(nearestTimeGap / 60) + "분 후"
    }
    else {
    //    print as time
        nearestHour = Math.floor(resultTimeSec / 3600)
        resultTimeSec = resultTimeSec % 3600
        nearestMin = Math.floor(resultTimeSec / 60)
        resultTimeSec = resultTimeSec % 60
        nearestSec = resultTimeSec

        nearestTimeStr = nearestHour + ":" + nearestMin + ":" + nearestSec
    }

    global.logManager.PrintLogMessage("BusTimeManager", "GenerateBusScheduleReview", "nearest gap: "
        + nearestTimeGap + " str: " + nearestTimeStr, global.defineManager.LOG_LEVEL_DEBUG)

    if(nextNearestTimeGap < global.defineManager.PRINT_TIME_OR_LEFT_MIN_THRES_SEC) {
        //    print as left min
        nextNearestTimeStr = Math.floor(nextNearestTimeGap / 60) + "분 후"
    }
    else {
        //    print as time
        nextNearestHour = Math.floor(nextShuttleSec / 3600)
        nextShuttleSec = nextShuttleSec % 3600
        nextNearestMin = Math.floor(nextShuttleSec / 60)
        nextShuttleSec = nextShuttleSec % 60
        nextNearestSec = nextShuttleSec

        nextNearestTimeStr = nextNearestHour + ":" + nextNearestMin + ":" + nextNearestSec
    }

    global.logManager.PrintLogMessage("BusTimeManager", "GenerateBusScheduleReview", "next nearest gap: "
        + nextNearestTimeGap + " str: " + nextNearestSec, global.defineManager.LOG_LEVEL_DEBUG)

    switch (state) {
        case global.defineManager.BUS_STATUS_FIRST:
            responseMsgStr = global.util.format(responseMsgStr, nearestTimeStr, nextNearestTimeStr)
            break;
        case global.defineManager.BUS_STATUS_NORMAL:
            responseMsgStr = global.util.format(responseMsgStr, nearestTimeStr, nextNearestTimeStr)
            break;
        case global.defineManager.BUS_STATUS_LAST:
            responseMsgStr = global.util.format(responseMsgStr, nearestTimeStr)
            break;
        case global.defineManager.BUS_STATUS_MISSED_ALL:
            responseMsgStr = global.util.format(responseMsgStr, nearestTimeStr)
            break;
    }

    return responseMsgStr
}

exports.TimeToSec = function(hour, min, sec) {
    return hour * 3600 + min * 60 + sec * 1
}