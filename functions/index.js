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
const schoolManager = require('./Core/SchoolManager');
const weatherManager = require('./Core/WeatherManager');

admin.initializeApp(functions.config().firebase);

const express = require('express');
const cors = require('cors')({origin: true});
const app = express();

const verifyAuthToken = function (request, response, next) {
    try {
        token = request.get('Authorization')
        admin.auth().verifyIdToken(token)
            .then(function (decodedToken) {
                global.logManager.PrintLogMessage("index", "verifyAuthToken", "token verified uid: " + decodedToken.uid, global.defineManager.LOG_LEVEL_INFO)
                request.user = decodedToken
                return next();
            })
            .catch(function (error) {
                global.logManager.PrintLogMessage("index", "verifyAuthToken", "cannot verify token", global.defineManager.LOG_LEVEL_ERROR)
                tempResponse = {'msg': global.defineManager.MESSAGE_FAILED}

                responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_UNAUTHORIZED, response)
            })
    }
    catch (exception) {
        global.logManager.PrintLogMessage("index", "verifyAuthToken", "server crashed", global.defineManager.LOG_LEVEL_ERROR)
        tempResponse = {'msg': global.defineManager.MESSAGE_FAILED}

        responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_SERVER_ERROR, response)
    }
}

app.use(cors)
app.use(verifyAuthToken)

exports.keyboard = functions.https.onRequest(function(request, response){

    responseMessage = {"type" : "buttons", "buttons" : global.defineManager.MAIN_BUTTONS}

 // response.setHeader('Content-Type', 'application/json');
 response.status(200).send(JSON.stringify(responseMessage))
});

