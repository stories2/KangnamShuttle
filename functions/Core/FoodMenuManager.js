exports.UploadFoodMenuImage = function (admin, uploadFile, requestBodyInfo) {
    if(uploadFile != null) {
        global.logManager.PrintLogMessage("FoodMenuManager", "UploadFoodMenuImage", "file uploaded name: " +
            uploadFile.originalname, global.defineManager.LOG_LEVEL_DEBUG)
        global.logManager.PrintLogMessage("FoodMenuManager", "UploadFoodMenuImage", "uploader user key: " +
            requestBodyInfo["userKey"] + " type: " + requestBodyInfo["imgType"], gloabl.defineManager.LOG_LEVEL_DEBUG)
    }
    else {
        global.logManager.PrintLogMessage("FoodMenuManager", "UploadFoodMenuImage", "failed to upload image", global.defineManager.LOG_LEVEL_WARN)
    }
}