exports.PrintFastestShuttle = function(selection, database) {
    var currentDate = new Date();
    var hour = (currentDate.getHours() + 9) % 24
    var min = currentDate.getMinutes()
    var sec = currentDate.getSeconds()
    var resultText = "If you see this, plz report it. Your selection is: " + selection +
        " current time: " + hour + ":" + min + ":" + sec
    var bakShuttleSec = 0
    console.log("database: " + database)
    currentSec = this.TimeToSec(hour, min, sec)
    for(indexOfTime in database) {

        indexOfTime = indexOfTime * 1

        shuttleTime = database[indexOfTime].split(":")
        shuttleSec = this.TimeToSec(shuttleTime[0], shuttleTime[1], shuttleTime[2])
        shuttleTime = database[indexOfTime]

        console.log("#" + indexOfTime + "current sec: " + currentSec + " current time: " + hour + ":" + min + ":" + sec + " shuttle sec: " + shuttleSec + " time: " + shuttleTime)

        if(indexOfTime == 0) {
            if(currentSec < shuttleSec) {
                resultText = "첫 차가 " + shuttleTime + "에 출발해요!\n다음 버스는 " + database[indexOfTime + 1] + "에 출발합니다."
                break
            }
        }
        else if(indexOfTime == database.length - 1){
            if(currentSec < shuttleSec) {
                resultText = "마지막 차가 " + shuttleTime + "에 출발해요!"
                break
            }
            else if(currentSec >= shuttleSec) {
                resultText = "풉! 차를 다 놓치셨군요."
                break
            }
        }
        else {
            if(bakShuttleSec < currentSec && currentSec < shuttleSec) {
                resultText = "이번 차는 " + shuttleTime + "에 출발해요!\n다음 버스는 " + database[indexOfTime + 1] + "에 출발합니다"
                break
            }
        }

        bakShuttleSec = shuttleSec
    }
    return resultText
}

exports.PrintAllShuttle = function(selection, database) {
    resultText = "전체 시간표를 알려드릴께요~\n"

    resultText = resultText + "====기흥역 -> 이공관====\n"
    for(indexOfTime in database["GiheungToSchool"]) {
        resultText = resultText + database["GiheungToSchool"][indexOfTime] + "\n"
    }

    resultText = resultText + "====강남대역 -> 이공관====\n"
    for(indexOfTime in database["KangnamUnivToSchool"]) {
        resultText = resultText + database["KangnamUnivToSchool"][indexOfTime] + "\n"
    }

    resultText = resultText + "====이공관 -> 기흥역====\n"
    for(indexOfTime in database["SchoolToGiheung"]) {
        resultText = resultText + database["SchoolToGiheung"][indexOfTime] + "\n"
    }

    resultText = resultText + "====이공관 -> 강남대역====\n"
    for(indexOfTime in database["SchoolToKangnamUniv"]) {
        resultText = resultText + database["SchoolToKangnamUniv"][indexOfTime] + "\n"
    }
    return resultText
}

exports.TimeToSec = function(hour, min, sec) {
    return hour * 3600 + min * 60 + sec * 1
}