exports.CurrentServiceInfo = function (admin, responseText, callbackFunc) {
    global.logManager.PrintLogMessage("SystemManager", "CurrentServiceInfo", "checking service info", global.defineManager.LOG_LEVEL_INFO)

    admin.database().ref(global.defineManager.DATABASE_SERVICE_V2_0_0_SYSTEM_INFO_PATH).once('value', function (serviceInfoSnapshot) {
        serviceInfoSnapshot = JSON.parse(JSON.stringify(serviceInfoSnapshot))
        responseText = global.util.format(
            responseText,
            serviceInfoSnapshot["version"],
            serviceInfoSnapshot["lastUpdate"],
            serviceInfoSnapshot["developer"],
            serviceInfoSnapshot["email"]
        )

        global.logManager.PrintLogMessage("SystemManager", "CurrentServiceInfo", "generated sys info str: " + responseText, global.defineManager.LOG_LEVEL_DEBUG)

        callbackFunc(responseText)
    })
}

exports.LatestServiceReleaseNote = function (admin, responseText, callbackFunc) {
    global.logManager.PrintLogMessage("SystemManager", "LatestServiceReleaseNote", "checking latest release note", global.defineManager.LOG_LEVEL_INFO)

    admin.database().ref(global.defineManager.DATABASE_SERVICE_V2_0_0_RELEASE_NOTE_PATH).once('value', function (releaseNoteSnapshot) {
        releaseNoteSnapshot = JSON.parse(JSON.stringify(releaseNoteSnapshot))
        releaseNoteStr = ""
        for(key in releaseNoteSnapshot) {
            releaseNoteStr = releaseNoteStr + "---" + key + "---\n"
            releaseNoteStr = releaseNoteStr + releaseNoteSnapshot[key] + "\n"
        }
        responseText = global.util.format(
            responseText,
            releaseNoteStr
        )
        global.logManager.PrintLogMessage("SystemManager", "LatestServiceReleaseNote", "generated release note str: " + responseText, global.defineManager.LOG_LEVEL_DEBUG)
        callbackFunc(responseText)
    })
}