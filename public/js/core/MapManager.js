function MapManager() {
    PrintLogMessage("MapManager", "MapManager", "init", LOG_LEVEL_INFO)
    this.dataTransferManager = new DataTransferManager()
}

MapManager.prototype.GetBusLocation = function () {
    PrintLogMessage("MapManager", "GetBusLocation", "getting bus location data", LOG_LEVEL_INFO)
    this.dataTransferManager.GetRequestWithCallbackFunc(
        DOMAIN + SUB_DOMAIN_PATH_PUBLIC + "busLocation",
        "",
        this.GetBusLocationOk,
        this.GetBusLocationFail
    )
}

MapManager.prototype.GetBusLocationOk = function (data) {

    ResetMark()

    dataStatusCode = data["code"]
    PrintLogMessage("MapManager", "GetBusLocation", "getting bus location data successfully, code: " + dataStatusCode, LOG_LEVEL_INFO)

    busLocList = data["data"]["list"]

    for(index in busLocList) {
        PrintLogMessage("MapManager", "GetBusLocation",
            "check index of bus pos: " + busLocList[index]["lat"] + " " + busLocList[index]["lon"], LOG_LEVEL_DEBUG)

        PushMark(map, Number(busLocList[index]["lat"]), Number(busLocList[index]["lon"]))
    }
}

MapManager.prototype.GetBusLocationFail = function (errorText, errorStatus) {
    PrintLogMessage("MapManager", "GetBusLocation", "something wrong with getting bus data", LOG_LEVEL_WARN)
}

MapManager.prototype.UpdateBusLocation = function () {
    PrintLogMessage("MapManager", "UpdateBusLocation", "update bus location data", LOG_LEVEL_INFO)
    this.dataTransferManager.GetRequestWithCallbackFunc(
        DOMAIN + SUB_DOMAIN_PATH_PUBLIC + "updateBusLocation",
        "",
        this.UpdateBusLocationOk,
        this.UpdateBusLocationFail
    )
}

MapManager.prototype.UpdateBusLocationOk = function (data) {
    PrintLogMessage("MapManager", "UpdateBusLocationOk", "update pending successfully", LOG_LEVEL_INFO)
}

MapManager.prototype.UpdateBusLocationFail = function (errorText, errorStatus) {
    PrintLogMessage("MapManager", "UpdateBusLocationFail", "update pending failed", LOG_LEVEL_WARN)
}