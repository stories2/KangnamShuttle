function UserV2Manager(firebase) {
    PrintLogMessage("UserV2Manager", "UserV2Manager", "init", LOG_LEVEL_INFO)
    this.firebase = firebase
    this.database = this.firebase.database()
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
    this.database.ref(userInfoDatabasePath).set(uid)

    if(callbackFunc !== undefined) {
        callbackFunc()
    }
}