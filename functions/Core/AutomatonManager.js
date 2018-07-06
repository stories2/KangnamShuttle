exports.AnalysisCurrentOrderNumber = function (admin, callbackFunc, routineLinkedList, inputMsg, currentUserKey) {

    global.logManager.PrintLogMessage("AutomatonManager", "AnalysisCurrentOrderNumber", "base input: " + inputMsg + " / " + currentUserKey, global.defineManager.LOG_LEVEL_DEBUG)

    if(currentUserKey != null) {
        searchPath = global.defineManager.DATABASE_USERS_PATH + "/" + currentUserKey
        global.logManager.PrintLogMessage("AutomatonManager", "AnalysisCurrentOrderNumber", "search path: " + searchPath, global.defineManager.LOG_LEVEL_DEBUG)
        admin.database().ref(searchPath)
            .once('value', function (snapshot) {
                snapshot = JSON.parse(JSON.stringify(snapshot))

                if(snapshot == null) {
                    userManager = require('./UserManager');
                    snapshot = userManager.CreateNewUserTemplate(admin, currentUserKey)
                    global.logManager.PrintLogMessage("AutomatonManager", "AnalysisCurrentOrderNumber", "user created return template", global.defineManager.LOG_LEVEL_WARN)
                }

                global.logManager.PrintLogMessage("AutomatonManager", "AnalysisCurrentOrderNumber", "snapshot: " + JSON.stringify(snapshot), global.defineManager.LOG_LEVEL_DEBUG)

                lastOrderNumber = snapshot["lastOrder"] == null ? global.defineManager.AUTOMATON_START_NUMBER : snapshot["lastOrder"]

                global.logManager.PrintLogMessage("AutomatonManager", "AnalysisCurrentOrderNumber", "last input order: " + lastOrderNumber, global.defineManager.LOG_LEVEL_DEBUG)

                lastUsedOrderIndex = routineLinkedList[lastOrderNumber]
                inputOrderList = lastUsedOrderIndex["inputOrderList"]
                currentOrderNumber = global.defineManager.AUTOMATON_MAIN_ORDER_NUMBER
                for(key in inputOrderList) {
                    if(inputOrderList[key] == inputMsg) {
                        currentOrderNumber = lastUsedOrderIndex["nextOrderList"][key]
                        break;
                    }
                }
                global.logManager.PrintLogMessage("AutomatonManager", "AnalysisCurrentOrderNumber", "current order number: " + currentOrderNumber, global.defineManager.LOG_LEVEL_DEBUG)
                callbackFunc(currentOrderNumber, snapshot)
            })
    }
    else {
        global.logManager.PrintLogMessage("AutomatonManager", "AnalysisCurrentOrderNumber", "you must send user_key", global.defineManager.LOG_LEVEL_WARN)
        callbackFunc(global.defineManager.NOT_AVAILABLE)
    }
}

exports.OrderExecute = function (admin, request, currentRoutineLinkItem, currentOrderNumber, currentUserData, callbackFunc) {
    global.logManager.PrintLogMessage("AutomatonManager", "OrderExecute", "execute order", global.defineManager.LOG_LEVEL_INFO)

    currentUserResponseMsgType = currentUserData["responseType"]
    makeUpResponse = function (responseText, labelUrl, photoUrl) {

        responseMessage = {
            "message": {
                "text": responseText,
            },
            "keyboard": {
                "type": "buttons",
                "buttons": currentRoutineLinkItem["inputOrderList"]
            }
        }

        if(labelUrl != null) {
            msgBtnTemplate = {
                "message_button": {
                    "label": currentRoutineLinkItem["labelText"],
                    "url": labelUrl
                }
            }

            responseMessage["message"]["message_button"] = msgBtnTemplate["message_button"]
            global.logManager.PrintLogMessage("AutomatonManager", "OrderExecute", "msg btn template attached", global.defineManager.LOG_LEVEL_INFO)
        }
        if(photoUrl != null) {
            msgPhotoTemplate = {
                "photo": {
                    "url": photoUrl,
                    "width": currentRoutineLinkItem["photo"]["width"],
                    "height": currentRoutineLinkItem["photo"]["height"]
                }
            }

            responseMessage["message"]["photo"] = msgPhotoTemplate["photo"]
            global.logManager.PrintLogMessage("AutomatonManager", "OrderExecute", "msg photo template attached", global.defineManager.LOG_LEVEL_INFO)
        }

        global.logManager.PrintLogMessage("AutomatonManager", "OrderExecute", "response template: " + JSON.stringify(responseMessage), global.defineManager.LOG_LEVEL_DEBUG)

        callbackFunc(responseMessage)
    }

    if(currentOrderNumber >= global.defineManager.AUTOMATON_BUS_SEARCH_ORDER_START_NUMBER) {
        busTimeManager = require('./BusTimeManager');
        busTimeListSavedPoint = currentOrderNumber % global.defineManager.AUTOMATON_BUS_SEARCH_ORDER_START_NUMBER
        busTimeManager.SearchFastestShuttleBasedOnStartPointV2(admin, busTimeListSavedPoint, function (resultTimeSec, nextShuttleSec, state) {
            global.logManager.PrintLogMessage("AutomatonManager", "OrderExecute", "received shuttle time sec: " + resultTimeSec, global.defineManager.LOG_LEVEL_DEBUG)

            responseMsgStr = busTimeManager.GenerateBusScheduleReview(
                currentRoutineLinkItem["responseMsgDic"][currentUserResponseMsgType],
                resultTimeSec,
                nextShuttleSec,
                state
                )
            makeUpResponse(responseMsgStr, null, null)
        })
    }
    else if(currentOrderNumber == global.defineManager.AUTOMATON_PRINT_ALL_SHUTTLE_SCHEDULE_ORDER_NUMBER) {
        makeUpResponse(
            currentRoutineLinkItem["responseMsgDic"][currentUserResponseMsgType][global.defineManager.RESPONSE_DEFAULT_SELECTION],
            currentRoutineLinkItem["labelUrl"],
            currentRoutineLinkItem["photo"]["url"])
    }
    else if(currentOrderNumber == global.defineManager.AUTOMATON_SERVICE_INFO_ORDER_NUMBER) {
        systemManager = require('./SystemManager');
        systemManager.CurrentServiceInfo(
            admin,
            currentRoutineLinkItem["responseMsgDic"][currentUserResponseMsgType][global.defineManager.RESPONSE_DEFAULT_SELECTION],
            function (responseText) {
                makeUpResponse(responseText, null, null)
            })
    }
    else if(currentOrderNumber == global.defineManager.AUTOMATON_SERVICE_RELEASE_NOTE_ORDER_NUMBER) {
        systemManager = require('./SystemManager');
        systemManager.LatestServiceReleaseNote(
            admin,
            currentRoutineLinkItem["responseMsgDic"][currentUserResponseMsgType][global.defineManager.RESPONSE_DEFAULT_SELECTION],
            function (responseText) {
                makeUpResponse(responseText, null, null)
            }
        )
    }
    else {

        makeUpResponse(currentRoutineLinkItem["responseMsgDic"][currentUserResponseMsgType][global.defineManager.RESPONSE_DEFAULT_SELECTION], null, null)
    }
}