exports.message = functions.https.onRequest(function(request, response){
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
            admin.database().ref('/BusStopSchedule/').once('value', function (snapshot) {
                busStopScheduleDatabase = snapshot.val()
                if(userContent == global.defineManager.LEAVE_AS_SOON_AS_SHUTTLE) {

                    responseButton = busStopScheduleDatabase["busStop"]
                    responseText = global.defineManager.PLZ_INPUT_DEPART_AND_ARRIVE_POINT
                    responseMessage["text"] = responseText

                    responseManager.TemplateResponse(admin, convertManager, generateManager, response, requestMessage, responseMessage, responseButton)

                    weatherManager.GetCurrentWeather(admin, "Gyeonggi-do,kr", "kr")
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

                    admin.database().ref('/System/').once('value', function(snapshot){
                        databaseSnapshot = snapshot.val()

                        responseButton = global.defineManager.MAIN_BUTTONS
                        // system
                        systemData = databaseSnapshot
                        responseText = global.util.format(global.defineManager.SYSTEM_INFO_STR, systemData["ver"], systemData["lastEdit"], systemData["developer"], systemData["email"])

                        labelButton = {"label": "홈페이지", "url": global.defineManager.GO_TO_HOMEPAGE}
                        responseMessage["message_button"] = labelButton
                        responseMessage["text"] = responseText

                        responseManager.TemplateResponse(admin, convertManager, generateManager, response, requestMessage, responseMessage, responseButton)
                    })
                }
                else if(userContent == global.defineManager.ACADEMIC_CALENDAR) {
                    // responseButton = global.defineManager.YEAR_SCHEDULE
                    // schoolManager.GetAcademicScheduleThisMonth()
                    // responseMessage["text"] = global.defineManager.ASK_SEARCH_TARGET_MONTH
                    //
                    // responseManager.TemplateResponse(admin, convertManager, generateManager, response, requestMessage, responseMessage, responseButton)
                    var currentDate = new Date();
                    currentTimezoneDate = new Date(currentDate.valueOf() + global.defineManager.GMT_KOREA_TIME_MIN * global.defineManager.HOUR_TO_MILE)
                    currentMonth = currentTimezoneDate.getMonth()
                    global.logManager.PrintLogMessage("index", "message", "searching current month: " + currentMonth + " schedule",
                        global.defineManager.LOG_LEVEL_INFO)
                    schoolManager.GetAcademicScheduleThisMonth(currentMonth, admin, convertManager, generateManager, response, requestMessage, responseManager)
                }
                else {
                    messageSent = false
                    for(indexNumber in busStopScheduleDatabase["busStop"]) {
                        if(userContent == busStopScheduleDatabase["busStop"][indexNumber]) {
                            global.logManager.PrintLogMessage("index", "message", "found moving path: " + userContent + " at #" + indexNumber,
                                global.defineManager.LOG_LEVEL_INFO)
                            messageSent = true
                            databaseSnapshot = busStopScheduleDatabase["busSchedule"][indexNumber]

                            responseButton = global.defineManager.MAIN_BUTTONS
                            responseText = busTimeManager.SearchFastestShuttleBasedOnStartPoint(userContent, databaseSnapshot)

                            admin.database().ref('/' + global.defineManager.DATABASE_WEATHER + '/').once('value', function (snapshot) {
                                databaseSnapshot = snapshot.val()
                                if(databaseSnapshot != null) {
                                    processResultCode = databaseSnapshot["cod"]
                                    if(processResultCode == global.defineManager.HTTP_REQUEST_SUCCESS) {
                                        weatherCastStr = weatherManager.WeatherCast(databaseSnapshot, convertManager)
                                        responseText = responseText + "\n" + weatherCastStr
                                    }
                                    else {
                                        global.logManager.PrintLogMessage("index", "message", "weather api has problem code: " + processResultCode,
                                            global.defineManager.LOG_LEVEL_WARN)
                                    }
                                }
                                else {
                                    global.logManager.PrintLogMessage("index", "message", "weather data seems not rdy",
                                        global.defineManager.LOG_LEVEL_WARN)
                                }
                                responseText = responseText + "\n" + contentsManager.NoticeMonday()

                                admin.database().ref('/' + global.defineManager.DATABASE_ADVERTISE + '/').once('value', function(snapshot){
                                    databaseSnapshot = snapshot.val()
                                    responseMessage = advertiseManager.GetTimeAdvertise(databaseSnapshot, responseText)

                                    messageSent = true
                                    responseManager.TemplateResponse(admin, convertManager, generateManager, response, requestMessage, responseMessage, responseButton)
                                })
                            })
                            break;
                        }
                    }
                    if(messageSent == false) {
                        responseButton = global.defineManager.MAIN_BUTTONS
                        responseMessage["text"] = global.defineManager.SAY_AGAIN
                        responseManager.TemplateResponse(admin, convertManager, generateManager, response, requestMessage, responseMessage, responseButton)
                    }
                }
            })
            break;
        default:
            global.logManager.PrintLogMessage("index", "message",
                "wrong access accepted",
                global.defineManager.LOG_LEVEL_WARN)
            break;
    }
});

exports.friend = functions.https.onRequest(function(request, response){
    switch(request.method) {
        case 'POST':
            break;
        case 'DELETE':
            break;
        default:
            break;
    }
});

exports.chat_room = functions.https.onRequest(function(request, response){
    switch(request.method) {
        case 'DELETE':
            break;
        default:
            break;
    }
});

exports.log = functions.https.onRequest(function(request, response){
    switch(request.method) {
        case 'GET':
            admin.database().ref('/Log/').once('value', function(snapshot){
                databaseSnapshot = snapshot.val()

                response.setHeader('Content-Type', 'application/json');
                response.status(200).send(JSON.stringify(databaseSnapshot))
            });
            break;
        default:
            break;
    }
});

exports.beta = functions.https.onRequest(function(request, response){
    switch(request.method) {
        case 'POST':
            // schoolManager.GetAcademicScheduleThisMonth()
            // weatherManager.GetCurrentWeather(admin, "Gyeonggi-do,kr", "kr")
            contentsManager.NoticeMonday()

            responseData = {
                "msg": "This is testing feature"
            }
            response.setHeader('Content-Type', 'application/json');
            response.status(200).send(JSON.stringify(responseData))
            break;
        default:
            break;
    }
});

