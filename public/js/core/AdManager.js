function AdManager() {
    dataTransferManager = new DataTransferManager()
    dataTransferManager.GetRequest(
        DOMAIN + "getListOfAdvertise",
        "",
        this)
}

AdManager.prototype.RequestSuccess = function (data) {
    dataLen = data.length
    PrintLogMessage("AdManager", "RequestSuccess", "data received successfully len: " + dataLen, LOG_LEVEL_INFO)
}

AdManager.prototype.RequestFail = function (responseText, status) {
    PrintLogMessage("AdManager", "RequestSuccess", "response text: " + responseText, LOG_LEVEL_WARN)
}

adManager = new AdManager()
