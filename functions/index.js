global.defineManager = require('./Settings/DefineManager');
global.logManager = require('./Utils/LogManager');
global.util = require('util')

const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

const responseManager = require('./Utils/ResponseManager');
const automatonManager = require('./Core/AutomatonManager');

const url = require('url')
const express = require('express');
const cors = require('cors')({origin: true});
const kakaoAppV2 = express();

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
    automatonManager.AnalysisCurrentOrderNumber(admin, null, request.databaseSnapshot, request.body["content"], request.body["user_key"])
    response.setHeader('Content-Type', 'application/json');
    response.status(200).send()
})

kakaoAppV2.post('/friend', function (request, response) {
    global.logManager.PrintLogMessage("index", "friend", "new member accepted", global.defineManager.LOG_LEVEL_INFO)
    response.status(200).send()
})

kakaoAppV2.delete('/friend/:user_key', function (request, response) {
    userKey = request.params.user_key
    global.logManager.PrintLogMessage("index", "friend", "bye bye my friend: " + userKey, global.defineManager.LOG_LEVEL_INFO)
    response.status(200).send()
})

kakaoAppV2.delete('/chat_room/:user_key', function (request, response) {
    userKey = request.params.user_key
    global.logManager.PrintLogMessage("index", "chat_room", "delete chat room: " + userKey, global.defineManager.LOG_LEVEL_INFO)
    response.status(200).send()
})

exports.V2 = functions.https.onRequest(kakaoAppV2);