exports.getListOfAdvertise = functions.https.onRequest(function(request, response){
    switch(request.method) {
        case 'GET':

            admin.database().ref('/' + global.defineManager.DATABASE_ADVERTISE + '/').once('value', function(snapshot) {
                databaseSnapshot = snapshot.val()

                responseData = {}
                responseData = advertiseManager.GetListOfAdvertise(databaseSnapshot)
                response.setHeader('Content-Type', 'application/json');
                response.setHeader("Access-Control-Allow-Origin", "*")
                response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
                response.status(200).send(JSON.stringify(responseData))
            })
            break;
        default:
            responseData = {
                "msg": "Unavailable income."
            }
            response.setHeader('Content-Type', 'application/json');
            response.setHeader("Access-Control-Allow-Origin", "*")
            response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
            response.status(405).send(JSON.stringify(responseData))
            break;
    }
});

exports.reservateAdvertise = functions.https.onRequest(function(request, response){
    switch(request.method) {
        case 'POST':
            advertiseManager.ReservateAdvertise(admin, response, request.body)
            break;
        default:
            responseData = {
                "msg": "Unavailable income."
            }
            response.setHeader('Content-Type', 'application/json');
            response.setHeader("Access-Control-Allow-Origin", "*")
            response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
            response.status(405).send(JSON.stringify(responseData))
            break;
    }
});

app.post('/updateBusStop', function (request, response) {
    admin.database().ref("/BusStopSchedule/busStop/").set(request.body["data"]);
    responseMessage = {
        "msg": global.defineManager.MESSAGE_SUCCESS
    }
    responseManager.TemplateOfResponse(responseMessage, global.defineManager.HTTP_SUCCESS, response)
})

app.post('/updateSchedule/:busStopNumber', function (request, response) {
    var busStopNumber = request.params.busStopNumber;
    global.logManager.PrintLogMessage("index", "updateSchedule", "update target stop schedule number: " + busStopNumber,
        global.defineManager.LOG_LEVEL_DEBUG)

    if(typeof busStopNumber != 'undefined') {
        admin.database().ref("/BusStopSchedule/busSchedule/" + busStopNumber + "/").set(request.body["data"]);
        responseManager.TemplateOfResponse(responseMessage, global.defineManager.HTTP_SUCCESS, response)
    }
    else {
        global.logManager.PrintLogMessage("index", "updateSchedule", "non selection bus stop station",
            global.defineManager.LOG_LEVEL_WARN)
        responseMessage = {
            "msg": global.defineManager.MESSAGE_FAILED
        }
        responseManager.TemplateOfResponse(responseMessage, global.defineManager.HTTP_SERVER_ERROR, response)
    }

})

app.get('/getBusStopList', function(request, response){
    admin.database().ref('/BusStopSchedule/busStop/').once('value', function(snapshot) {
        busStopList = snapshot.val()
        responseManager.TemplateOfResponse(busStopList, global.defineManager.HTTP_SUCCESS, response)
    })
})

app.get('/getBusSchedule/:busStopNumber', function (request, response) {
    var busStopNumber = request.params.busStopNumber;
    global.logManager.PrintLogMessage("index", "getBusSchedule", "get target stop schedule number: " + busStopNumber,
        global.defineManager.LOG_LEVEL_DEBUG)

    if(typeof busStopNumber != 'undefined') {
        admin.database().ref('/BusStopSchedule/busSchedule/' + busStopNumber + '/').once('value', function(snapshot) {
            busStopList = snapshot.val()
            responseManager.TemplateOfResponse(busStopList, global.defineManager.HTTP_SUCCESS, response)
        })
    }
    else {
        global.logManager.PrintLogMessage("index", "getBusSchedule", "non selection bus stop station",
            global.defineManager.LOG_LEVEL_WARN)
        responseMessage = {
            "msg": global.defineManager.MESSAGE_FAILED
        }
        responseManager.TemplateOfResponse(responseMessage, global.defineManager.HTTP_SERVER_ERROR, response)
    }
})

exports.admin = functions.https.onRequest(app);