global.defineManager = require('./Settings/DefineManager');
global.logManager = require('./Utils/LogManager');
global.util = require('util')

const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

const responseManager = require('./Utils/ResponseManager');
const automatonManager = require('./Core/AutomatonManager');
const userManager = require('./Core/UserManager');

const url = require('url')
const express = require('express');
const cors = require('cors')({origin: true});
const kakaoAppV2 = express();
const publicV2 = express();

const middleWareOfMessage = function (request, response, next) {
    requestPath = url.parse(request.url).pathname
    try{
        switch (requestPath) {
            case "/keyboard":
                admin.database().ref(global.defineManager.DATABASE_SERVICE_V2_0_0_RULE_INFO_ROUTINE_LINKED_LIST_PATH)
                    .once('value', function (snapshot) {
                    global.logManager.PrintLogMessage("index", "middleWareOfMessage<keyboard>", "getting service database",
                        global.defineManager.LOG_LEVEL_INFO)
                    request.databaseSnapshot = snapshot.val()
                    return next();
                })
                break;
            case "/message":
                admin.database().ref(global.defineManager.DATABASE_SERVICE_V2_0_0_RULE_INFO_ROUTINE_LINKED_LIST_PATH)
                    .once('value', function (snapshot) {
                    global.logManager.PrintLogMessage("index", "middleWareOfMessage<message>", "getting service database",
                        global.defineManager.LOG_LEVEL_INFO)
                    request.databaseSnapshot = snapshot.val()
                    return next();
                })
                break;
            case "/beta":
                admin.database().ref(global.defineManager.DATABASE_SERVICE).once('value', function (snapshot) {
                    // console.log("url: " + request.url)
                    global.logManager.PrintLogMessage("index", "middleWareOfMessage<beta>", "getting service database",
                        global.defineManager.LOG_LEVEL_INFO)
                    request.databaseSnapshot = snapshot.val()
                    return next();
                })
                break;
            case "/busLocation":
                admin.database().ref(global.defineManager.DATABASE_SERVICE_V2_0_0_BUS_LOCATION_PATH).once('value', function (snapshot) {
                    global.logManager.PrintLogMessage("index", "middleWareOfMessage<busLocation>", "getting service database",
                        global.defineManager.LOG_LEVEL_INFO)
                    request.databaseSnapshot = snapshot.val()
                    return next();
                })
                break;
            default:
                return next();
                break;
        }
    }
    catch (exception) {
        global.logManager.PrintLogMessage("index", "middleWareOfMessage", "exception accepted path: " + requestPath + " except: " + exception,
            global.defineManager.LOG_LEVEL_ERROR)
        response.status(global.defineManager.HTTP_SERVER_ERROR).send()
    }
}

kakaoAppV2.use(cors)
kakaoAppV2.use(middleWareOfMessage)

kakaoAppV2.get('/keyboard', function (request, response) {
    global.logManager.PrintLogMessage("index", "keyboard", "init keyboard", global.defineManager.LOG_LEVEL_INFO)
    responseManager.SimpleMsgAndButtonResponseV2(response, "1", request.databaseSnapshot, null);
})

kakaoAppV2.post('/message', function (request, response) {
    global.logManager.PrintLogMessage("index", "message", "message accepted", global.defineManager.LOG_LEVEL_INFO)

    currentUserKey = request.body["user_key"]
    inputContent = request.body["content"]
    inputType = request.body["type"]

    automatonManager.AnalysisCurrentOrderNumber(admin, function (currentOrderNumber, currentUserData) {
        if(currentOrderNumber == global.defineManager.NOT_AVAILABLE) {
            response.setHeader('Content-Type', 'application/json');
            response.status(global.defineManager.HTTP_SERVER_ERROR).send()
        }
        else {
            userManager.UpdateLastInputOrder(admin, currentUserKey, currentOrderNumber)
            automatonManager.OrderExecute(admin, request, request.databaseSnapshot[currentOrderNumber], currentOrderNumber, currentUserData,
                function (responseData) {
                responseManager.AutoMsgResponseV2(response, responseData)
            })
        }
    }, request.databaseSnapshot, inputContent, currentUserKey)
})

kakaoAppV2.post('/friend', function (request, response) {
    global.logManager.PrintLogMessage("index", "friend", "new member accepted", global.defineManager.LOG_LEVEL_INFO)
    response.status(global.defineManager.HTTP_SUCCESS).send()
})

kakaoAppV2.delete('/friend/:user_key', function (request, response) {
    userKey = request.params.user_key
    global.logManager.PrintLogMessage("index", "friend", "bye bye my friend: " + userKey, global.defineManager.LOG_LEVEL_INFO)
    response.status(global.defineManager.HTTP_SUCCESS).send()
})

kakaoAppV2.delete('/chat_room/:user_key', function (request, response) {
    userKey = request.params.user_key
    global.logManager.PrintLogMessage("index", "chat_room", "delete chat room: " + userKey, global.defineManager.LOG_LEVEL_INFO)
    response.status(global.defineManager.HTTP_SUCCESS).send()
})

kakaoAppV2.post('/beta', function (request, response) {
    global.logManager.PrintLogMessage("index", "beta", "testing beta api", global.defineManager.LOG_LEVEL_INFO)
    subwayManager = require('./Core/SubwayManager');
    subwayOpenApiInfo = {
        "endpoint_path": functions.config().seoul_open_api.endpoint_path,
        "key": functions.config().seoul_open_api.key,
        "endpoint": functions.config().seoul_open_api.endpoint
    }
    subwayManager.PostfixUpdateSubwaySchedule(admin, subwayManager, subwayOpenApiInfo, "1865", global.defineManager.SUBWAY_DIRECTION_UP)
    response.status(global.defineManager.HTTP_SUCCESS).send()
})

exports.V2 = functions.https.onRequest(kakaoAppV2);

publicV2.use(cors)
publicV2.use(middleWareOfMessage)
publicV2.set("view engine","ejs");
publicV2.engine('ejs', require('ejs').__express);
publicV2.use(express.static('Public'));

publicV2.get('/', function(request, response) {
    response.status(global.defineManager.HTTP_SUCCESS).render("template", {
        test: "It Works!"
    })
})

publicV2.get('/map', function (request, response) {
    response.status(global.defineManager.HTTP_SUCCESS).render("map", {

    })
})

publicV2.get('/busLocation', function(request, response) {
    global.logManager.PrintLogMessage("index", "busLocation", "get bus location data",
        global.defineManager.LOG_LEVEL_DEBUG)

    busTrackingManager = require('./Core/BusTrackingManager');
    responseData = busTrackingManager.GetUbikanRealtimeData(request.databaseSnapshot)

    responseManager.TemplateOfResponse(responseData, global.defineManager.HTTP_SUCCESS, response)
})

publicV2.get('/updateBusLocation', function (request, response) {
    global.logManager.PrintLogMessage("index", "updateBusLocation", "request update bus gps location data", global.defineManager.LOG_LEVEL_INFO)

    ubikhanRequestData = {
        loginInfo: functions.config().ubikan.login_info,
        apiParam: functions.config().ubikan.api_param
    }

    busTrackingManager = require('./Core/BusTrackingManager');
    busTrackingManager.PostfixUpdateUbikanBusData(admin, busTrackingManager, ubikhanRequestData)

    responseData = {
        "msg": "Bus data will update as soon as possible. Check the logs."
    }

    responseManager.TemplateOfResponse(responseData, global.defineManager.HTTP_SUCCESS, response)
})

exports.PublicV2 = functions.https.onRequest(publicV2);