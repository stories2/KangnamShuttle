exports.GetAllBusStation = function (admin, responseText, callbackFunc) {
    global.logManager.PrintLogMessage("BusManager", "GetAllBusStation", "checking bus station list", global.defineManager.LOG_LEVEL_INFO)

    admin.database().ref(global.defineManager.DATABASE_SERVICE_BUS_INFO_ROUTINE_PATH).once('value', function (busStationListSnapshot) {
        busStationListSnapshot = JSON.parse(JSON.stringify(busStationListSnapshot))
        responseText = global.util.format(
            responseText,
            busStationListSnapshot
        )

        global.logManager.PrintLogMessage("BusManager", "GetAllBusStation", "generated bus station list str: " + responseText, global.defineManager.LOG_LEVEL_DEBUG)

        callbackFunc(responseText)
    })
}

exports.UpdatePublicBusLocation = function(admin, busRoutineName, openApiInfo) {
    global.logManager.PrintLogMessage("BusManager", "UpdatePublicBusLocation", "update routine name: " + busRoutineName + " api info: " + JSON.stringify(openApiInfo), global.defineManager.LOG_LEVEL_DEBUG)
}