global.defineManager = require('./Settings/DefineManager');
global.logManager = require('./Utils/LogManager');
global.util = require('util')

const functions = require('firebase-functions');
const admin = require('firebase-admin');

const busTimeManager = require('./Core/BusTimeManager');
const advertiseManager = require('./Core/AdvertiseManager');
const contentsManager = require('./Core/ContentsManager');
const responseManager = require('./Utils/ResponseManager');
const generateManager = require('./Utils/GenerateManager');
const convertManager = require('./Utils/ConvertManager');

admin.initializeApp(functions.config().firebase);

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

    requestMessage = request.body
    userContent = requestMessage["content"]

    global.logManager.PrintLogMessage("index", "message",
        "request info user_key: " + requestMessage["user_key"] +
        " content: " + requestMessage["content"] + " type: " + requestMessage["type"],
        global.defineManager.LOG_LEVEL_INFO)

    switch(request.method) {
        case 'POST':
            if(userContent == global.defineManager.LEAVE_AS_SOON_AS_SHUTTLE) {
                responseButton = global.defineManager.SHUTTLE_START_POINT_BUTTONS
                responseText = global.defineManager.PLZ_INPUT_DEPART_AND_ARRIVE_POINT
                responseMessage["text"] = responseText

                responseManager.TemplateResponse(admin, convertManager, generateManager, response, requestMessage, responseMessage, responseButton)
            }
            else if(userContent == global.defineManager.ALL_SHUTTLE_TIME) {
                responseButton = global.defineManager.MAIN_BUTTONS
                // responseText = busTimeManager.PrintAllShuttle(userContent, databaseSnapshot)
                responseText = global.defineManager.LET_ME_SHOW_ALL_OF_BUS_TIME
                photoResponse = {
                    "url": global.defineManager.SHUTTLE_SCHEDULE_PHOTO,
                    "width": 679,
                    "height": 960
                }
                labelButton = {"label": "자세히", "url": global.defineManager.SHUTTLE_SCHEDULE_PHOTO}
                responseMessage["message_button"] = labelButton
                responseMessage["photo"] = photoResponse
                responseMessage["text"] = responseText

                responseManager.TemplateResponse(admin, convertManager, generateManager, response, requestMessage, responseMessage, responseButton)
            }
            else if(userContent == global.defineManager.SHUTTLE_STATION) {
                responseButton = global.defineManager.MAIN_BUTTONS
                responseText = busTimeManager.PrintShuttleRoute()
                responseMessage["text"] = responseText

                responseManager.TemplateResponse(admin, convertManager, generateManager, response, requestMessage, responseMessage, responseButton)
            }
            else if(userContent == global.defineManager.DICE_NUMBER_START) {
                responseButton = global.defineManager.MAIN_BUTTONS
                responseText = contentsManager.RollingDice()
                responseMessage["text"] = responseText

                responseManager.TemplateResponse(admin, convertManager, generateManager, response, requestMessage, responseMessage, responseButton)
            }
            else if(userContent == global.defineManager.SERVICE_INFO) {

                admin.database().ref('/').once('value', (snapshot) => {
                    databaseSnapshot = snapshot.val()

                    responseButton = global.defineManager.MAIN_BUTTONS
                    // system
                    systemData = databaseSnapshot["System"]
                    responseText = global.util.format(global.defineManager.SYSTEM_INFO_STR, systemData["ver"], systemData["lastEdit"], systemData["developer"], systemData["email"])

                    labelButton = {"label": "홈페이지", "url": global.defineManager.GO_TO_HOMEPAGE}
                    responseMessage["message_button"] = labelButton
                    responseMessage["text"] = responseText

                    responseManager.TemplateResponse(admin, convertManager, generateManager, response, requestMessage, responseMessage, responseButton)
                })
            }
            else if(userContent == global.defineManager.GIHEUNG_TO_SCHOOL ||
                        userContent == global.defineManager.KANGNAM_UNIV_STATION_TO_SCHOOL ||
                        userContent == global.defineManager.SCHOOL_TO_GIHEUNG ||
                        userContent == global.defineManager.SCHOOL_TO_KANGNAM_UNIV_STATION){
                admin.database().ref('/').once('value', (snapshot) => {
                    databaseSnapshot = snapshot.val()

                    responseButton = global.defineManager.MAIN_BUTTONS
                    responseText = busTimeManager.SearchFastestShuttleBasedOnStartPoint(userContent)
                    responseMessage = advertiseManager.GetTimeAdvertise(databaseSnapshot, responseText)

                    responseManager.TemplateResponse(admin, convertManager, generateManager, response, requestMessage, responseMessage, responseButton)
                })
            }
            else {
                responseButton = global.defineManager.MAIN_BUTTONS
                responseMessage["text"] = global.defineManager.SAY_AGAIN
                responseManager.TemplateResponse(admin, convertManager, generateManager, response, requestMessage, responseMessage, responseButton)
            }
            break;
        default:
            global.logManager.PrintLogMessage("index", "message",
                "wrong access accepted",
                global.defineManager.LOG_LEVEL_WARN)
            break;
    }
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