function UserV2Manager(firebase) {
    PrintLogMessage("UserV2Manager", "UserV2Manager", "init", LOG_LEVEL_INFO)
    this.firebase = firebase
    this.database = this.firebase.database()
    this.dataTransferManager = new DataTransferManager()
}

UserV2Manager.prototype.GetCurrentUserStatus = function (userKey, callbackFunc) {
    userInfoDatabasePath = DATABASE_USER_STATUS_PATH.format(userKey)
    PrintLogMessage("UserV2Manager", "GetCurrentUserStatus", "get user status path: " + userInfoDatabasePath, LOG_LEVEL_DEBUG)

    this.database.ref(userInfoDatabasePath).once('value').then(function(snapshot) {
        var userStatus = snapshot.val()
        // ...
        PrintLogMessage("UserV2Manager", "GetCurrentUserStatus", "current user status is: " + userStatus, LOG_LEVEL_DEBUG)
        if(callbackFunc !== undefined) {
            callbackFunc(userStatus)
        }
    });
}

UserV2Manager.prototype.SaveCurrentUserUid = function (userKey, uid, callbackFunc) {

    userInfoDatabasePath = DATABASE_USER_UID_PATH.format(userKey)
    PrintLogMessage("UserV2Manager", "SaveCurrentUserUid", "user key: " + userKey + " set uid: " + uid + " path: " + userInfoDatabasePath, LOG_LEVEL_DEBUG)
    // this.database.ref(userInfoDatabasePath).set (uid)

    payload = {
        "userKey": userKey,
        "uid": uid
    }

    PrintLogMessage("UserV2Manager", "SaveCurrentUserUid", "send user payload data: " + JSON.stringify(payload), LOG_LEVEL_DEBUG)

    dataTransferManagerClient = this.dataTransferManager

    authV2Manager.GetUserToken(function (idToken) {
        dataTransferManagerClient.PostRequestWithCallbackFunc(
            DOMAIN + SUB_DOMAIN_PATH_PRIVATE + API_PRIVATE_V2_SET_USER_UID,
            payload,
            function(successResult) {
                PrintLogMessage("UserV2Manager", "SaveCurrentUserUid", "successfully save user uid: " + JSON.stringify(successResult), LOG_LEVEL_DEBUG)
                if(callbackFunc !== undefined) {
                    callbackFunc()
                }
            },
            function (errorResult) {
                PrintLogMessage("UserV2Manager", "SaveCurrentUserUid", "error while save user uid: " + errorResult, LOG_LEVEL_ERROR)
            },idToken)
    })
}