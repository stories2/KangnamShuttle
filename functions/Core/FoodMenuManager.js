exports.UploadFoodMenuImage = function (admin, bucketManager, uploadFile, requestBodyInfo, uploaderEmail, callbackFunc) {
    uploadFileType = requestBodyInfo["imgType"]
    if(uploadFile != null && uploadFileType != null) {
        global.logManager.PrintLogMessage("FoodMenuManager", "UploadFoodMenuImage", "file uploaded name: " +
            uploadFile.originalname, global.defineManager.LOG_LEVEL_DEBUG)
        global.logManager.PrintLogMessage("FoodMenuManager", "UploadFoodMenuImage", "uploader user key: " +
            requestBodyInfo["userKey"] + " type: " + requestBodyInfo["imgType"], global.defineManager.LOG_LEVEL_DEBUG)

        this.UploadFileToGoogleStorage(uploadFile, bucketManager)
            .then(function (success) {
                global.logManager.PrintLogMessage("FoodMenuManager", "UploadFoodMenuImage", "file upload successfully url: " + success, global.defineManager.LOG_LEVEL_DEBUG)

                foodMenuDatabasePath = global.util.format(global.defineManager.DATABASE_SERVICE_V2_0_0_FOOD_MENU_PATH, uploadFileType)
                global.logManager.PrintLogMessage("FoodMenuManager", "UploadFoodMenuImage", "food menu database path: " + foodMenuDatabasePath, global.defineManager.LOG_LEVEL_DEBUG)

                date = new Date()
                var currentDate = date
                date = new Date(currentDate.valueOf() + global.defineManager.GMT_KOREA_TIME_MIN * global.defineManager.HOUR_TO_MILE)
                dateStr = date.toISOString()

                foodMenuData = {}
                foodMenuData[uploadFileType + "Img"] = success
                foodMenuData[uploadFileType + "LastUploadDateTime"] = dateStr
                foodMenuData[uploadFileType + "LastUploader"] = uploaderEmail

                global.logManager.PrintLogMessage("FoodMenuManager", "UploadFoodMenuImage", "set food menu data: " + JSON.stringify(foodMenuData), global.defineManager.LOG_LEVEL_DEBUG)

                admin.database().ref(foodMenuDatabasePath).set(foodMenuData)
                if(callbackFunc != null) {
                    callbackFunc(global.defineManager.MESSAGE_SUCCESS, success)
                }
            })
            .catch(function (except) {
                global.logManager.PrintLogMessage("FoodMenuManager", "UploadFoodMenuImage", "failed to upload file: " + except, global.defineManager.LOG_LEVEL_ERROR)

                if(callbackFunc != null) {
                    callbackFunc(global.defineManager.MESSAGE_FAILED)
                }
            })
    }
    else {
        global.logManager.PrintLogMessage("FoodMenuManager", "UploadFoodMenuImage", "failed to upload image", global.defineManager.LOG_LEVEL_WARN)

        if(callbackFunc != null) {
            callbackFunc(global.defineManager.MESSAGE_FAILED)
        }
    }
}

exports.UploadFileToGoogleStorage = function (file, bucket) {
    subPromise = new Promise(function (resolve, reject) {
        if(file == null) {
            global.logManager.PrintLogMessage("FoodMenuManager", "UploadFileToGoogleStorage", "file not exist", global.defineManager.LOG_LEVEL_WARN)
            reject('no file');
        }

        newFileName = file.originalname + "_" + Date.now();

        global.logManager.PrintLogMessage("FoodMenuManager", "UploadFileToGoogleStorage", "new file name: " + newFileName, global.defineManager.LOG_LEVEL_DEBUG)

        fileUploader = bucket.file(global.defineManager.BUCKET_FOOD_MENU_PATH + newFileName)

        blobStream = fileUploader.createWriteStream({
            metadata: {
                contentType: file.mimetype
            }
        })

        blobStream.on('error', function (error) {
            global.logManager.PrintLogMessage("FoodMenuManager", "UploadFileToGoogleStorage", "cannot upload file to google server except: " + error, global.defineManager.LOG_LEVEL_ERROR)
            reject('error: ' + error)
        })

        blobStream.on('finish', function () {
            urlStr = "https://storage.googleapis.com/kangnamshuttle.appspot.com/" + fileUploader.name
            global.logManager.PrintLogMessage("FoodMenuManager", "UploadFileToGoogleStorage", "file uploaded successfully url: " + urlStr, global.defineManager.LOG_LEVEL_DEBUG)

            targetFileDownloadLink = fileUploader.getSignedUrl({
                action: 'read',
                expires: '03-09-2491'
            })
                .then(function (signedDownloadUrl) {
                    global.logManager.PrintLogMessage("FoodMenuManager", "DownloadFile", "i found that file url: " + signedDownloadUrl, global.defineManager.LOG_LEVEL_DEBUG)
                    resolve(signedDownloadUrl)
                })
                .catch(function (except) {
                    global.logManager.PrintLogMessage("FoodMenuManager", "DownloadFile", "there is something wrong: " + except, global.defineManager.LOG_LEVEL_ERROR)
                    reject('error: ' + except)
                })
        })

        blobStream.end(file.buffer)
    })

    return subPromise
}

exports.GenerateUpdateFoodMenuUrl = function (currentRoutineLinkItem, currentUserKey, callbackFunc) {
    global.logManager.PrintLogMessage("FoodMenuManager", "GenerateUpdateFoodMenuUrl", "generate user update food menu url", global.defineManager.LOG_LEVEL_INFO)
    generatedUrl = global.util.format(currentRoutineLinkItem["labelUrl"], currentUserKey)
    global.logManager.PrintLogMessage("FoodMenuManager", "GenerateUpdateFoodMenuUrl", "here is your url: " + generatedUrl, global.defineManager.LOG_LEVEL_DEBUG)

    if(callbackFunc != null) {
        callbackFunc(generatedUrl)
    }
}