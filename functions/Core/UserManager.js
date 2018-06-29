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