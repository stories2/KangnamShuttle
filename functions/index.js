global.defineManager = require('./Settings/DefineManager');
global.logManager = require('./Utils/LogManager');

const functions = require('firebase-functions');
const admin = require('firebase-admin');

const busTimeManager = require('./Core/BusTimeManager');

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
                    responseText = busTimeManager.PrintAllShuttle(userContent, databaseSnapshot)
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
                            responseText = busTimeManager.PrintFastestShuttle(userContent, databaseSnapshot[global.defineManager.DATABASE_GIHEUNG_TO_SCHOOL])
                            break;
                        case global.defineManager.KANGNAM_UNIV_STATION_TO_SCHOOL:
                            responseText = busTimeManager.PrintFastestShuttle(userContent, databaseSnapshot[global.defineManager.DATABASE_KANGNAM_UNIV_TO_SCHOOL])
                            break;
                        case global.defineManager.SCHOOL_TO_GIHEUNG:
                            responseText = busTimeManager.PrintFastestShuttle(userContent, databaseSnapshot[global.defineManager.DATABASE_SCHOOL_TO_GIHEUNG])
                            break;
                        case global.defineManager.SCHOOL_TO_KANGNAM_UNIV_STATION:
                            responseText = busTimeManager.PrintFastestShuttle(userContent, databaseSnapshot[global.defineManager.DATABASE_SCHOOL_TO_KANGNAM_UNIV])
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