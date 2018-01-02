const functions = require('firebase-functions');

var LEAVE_AS_SOON_AS_SHUTTLE = "곧 떠날 달구지"
var ALL_SHUTTLE_TIME = "전체 달구지 시간표"
var SERVICE_INFO = "서비스 정보"
var GIHEUNG_TO_SCHOOL = "기흥역 -> 강남대 이공관"
var KANGNAM_UNIV_STATION_TO_SCHOOL = "강남대역 -> 강남대 이공관"
var SCHOOL_TO_GIHEUNG = "강남대 이공관 -> 기흥역"
var SCHOOL_TO_KANGNAM_UNIV_STATION = "강남대 이공관 -> 강남대역"
var MAIN_BUTTONS = [LEAVE_AS_SOON_AS_SHUTTLE, ALL_SHUTTLE_TIME, SERVICE_INFO]
var SHUTTLE_START_POINT_BUTTONS = [
    GIHEUNG_TO_SCHOOL,
    KANGNAM_UNIV_STATION_TO_SCHOOL,
    SCHOOL_TO_GIHEUNG,
    SCHOOL_TO_KANGNAM_UNIV_STATION]

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});

exports.keyboard = functions.https.onRequest((request, response) => {

    responseMessage = {"type" : "buttons", "buttons" : MAIN_BUTTONS}

 // response.setHeader('Content-Type', 'application/json');
 response.status(200).send(JSON.stringify(responseMessage))
});

exports.message = functions.https.onRequest((request, response) => {
    userContent = ""
    responseButton = []
    switch(request.method) {
        case 'POST':
            requestMessage = request.body
            userContent = requestMessage["content"]
            if(userContent == LEAVE_AS_SOON_AS_SHUTTLE) {
                responseButton = SHUTTLE_START_POINT_BUTTONS
            }
            else {
                responseButton = MAIN_BUTTONS
            }
            break;
        default:
            break;
    }

    responseMessage = {"message": {"text": "selection: " + userContent}, "keyboard": {"type" : "buttons", "buttons" : responseButton}}

    response.setHeader('Content-Type', 'application/json');
    response.status(200).send(JSON.stringify(responseMessage))
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