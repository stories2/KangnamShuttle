exports.UpdateLastInputOrder = function (admin, currentUserKey, currentOrderNumber) {
    global.logManager.PrintLogMessage("UserManager", "UpdateLastInputOrder", "update last input order to: " + currentOrderNumber, global.defineManager.LOG_LEVEL_DEBUG)

    if(currentOrderNumber == null) {
        global.logManager.PrintLogMessage("UserManager", "UpdateLastInputOrder", "you must input current order number as parameter", global.defineManager.LOG_LEVEL_WARN)
    }
    else {
        orderNumberUpdatePath = global.defineManager.DATABASE_USERS_PATH + "/"
            + currentUserKey + global.defineManager.DATABASE_USER_LAST_ORDER_SHORT_PATH
        global.logManager.PrintLogMessage("UserManager", "UpdateLastInputOrder", "update last order number path: " + orderNumberUpdatePath, global.defineManager.LOG_LEVEL_DEBUG)
        admin.database().ref(orderNumberUpdatePath).set(currentOrderNumber)
    }
}

exports.CreateNewUserTemplate = function (admin, currentUserKey) {
    global.logManager.PrintLogMessage("UserManager", "CreateNewUserTemplate", "create user with template", global.defineManager.LOG_LEVEL_INFO)
    templateUserData = {
        "lastOrder": global.defineManager.AUTOMATON_START_NUMBER,
        "responseType": global.defineManager.RESPONSE_TYPE_OF_STR
    }

    newUserPath = global.defineManager.DATABASE_USERS_PATH + "/" + currentUserKey

    global.logManager.PrintLogMessage("UserManager", "CreateNewUserTemplate", "user create path: " + newUserPath, global.defineManager.LOG_LEVEL_DEBUG)

    admin.database().ref(newUserPath).set(templateUserData)

    return templateUserData
}

exports.UpdateUserLastUseDateTime = function (admin, currentUserKey) {
    global.logManager.PrintLogMessage("UserManager", "UpdateUserLastUseDateTime", "record user last ordered date-time", global.defineManager.LOG_LEVEL_INFO)

    lastUpdatedDateTimePath = global.util.format(global.defineManager.DATABASE_SERVICE_V2_0_0_USER_LAST_USER_DATE_TIME_PATH, currentUserKey)

    global.logManager.PrintLogMessage("UserManager", "UpdateUserLastUseDateTime", "update user last use date-time path: " + lastUpdatedDateTimePath, global.defineManager.LOG_LEVEL_DEBUG)

    date = new Date()
    var currentDate = date
    date = new Date(currentDate.valueOf() + global.defineManager.GMT_KOREA_TIME_MIN * global.defineManager.HOUR_TO_MILE)
    dateStr = date.toISOString()

    admin.database().ref(lastUpdatedDateTimePath).set(dateStr)

    global.logManager.PrintLogMessage("UserManager", "UpdateUserLastUseDateTime", "updated user last use date-time to: " + dateStr, global.defineManager.LOG_LEVEL_DEBUG)
}

exports.SayHelloToUser = function (admin, responseText, currentUserKey, callbackFunc) {
    global.logManager.PrintLogMessage("UserManager", "SayHelloToUser", "hello to " + currentUserKey, global.defineManager.LOG_LEVEL_DEBUG)

    currentUserUidPath = global.util.format(global.defineManager.DATABASE_SERVICE_V2_0_0_USER_UID_PATH, currentUserKey)
    global.logManager.PrintLogMessage("UserManager", "SayHelloToUser", "user's uid path: " + currentUserUidPath, global.defineManager.LOG_LEVEL_DEBUG)

    admin.database().ref(currentUserUidPath).once('value', function (uidSnapshot) {

        if(uidSnapshot != null) {
            global.logManager.PrintLogMessage("UserManager", "SayHelloToUser", "current user " + currentUserKey + " registered: " + uidSnapshot, global.defineManager.LOG_LEVEL_WARN)
        }
        else {
            global.logManager.PrintLogMessage("UserManager", "SayHelloToUser", "current user " + currentUserKey + " not registered", global.defineManager.LOG_LEVEL_WARN)
        }

        currentUserKey = currentUserKey.substring(0, global.defineManager.USER_UNREGEISTERED_KEY_SHOW_LIMIT)
        responseText = global.util.format(responseText, currentUserKey)
        global.logManager.PrintLogMessage("UserManager", "SayHelloToUser", "generated str: " + responseText, global.defineManager.LOG_LEVEL_DEBUG)

        callbackFunc(responseText)
    })
}