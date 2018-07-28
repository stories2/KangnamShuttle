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
        uidSnapshot = JSON.parse(JSON.stringify(uidSnapshot))
        if(uidSnapshot != null) {
            global.logManager.PrintLogMessage("UserManager", "SayHelloToUser", "current user " + currentUserKey + " registered: " + uidSnapshot, global.defineManager.LOG_LEVEL_DEBUG)
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

exports.GoToMyProfile = function (admin, currentRoutineLinkItem, currentUserKey, callbackFunc) {
    global.logManager.PrintLogMessage("UserManager", "SayHelloToUser", "check user profile: " + currentUserKey, global.defineManager.LOG_LEVEL_DEBUG)

    profileCheckPath = global.util.format(currentRoutineLinkItem["labelUrl"], currentUserKey)
    global.logManager.PrintLogMessage("UserManager", "SayHelloToUser", "generated profile check url: " + profileCheckPath, global.defineManager.LOG_LEVEL_DEBUG)

    callbackFunc(profileCheckPath)
}

exports.IsSignedUpUser = function (admin, currentUserKey, callbackFunc) {
    if(currentUserKey == null) {
        global.logManager.PrintLogMessage("UserManager", "IsSignedUpUser", "you must send user key", global.defineManager.LOG_LEVEL_WARN)
        callbackFunc(false)
    }
    global.logManager.PrintLogMessage("UserManager", "IsSignedUpUser", "check user : " + currentUserKey + " signed up", global.defineManager.LOG_LEVEL_DEBUG)

    userUidPath = global.util.format(global.defineManager.DATABASE_SERVICE_V2_0_0_USER_UID_PATH, currentUserKey)
    global.logManager.PrintLogMessage("UserManager", "IsSignedUpUser", "user uid path: " + userUidPath, global.defineManager.LOG_LEVEL_DEBUG)

    admin.database().ref(userUidPath).once('value', function (uidSnapshot) {
        uidSnapshot = JSON.parse(JSON.stringify(uidSnapshot))
        if(uidSnapshot != null) {
            global.logManager.PrintLogMessage("UserManager", "IsSignedUpUser", "current user " + currentUserKey + " registered: " + uidSnapshot, global.defineManager.LOG_LEVEL_DEBUG)
            callbackFunc(true)
        }
        else {
            global.logManager.PrintLogMessage("UserManager", "IsSignedUpUser", "current user " + currentUserKey + " not registered", global.defineManager.LOG_LEVEL_WARN)
            callbackFunc(false)
        }
    })
}

exports.SignUpUser = function (admin, requestBody, callbackFunc) {
    userKey = requestBody["userKey"]
    studentID = requestBody["studentID"]
    if(userKey == null || studentID == null) {
        global.logManager.PrintLogMessage("UserManager", "SignUpUser", "you must send userkey and student id", global.defineManager.LOG_LEVEL_WARN)
        callbackFunc(false, null)
    }
    userEmailAddr = studentID + global.defineManager.USER_KANGNAM_UNIV_EMAIL
    global.logManager.PrintLogMessage("UserManager", "SignUpUser", "sign up user : " + userKey + " addr: " + userEmailAddr, global.defineManager.LOG_LEVEL_DEBUG)

    userDataPath = global.util.format(global.defineManager.DATABASE_SERVICE_V2_0_0_USER_DATA_PATH, userKey)
    admin.database().ref(userDataPath).once('value', function (userDataSnapshot) {
        userDataSnapshot = JSON.parse(JSON.stringify(userDataSnapshot))
        if(userDataSnapshot == null) {
            global.logManager.PrintLogMessage("UserManager", "SignUpUser", "undefined user key: " + userKey, global.defineManager.LOG_LEVEL_WARN)
            callbackFunc(false, null)
        }
        admin.auth().createUser({
            email: userEmailAddr,
            displayName: studentID,
            disabled: false
        }).then(function (userRecord) {
            uid = userRecord.uid
            userUidPath = global.util.format(global.defineManager.DATABASE_SERVICE_V2_0_0_USER_UID_PATH, userKey)
            global.logManager.PrintLogMessage("UserManager", "SignUpUser", "user created, save uid : " + uid + " to " + userKey, global.defineManager.LOG_LEVEL_DEBUG)
            admin.database().ref(userUidPath).set(uid)

            callbackFunc(true, userEmailAddr)
        }).catch(function (error) {
            global.logManager.PrintLogMessage("UserManager", "SignUpUser", "something goes wrong: " + error, global.defineManager.LOG_LEVEL_ERROR)
            callbackFunc(false, null)
        })
    })
}

exports.DropOutUser = function (admin, userKey, userInfo, callbackFunc) {
    global.logManager.PrintLogMessage("UserManager", "DropOutUser", "try to drop out user key: " + userKey + " email: " + userInfo["email"], global.defineManager.LOG_LEVEL_DEBUG)
    admin.auth().deleteUser(userInfo["uid"])
        .then(function() {
            // console.log("Successfully deleted user");

            callbackFunc(global.defineManager.MESSAGE_SUCCESS)
        })
        .catch(function(error) {
            // console.log("Error deleting user:", error);
            var errorCode = error.code;
            var errorMessage = error.message;
            global.logManager.PrintLogMessage("UserManager", "DropOutUser", "cannot drop out user code: " + errorCode + " msg: " + errorMessage, global.defineManager.LOG_LEVEL_ERROR)
            callbackFunc(global.defineManager.MESSAGE_FAILED)
        });
}