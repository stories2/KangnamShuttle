global.defineManager = require('./Settings/DefineManager');
global.logManager = require('./Utils/LogManager');
global.util = require('util')

const functions = require('firebase-functions');
const admin = require('firebase-admin');

var serviceAccount = require("./service-account.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://kangnamshuttle.firebaseio.com/",
});

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
            currentRoutineLinkItem = request.databaseSnapshot[currentOrderNumber]
            if(automatonManager.IsRightTypeOfInput(currentRoutineLinkItem, inputType) != true) {
                currentOrderNumber = global.defineManager.AUTOMATON_WRONG_INPUT_TYPE_RECEIVED_NUMBER
                currentRoutineLinkItem = request.databaseSnapshot[currentOrderNumber]
            }
            userManager.UpdateLastInputOrder(admin, currentUserKey, currentOrderNumber)
            userManager.UpdateUserLastUseDateTime(admin, currentUserKey)
            automatonManager.OrderExecute(admin, functions, request, currentRoutineLinkItem, currentOrderNumber, currentUserData, currentUserKey,
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
    subwayManager.PostfixUpdateSubwaySchedule(admin, subwayManager, subwayOpenApiInfo, "4502", global.defineManager.SUBWAY_DIRECTION_UP)
    response.status(global.defineManager.HTTP_SUCCESS).send()
})

exports.V2 = functions.https.onRequest(kakaoAppV2);

publicV2.use(cors)
publicV2.use(middleWareOfMessage)
publicV2.set("view engine","ejs");
publicV2.engine('ejs', require('ejs').__express);
publicV2.use(express.static('Public'));

publicV2.get('/KangnamShuttle', function(request, response) {

    subMenu = ""
    queryParseManager = require('./Core/QueryParseManager');
    parsedQueryData = queryParseManager.PublicApiParseRequestQuery(request.query)

    if(parsedQueryData.hasOwnProperty("page") != true ||
        parsedQueryData["page"][global.defineManager.PUBLIC_V2_QUERY_TYPE] != global.defineManager.PUBLIC_V2_QUERY_TYPE_MENU) {

        global.logManager.PrintLogMessage("index", "KangnamShuttle", "request sub menu is null, redirect to main page",
            global.defineManager.LOG_LEVEL_WARN)
        subMenu = "#"
        response.redirect("https://kangnamshuttle.firebaseapp.com/index.html")
        return
    }
    subMenu = parsedQueryData["page"][global.defineManager.PUBLIC_V2_QUERY_VALUE]

    global.logManager.PrintLogMessage("index", "KangnamShuttle", "request sub menu: " + subMenu,
        global.defineManager.LOG_LEVEL_DEBUG)
    response.status(global.defineManager.HTTP_SUCCESS).render("BigTemplateMan", {
        title: "강남대학교 달구지봇",
        loadPageName: subMenu,
        loadPageData: parsedQueryData
    })
})

publicV2.get('/map', function (request, response) {
    response.status(global.defineManager.HTTP_SUCCESS).render("map", {

    })
})

publicV2.get('/VerifyEmail', function(request, response){
    emailAddr = request.query.email
    response.status(global.defineManager.HTTP_SUCCESS).render("verifyEmailSent", {
        email: emailAddr
    })
})

publicV2.get('/Profile', function (request, response) {
    currentUserKey = request.query.userKey

    userManager.IsSignedUpUser(admin, currentUserKey, function (isUserSignedUp) {
        if(isUserSignedUp) {
            response.status(global.defineManager.HTTP_SUCCESS).render("profile", {
                displayName: currentUserKey
            })
        }
        else {
            global.logManager.PrintLogMessage("index", "Profile", "user " + currentUserKey + " not signed up. Redirect to signup page", global.defineManager.LOG_LEVEL_WARN)
            response.redirect('SignUp?userKey=' + currentUserKey)
        }
    })
})

publicV2.get('/SignUp', function (request, response) {
    currentUserKey = request.query.userKey
    response.status(global.defineManager.HTTP_SUCCESS).render("signUp", {
        userKey: currentUserKey
    })
})

publicV2.post('/UpdateMyAccount', function (request, response) {

    global.logManager.PrintLogMessage("index", "UpdateMyAccount", "request data: " + JSON.stringify(request.body), global.defineManager.LOG_LEVEL_DEBUG)

    userManager.SignUpUser(admin, request.body, function (isVerifyMailSent, address) {
        if(isVerifyMailSent) {
            response.status(global.defineManager.HTTP_SUCCESS).render("verifyEmailSent", {
                email: address
            })
        }
        else {
            response.status(global.defineManager.HTTP_SERVER_ERROR).send()
        }
    })
})

publicV2.post('/RemoveMyAccount', function (request, response) {

    global.logManager.PrintLogMessage("index", "RemoveMyAccount", "request data: " + JSON.stringify(request.body), global.defineManager.LOG_LEVEL_DEBUG)

    response.status(global.defineManager.HTTP_SUCCESS).send()
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