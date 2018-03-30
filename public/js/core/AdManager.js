function AdManager() {
    PrintLogMessage("AdManager", "AdManager", "init", LOG_LEVEL_INFO)
    this.dataTransferManager = new DataTransferManager()

    this.tableRowList = []
}

AdManager.prototype.RequestGetListOfAd = function () {
    PrintLogMessage("AdManager", "RequestGetListOfAd", "getting list of ad", LOG_LEVEL_INFO)
    this.dataTransferManager.GetRequest(
        DOMAIN + "getListOfAdvertise",
        "",
        this)
}

AdManager.prototype.RequestSuccess = function (data) {
    jsonParsedData = JSON.parse(data)
    dataLen = jsonParsedData.length
    PrintLogMessage("AdManager", "RequestSuccess", "data received successfully len: " + dataLen, LOG_LEVEL_INFO)
    for(key in jsonParsedData) {
        PrintLogMessage("AdManager", "RequestSuccess", "check data: " + jsonParsedData[key], LOG_LEVEL_DEBUG)
        indexOfAd = jsonParsedData[key]

        obj = $(".template-of_schedule-status").clone()
        obj.attr("class", "indexOfRow")
        obj.removeAttr("hidden")
        obj.find(".adTime").text(indexOfAd["time"])
        obj.find(".adText").text(indexOfAd["text"])
        obj.find(".adDuration").text(indexOfAd["duration"])
        if(indexOfAd["enable"] == ENABLE) {
            obj.find(".adEnable").text(ACTIVE_STR)
        }
        else if(indexOfAd["enable"] == DISABLE) {
            obj.find(".adEnable").text(DEACTIVE_STR)
        }
        this.tableRowList.push(obj.appendTo(".schedule-status-tbody"))
    }

}

AdManager.prototype.RequestFail = function (responseText, status) {
    PrintLogMessage("AdManager", "RequestSuccess", "response text: " + responseText, LOG_LEVEL_WARN)
}

AdManager.prototype.RequestReservateAd = function (formData) {
    PrintLogMessage("AdManager", "RequestReservateAd", "request new reservate accepted", LOG_LEVEL_INFO)
    this.dataTransferManager.PostRequestWithCallbackFunc(
        DOMAIN + "reservateAdvertise",
        formData,
        this.ReservateRequestSuccess,
        this.ReservateRequestFail)
}

AdManager.prototype.ReservateRequestSuccess = function (data) {
    jsonParsedData = data
    dataLen = 0
    for(key in jsonParsedData){
        dataLen += 1
    }
    PrintLogMessage("AdManager", "ReservateRequestSuccess", "data received successfully len: " + dataLen, LOG_LEVEL_INFO)
    alert(jsonParsedData["msg"])
}

AdManager.prototype.ReservateRequestFail = function (responseText, status) {
    PrintLogMessage("AdManager", "ReservateRequestFail", "response text: " + responseText, LOG_LEVEL_WARN)
}