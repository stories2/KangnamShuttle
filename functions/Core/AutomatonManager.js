exports.AnalysisCurrentOrderNumber = function (admin, callbackFunc, routineLinkedList, inputMsg, currentUserKey) {

    global.logManager.PrintLogMessage("AutomatonManager", "AnalysisCurrentOrderNumber", "base input: " + inputMsg + " / " + currentUserKey, global.defineManager.LOG_LEVEL_DEBUG)

    if(currentUserKey != null) {
        searchPath = global.defineManager.DATABASE_USERS_PATH + "/" + currentUserKey
        global.logManager.PrintLogMessage("AutomatonManager", "AnalysisCurrentOrderNumber", "search path: " + searchPath, global.defineManager.LOG_LEVEL_DEBUG)
        admin.database().ref(searchPath)
            .once('value', function (snapshot) {
                snapshot = JSON.parse(JSON.stringify(snapshot))
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
                "text": responseText
            },
            "keyboard": {
                "type": "buttons",
                "buttons": currentRoutineLinkItem["inputOrderList"]
            }
        }

        global.logManager.PrintLogMessage("AutomatonManager", "OrderExecute", "response template: " + JSON.stringify(responseMessage), global.defineManager.LOG_LEVEL_DEBUG)

        callbackFunc(responseMessage)
    }

    if(currentOrderNumber >= global.defineManager.AUTOMATON_BUS_SEARCH_ORDER_START_NUMBER) {
        busTimeManager = require('./BusTimeManager');
        busTimeListSavedPoint = Math.floor(currentOrderNumber / global.defineManager.AUTOMATON_BUS_SEARCH_ORDER_START_NUMBER)
        busTimeManager.SearchFastestShuttleBasedOnStartPointV2(admin, busTimeListSavedPoint, function (resultTimeSec, state) {
            global.logManager.PrintLogMessage("AutomatonManager", "OrderExecute", "received shuttle time sec: " + resultTimeSec, global.defineManager.LOG_LEVEL_DEBUG)
            
            makeUpResponse(currentRoutineLinkItem["responseMsgDic"][currentUserResponseMsgType][0], null, null)
        })
    }
    else {

        makeUpResponse(currentRoutineLinkItem["responseMsgDic"][currentUserResponseMsgType][0], null, null)
    }
}