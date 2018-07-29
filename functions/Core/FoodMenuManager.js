exports.UploadFoodMenuImage = function (admin, uploadFile, requestBodyInfo, callbackFunc) {
    if(uploadFile != null) {
        global.logManager.PrintLogMessage("FoodMenuManager", "UploadFoodMenuImage", "file uploaded name: " +
            uploadFile.originalname, global.defineManager.LOG_LEVEL_DEBUG)
        global.logManager.PrintLogMessage("FoodMenuManager", "UploadFoodMenuImage", "uploader user key: " +
            requestBodyInfo["userKey"] + " type: " + requestBodyInfo["imgType"], global.defineManager.LOG_LEVEL_DEBUG)

        if(callbackFunc != null) {
            callbackFunc(global.defineManager.MESSAGE_SUCCESS)
        }
    }
    else {
        global.logManager.PrintLogMessage("FoodMenuManager", "UploadFoodMenuImage", "failed to upload image", global.defineManager.LOG_LEVEL_WARN)

        if(callbackFunc != null) {
            callbackFunc(global.defineManager.MESSAGE_FAILED)
        }
    }
}