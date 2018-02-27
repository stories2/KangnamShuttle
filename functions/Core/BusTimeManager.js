exports.PrintFastestShuttle = function(selection, database) {
    var currentDate = new Date();
    var hour = (currentDate.getHours() + global.defineManager.GMT_KOREA_TIME) % global.defineManager.DAY_TO_HOUR
    var min = currentDate.getMinutes()
    var sec = currentDate.getSeconds()
    var resultText = "If you see this, plz report it. Your selection is: " + selection +
        " current time: " + hour + ":" + min + ":" + sec
    var bakShuttleSec = 0

    currentSec = this.TimeToSec(hour, min, sec)

    global.logManager.PrintLogMessage("BusTimeManager", "PrintFastestShuttle",
        "current time: " + currentDate + " -> sec: " + currentSec, global.defineManager.LOG_LEVEL_INFO)

    for(indexOfTime in database) {

        indexOfTime = indexOfTime * 1

        shuttleTime = database[indexOfTime].split(":")
        shuttleSec = this.TimeToSec(shuttleTime[0], shuttleTime[1], shuttleTime[2])
        shuttleTime = database[indexOfTime]

        if(indexOfTime == 0) {
            if(currentSec < shuttleSec) {
                global.logManager.PrintLogMessage("BusTimeManager", "PrintFastestShuttle",
                    "#" + indexOfTime + " shuttle time: " + shuttleTime + " -> sec: " + shuttleSec, global.defineManager.LOG_LEVEL_INFO)
                resultText = "첫 차가 " + shuttleTime + "에 출발해요!\n다음 버스는 " + database[indexOfTime + 1] + "에 출발합니다."
                break
            }
        }
        else if(indexOfTime == database.length - 1){
            if(currentSec < shuttleSec) {
                global.logManager.PrintLogMessage("BusTimeManager", "PrintFastestShuttle",
                    "#" + indexOfTime + " shuttle time: " + shuttleTime + " -> sec: " + shuttleSec, global.defineManager.LOG_LEVEL_INFO)
                resultText = "마지막 차가 " + shuttleTime + "에 출발해요!"
                break
            }
            else if(currentSec >= shuttleSec) {
                global.logManager.PrintLogMessage("BusTimeManager", "PrintFastestShuttle",
                    "#" + indexOfTime + " shuttle time: " + shuttleTime + " -> sec: " + shuttleSec, global.defineManager.LOG_LEVEL_INFO)
                resultText = "풉! 차를 다 놓치셨군요."
                break
            }
        }
        else {
            if(bakShuttleSec < currentSec && currentSec < shuttleSec) {
                global.logManager.PrintLogMessage("BusTimeManager", "PrintFastestShuttle",
                    "#" + indexOfTime + " shuttle time: " + shuttleTime + " -> sec: " + shuttleSec, global.defineManager.LOG_LEVEL_INFO)
                resultText = "이번 차는 " + shuttleTime + "에 출발해요!\n다음 버스는 " + database[indexOfTime + 1] + "에 출발합니다"
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

exports.TimeToSec = function(hour, min, sec) {
    return hour * 3600 + min * 60 + sec * 1
}