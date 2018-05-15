global.defineManager = require('./Settings/DefineManager');
global.logManager = require('./Utils/LogManager');
global.util = require('util')
global.performanceManager = require('./Core/PerformanceManager');

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
const busTrackingManager = require('./Core/BusTrackingManager');

admin.initializeApp(functions.config().firebase);

const express = require('express');
const cors = require('cors')({origin: true});
const lineBot = require('linebot');
const app = express();
const lineApp = express();
const kakaoApp = express();

const ubikanRequestData = {
    loginInfo: functions.config().ubikan.login_info,
    apiParam: functions.config().ubikan.api_param
}

// global.performanceManager.PreventColdStart2()

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

// Kakao api

const middleWareOfMessage = function (request, response, next) {
    try{
        switch (request.url) {
            case "/message":
                admin.database().ref(global.defineManager.DATABASE_SERVICE).once('value', function (snapshot) {
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
            default:
                return next();
                break;
        }
    }
    catch (exception) {
        response.status(500).send()
    }
}

kakaoApp.use(cors)
kakaoApp.use(middleWareOfMessage)

kakaoApp.get('/keyboard', function (request, response) {

    global.logManager.PrintLogMessage("index", "keyboard", "init keyboard", global.defineManager.LOG_LEVEL_INFO)

    responseMessage = {"type" : "buttons", "buttons" : global.defineManager.MAIN_BUTTONS}

    // response.setHeader('Content-Type', 'application/json');
    response.status(200).send(JSON.stringify(responseMessage))
    // busTrackingManager.PostfixUpdateUbikanBusData(admin, busTrackingManager, ubikanRequestData)
})

kakaoApp.post('/message', function (request, response) {
    userContent = ""
    responseButton = []
    databaseSnapshot = {}
    responseText = ""
    labelButton = ""
    responseMessage = {}

    requestMessage = request.body
    userContent = requestMessage["content"]
    databaseSnapshot = request.databaseSnapshot

    global.logManager.PrintLogMessage("index", "message",
        "request info user_key: " + requestMessage["user_key"] +
        " content: " + requestMessage["content"] + " type: " + requestMessage["type"],
        global.defineManager.LOG_LEVEL_INFO)

    // busStopScheduleDatabase = snapshot.val()
    if(userContent == global.defineManager.LEAVE_AS_SOON_AS_SHUTTLE) {

        responseButton = databaseSnapshot["BusStopSchedule"]["busStop"]
        responseText = global.defineManager.PLZ_INPUT_DEPART_AND_ARRIVE_POINT
        responseMessage["text"] = responseText

        responseManager.TemplateResponse(admin, convertManager, generateManager, response, requestMessage, responseMessage, responseButton)

        weatherManager.GetCurrentWeather(admin, "Gyeonggi-do,kr", "kr", databaseSnapshot["System"]["weatherApiKey"])
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

        responseButton = global.defineManager.MAIN_BUTTONS
        // system
        systemData = databaseSnapshot["System"]
        responseText = global.util.format(global.defineManager.SYSTEM_INFO_STR, systemData["ver"], systemData["lastEdit"], systemData["developer"], systemData["email"])

        labelButton = {"label": "홈페이지", "url": global.defineManager.GO_TO_HOMEPAGE}
        responseMessage["message_button"] = labelButton
        responseMessage["text"] = responseText

        responseManager.TemplateResponse(admin, convertManager, generateManager, response, requestMessage, responseMessage, responseButton)
    }
    else if(userContent == global.defineManager.ACADEMIC_CALENDAR) {
        var currentDate = new Date();
        currentTimezoneDate = new Date(currentDate.valueOf() + global.defineManager.GMT_KOREA_TIME_MIN * global.defineManager.HOUR_TO_MILE)
        currentMonth = currentTimezoneDate.getMonth()
        global.logManager.PrintLogMessage("index", "message", "searching current month: " + currentMonth + " schedule",
            global.defineManager.LOG_LEVEL_INFO)
        schoolManager.GetAcademicScheduleThisMonth(currentMonth, admin, convertManager, generateManager, response, requestMessage, responseManager, databaseSnapshot["SchoolSchedule"][currentMonth])
    }
    else {
        messageSent = false
        busStopScheduleDatabase = databaseSnapshot["BusStopSchedule"]
        for(indexNumber in busStopScheduleDatabase["busStop"]) {
            if(userContent == busStopScheduleDatabase["busStop"][indexNumber]) {
                global.logManager.PrintLogMessage("index", "message", "found moving path: " + userContent + " at #" + indexNumber,
                    global.defineManager.LOG_LEVEL_INFO)
                messageSent = true
                busStopScheduleTimeLineDatabase = busStopScheduleDatabase["busSchedule"][indexNumber]

                responseButton = global.defineManager.MAIN_BUTTONS
                responseText = busTimeManager.SearchFastestShuttleBasedOnStartPoint(userContent, busStopScheduleTimeLineDatabase)

                databaseSnapshotWeather = databaseSnapshot["Weather"]
                if(databaseSnapshotWeather != null) {
                    processResultCode = databaseSnapshotWeather["cod"]
                    if(processResultCode == global.defineManager.HTTP_REQUEST_SUCCESS) {
                        weatherCastStr = weatherManager.WeatherCast(databaseSnapshotWeather, convertManager)
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

                // console.log(JSON.stringify(databaseSnapshot))
                databaseSnapshotAdvertise = databaseSnapshot["Advertise"]
                responseMessage = advertiseManager.GetTimeAdvertise(databaseSnapshotAdvertise, responseText)

                messageSent = true
                responseManager.TemplateResponse(admin, convertManager, generateManager, response, requestMessage, responseMessage, responseButton)
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

kakaoApp.post('/friend', function (request, response) {
    global.logManager.PrintLogMessage("index", "friend", "new member accepted", global.defineManager.LOG_LEVEL_INFO)
    response.status(200).send()
})

kakaoApp.delete('/friend/:user_key', function (request, response) {
    userKey = request.params.user_key
    global.logManager.PrintLogMessage("index", "friend", "bye bye my friend: " + userKey, global.defineManager.LOG_LEVEL_INFO)
    response.status(200).send()
})

kakaoApp.delete('/chat_room/:user_key', function (request, response) {
    userKey = request.params.user_key
    global.logManager.PrintLogMessage("index", "chat_room", "delete chat room: " + userKey, global.defineManager.LOG_LEVEL_INFO)
    response.status(200).send()
})

kakaoApp.get('/log', function (request, response) {
    admin.database().ref('/Log/').once('value', function(snapshot){
        databaseSnapshot = snapshot.val()

        response.setHeader('Content-Type', 'application/json');
        response.status(200).send(JSON.stringify(databaseSnapshot))
    });
})

kakaoApp.post('/beta', function (request, response) {
    // contentsManager.NoticeMonday()
    // latestBusTrackingData = busTrackingManager.GetUbikanRealtimeData(request.databaseSnapshot)

    scanServerIp = []
    scanServerPort = []
    result = []

    schoolManager.RecursivePortScan(scanServerIp, scanServerPort, 0, schoolManager, response, result)

    responseData = {
        "msg": "This is testing feature"
    }

    // responseData = {
    //     "msg": latestBusTrackingData
    // }

    // response.setHeader('Content-Type', 'application/json');
    // response.status(200).send(JSON.stringify(responseData))
})

exports.kakao = functions.https.onRequest(kakaoApp);

exports.portScan = functions.https.onRequest(function(request, response) {

    global.logManager.PrintLogMessage("index", "portScan", "scan several server port",
        global.defineManager.LOG_LEVEL_DEBUG)

    requestData = request.body

    scanServerIp = requestData["serverList"]
    scanServerPort = requestData["serverPortList"]
    result = []

    schoolManager.RecursivePortScan(scanServerIp, scanServerPort, 0, schoolManager, response, result)
});

// Admin api

// app.post('/portScan', function (request, response) {
//
//     global.logManager.PrintLogMessage("index", "portScan", "scan several server port",
//         global.defineManager.LOG_LEVEL_DEBUG)
//
//     requestData = request.body
//
//     scanServerIp = requestData["serverList"]
//     scanServerPort = requestData["serverPortList"]
//     result = []
//
//     schoolManager.RecursivePortScan(scanServerIp, scanServerPort, 0, schoolManager, response, result)
// })

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

// Line api

const lineConfig = {
    channelAccessToken: functions.config().line.channel_access_token,
    channelSecret: functions.config().line.channel_secret,
    channelId: functions.config().line.channel_id
}

const lineBotManager = lineBot(lineConfig)
const lineBotParser = lineBotManager.parser();

lineApp.post('/lineWebhook', lineBotParser)

lineBotManager.on('message', function (event) {

    // replyData = responseManager.LineTemplateResponse(event.message.text)
    //
    // event.reply(replyData).then(function (data) {
    //     // console.log('Success', data);
    //     dataStr = JSON.stringify(data)
    //     messageStr = JSON.stringify(event)
    //     global.logManager.PrintLogMessage("index", "message", "success-> data: " + dataStr + " msg: " + messageStr, global.defineManager.LOG_LEVEL_INFO)
    // }).catch(function (error) {
    //     // console.log('Error', error);
    //     global.logManager.PrintLogMessage("index", "message", "error: " + error, global.defineManager.LOG_LEVEL_ERROR)
    // });
    responseManager.LineIntroResponse(responseManager, lineBotManager, event, 0)
})

lineBotManager.on('follow', function (event) {
    eventStr = JSON.stringify(event)
    global.logManager.PrintLogMessage("index", "follow", "event-> " + eventStr,
        global.defineManager.LOG_LEVEL_DEBUG)
    event.reply('follow: ' + event.source.userId);
});

lineBotManager.on('unfollow', function (event) {
    eventStr = JSON.stringify(event)
    global.logManager.PrintLogMessage("index", "unfollow", "event-> " + eventStr,
        global.defineManager.LOG_LEVEL_DEBUG)
    event.reply('unfollow: ' + event.source.userId);
});

lineBotManager.on('join', function (event) {
    eventStr = JSON.stringify(event)
    global.logManager.PrintLogMessage("index", "join", "event-> " + eventStr,
        global.defineManager.LOG_LEVEL_DEBUG)
    event.reply('join: ' + event.source.groupId);
});

lineBotManager.on('leave', function (event) {
    eventStr = JSON.stringify(event)
    global.logManager.PrintLogMessage("index", "leave", "event-> " + eventStr,
        global.defineManager.LOG_LEVEL_DEBUG)
    event.reply('leave: ' + event.source.groupId);
});

lineBotManager.on('postback', function (event) {
    eventStr = JSON.stringify(event)
    global.logManager.PrintLogMessage("index", "postback", "event-> " + eventStr,
        global.defineManager.LOG_LEVEL_DEBUG)
    event.reply('postback: ' + event.postback.data);
});

lineBotManager.on('beacon', function (event) {
    eventStr = JSON.stringify(event)
    global.logManager.PrintLogMessage("index", "beacon", "event-> " + eventStr,
        global.defineManager.LOG_LEVEL_DEBUG)
    event.reply('beacon: ' + event.beacon.hwid);
});

exports.line = functions.https.onRequest(lineApp);