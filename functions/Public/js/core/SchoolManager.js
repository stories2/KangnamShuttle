function SchoolManager() {
    this.dataTransferManager = new DataTransferManager()
}

SchoolManager.prototype.GetSchoolWifiInfo = function (callbackFunc) {
    PrintLogMessage("SchoolManager", "GetSchoolWifiInfo", "get school wifi info", LOG_LEVEL_INFO)

    dataTransferManagerClient = this.dataTransferManager

    authV2Manager.GetUserToken(function (idToken) {
        dataTransferManagerClient.GetRequestWithCallbackFunc(
            DOMAIN + SUB_DOMAIN_PATH_PRIVATE + API_PRIVATE_V2_WIFI_INFO,
            {},
            function (successResult) {
                PrintLogMessage("SchoolManager", "GetSchoolWifiInfo", "successfully get wifi info: " + JSON.stringify(successResult), LOG_LEVEL_DEBUG)
                if(callbackFunc !== undefined) {
                    callbackFunc(successResult)
                }
            },
            function (errorResult) {
                PrintLogMessage("SchoolManager", "GetSchoolWifiInfo", "failed to get wifi info: " + JSON.stringify(errorResult), LOG_LEVEL_ERROR)
            },idToken)
    })
}