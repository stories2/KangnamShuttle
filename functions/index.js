const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

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
    databaseSnapshot = {}
    responseText = ""
    labelButton = ""

    admin.database().ref('/').once('value', (snapshot) => {
        databaseSnapshot = snapshot.val()
        // console.log("db: " + JSON.stringify(databaseSnapshot))

        switch(request.method) {
            case 'POST':
                requestMessage = request.body
                userContent = requestMessage["content"]
                // console.log("content: " + userContent)
                if(userContent == LEAVE_AS_SOON_AS_SHUTTLE || userContent == ALL_SHUTTLE_TIME) {
                    // console.log("selection: leave soon, all")
                    responseButton = SHUTTLE_START_POINT_BUTTONS
                    responseText = "selection: " + userContent
                }
                else if(userContent == SERVICE_INFO) {
                    // console.log("selection: service info")
                    responseButton = MAIN_BUTTONS
                    // system
                    systemData = databaseSnapshot["System"]
                    responseText = "버전: " + systemData["ver"] + "\n최종 수정일: " + systemData["lastEdit"] +
                        "\n개발자: " + systemData["developer"] + "\n메일: " + systemData["email"]

                    labelButton = {"label": "공유하기", "url": "https://firebasestorage.googleapis.com/v0/b/kangnamshuttle.appspot.com/o/poster.png?alt=media&token=fb60f794-50a2-40c8-be0c-f2400eabaad4"}
                }
                else {
                    // console.log("selection: else")
                    responseButton = MAIN_BUTTONS
                    responseText = "selection: " + userContent
                }
                break;
            default:
                break;
        }

        responseMessage = {"message": {"text": responseText, "message_button": labelButton},
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