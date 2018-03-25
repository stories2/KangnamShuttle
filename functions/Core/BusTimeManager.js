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

exports.PrintShuttleRoute = function () {
    return global.defineManager.SHUTTLE_STATION_ROUTE
}

exports.TimeToSec = function(hour, min, sec) {
    return hour * 3600 + min * 60 + sec * 1
}