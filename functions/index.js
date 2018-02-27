global.defineManager = require('./Settings/DefineManager');
global.logManager = require('./Utils/LogManager');

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});

exports.keyboard = functions.https.onRequest((request, response) => {

    responseMessage = {"type" : "buttons", "buttons" : global.defineManager.MAIN_BUTTONS}

 // response.setHeader('Content-Type', 'application/json');
 response.status(200).send(JSON.stringify(responseMessage))
});

exports.message = functions.https.onRequest((request, response) => {
    userContent = ""
    responseButton = []
    databaseSnapshot = {}
    responseText = ""
    labelButton = ""
    responseMessage = {}

    admin.database().ref('/').once('value', (snapshot) => {
        databaseSnapshot = snapshot.val()
        // console.log("db: " + JSON.stringify(databaseSnapshot))

        switch(request.method) {
            case 'POST':
                requestMessage = request.body
                userContent = requestMessage["content"]
                // console.log("content: " + userContent)
                if(userContent == global.defineManager.LEAVE_AS_SOON_AS_SHUTTLE) {
                    // console.log("selection: leave soon, all")
                    responseButton = global.defineManager.SHUTTLE_START_POINT_BUTTONS
                    responseText = global.defineManager.PLZ_INPUT_DEPART_AND_ARRIVE_POINT
                    responseMessage["text"] = responseText
                }
                else if(userContent == global.defineManager.ALL_SHUTTLE_TIME) {
                    responseButton = global.defineManager.MAIN_BUTTONS
                    responseText = PrintAllShuttle(userContent, databaseSnapshot)
                    responseMessage["text"] = responseText
                }
                else if(userContent == global.defineManager.SERVICE_INFO) {
                    // console.log("selection: service info")
                    responseButton = global.defineManager.MAIN_BUTTONS
                    // system
                    systemData = databaseSnapshot["System"]
                    responseText = "버전: " + systemData["ver"] + "\n최종 수정일: " + systemData["lastEdit"] +
                        "\n개발자: " + systemData["developer"] + "\n메일: " + systemData["email"]

                    labelButton = {"label": "공유하기", "url": global.defineManager.STORAGE_SHARE_CARD_URL}
                    responseMessage["message_button"] = labelButton
                    responseMessage["text"] = responseText
                }
                else {
                    // console.log("selection: else")
                    responseButton = global.defineManager.MAIN_BUTTONS
                    switch (userContent){
                        case global.defineManager.GIHEUNG_TO_SCHOOL:
                            responseText = PrintFastestShuttle(userContent, databaseSnapshot[global.defineManager.DATABASE_GIHEUNG_TO_SCHOOL])
                            break;
                        case global.defineManager.KANGNAM_UNIV_STATION_TO_SCHOOL:
                            responseText = PrintFastestShuttle(userContent, databaseSnapshot[global.defineManager.DATABASE_KANGNAM_UNIV_TO_SCHOOL])
                            break;
                        case global.defineManager.SCHOOL_TO_GIHEUNG:
                            responseText = PrintFastestShuttle(userContent, databaseSnapshot[global.defineManager.DATABASE_SCHOOL_TO_GIHEUNG])
                            break;
                        case global.defineManager.SCHOOL_TO_KANGNAM_UNIV_STATION:
                            responseText = PrintFastestShuttle(userContent, databaseSnapshot[global.defineManager.DATABASE_SCHOOL_TO_KANGNAM_UNIV])
                            break;
                        default:
                            responseText = "selection: " + userContent
                            break;
                    }
                    responseMessage["text"] = responseText
                }
                break;
            default:
                break;
        }

        responseMessage = {"message": responseMessage,
            "keyboard": {"type" : "buttons", "buttons" : responseButton}}

        response.setHeader('Content-Type', 'application/json');
        response.status(200).send(JSON.stringify(responseMessage))
    })
});

function PrintFastestShuttle(selection, database) {
    var currentDate = new Date();
    var hour = (currentDate.getHours() + 9) % 24
    var min = currentDate.getMinutes()
    var sec = currentDate.getSeconds()
    var resultText = "If you see this, plz report it. Your selection is: " + selection +
        " current time: " + hour + ":" + min + ":" + sec
    var bakShuttleSec = 0
    // console.log("" + hour + ":" + min + ":" + sec)
    console.log("database: " + database)
    currentSec = TimeToSec(hour, min, sec)
    for(indexOfTime in database) {

        indexOfTime = indexOfTime * 1

        shuttleTime = database[indexOfTime].split(":")
        shuttleSec = TimeToSec(shuttleTime[0], shuttleTime[1], shuttleTime[2])
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

function PrintAllShuttle(selection, database) {
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

function TimeToSec(hour, min, sec) {
    return hour * 3600 + min * 60 + sec * 1
}

exports.friend = functions.https.onRequest((request, response) => {
    switch(request.method) {
        case 'POST':
            break;
        case 'DELETE':
            break;
        default:
            break;
    }
});

exports.chat_room = functions.https.onRequest((request, response) => {
    switch(request.method) {
        case 'DELETE':
            break;
        default:
            break;
    }
});