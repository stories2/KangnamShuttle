exports.UploadFoodMenuImage = function (admin, bucketManager, foodMenuManager, request, busboy, tmpdir, requestBodyInfo, uploaderEmail, callbackFunc) {

    const path = require('path');
    const fs = require('fs');
    // This object will accumulate all the fields, keyed by their name
    const fields = {};

    // This object will accumulate all the uploaded files, keyed by their name.
    const uploads = {};

    // This code will process each non-file field in the form.
    busboy.on('field', function(fieldname, val) {
        // TODO(developer): Process submitted field values here
        console.log(`Processed field ${fieldname}: ${val}.`);
        fields[fieldname] = val;
    });

    // This code will process each file uploaded.
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        // Note: os.tmpdir() points to an in-memory file system on GCF
        // Thus, any files in it must fit in the instance's memory.
        console.log(`Processed file ${filename}`);
        const filepath = path.join(tmpdir, filename);
        uploads[fieldname] = filepath;
        fileStream = fs.createWriteStream(filepath)

        var fileBuffer = new Buffer('')
        file.on('data', function (data) {
            fileBuffer = Buffer.concat([fileBuffer, data])
        })

        file.on('end', function() {
            const file_object = {
                fieldname,
                originalname: filename,
                encoding,
                mimetype,
                buffer: fileBuffer,
            }

            global.logManager.PrintLogMessage("FoodMenuManager", "UploadFoodMenuImage", "fileObj generated field name: " +
                fieldname + " file name: " + filename + " encoding: " + encoding + " mimetype: " + mimetype, global.defineManager.LOG_LEVEL_DEBUG)

            foodMenuManager.UploadFileToGoogleStorage(file_object, bucketManager)
                .then(function (success) {
                    global.logManager.PrintLogMessage("FoodMenuManager", "UploadFoodMenuImage", "success url: " + success, global.defineManager.LOG_LEVEL_DEBUG)

                    date = new Date()
                    var currentDate = date
                    date = new Date(currentDate.valueOf() + global.defineManager.GMT_KOREA_TIME_MIN * global.defineManager.HOUR_TO_MILE)
                    dateStr = date.toISOString()

                    uploadFileType = fields["imgType"]

                    foodMenuData = {}
                    foodMenuData[uploadFileType + "Img"] = success
                    foodMenuData[uploadFileType + "LastUploadDateTime"] = dateStr
                    foodMenuData[uploadFileType + "LastUploader"] = uploaderEmail

                    global.logManager.PrintLogMessage("FoodMenuManager", "UploadFoodMenuImage", "set food menu data: " + JSON.stringify(foodMenuData), global.defineManager.LOG_LEVEL_DEBUG)

                    foodMenuDatabasePath = global.util.format(global.defineManager.DATABASE_SERVICE_V2_0_0_FOOD_MENU_PATH, uploadFileType)

                    global.logManager.PrintLogMessage("FoodMenuManager", "UploadFoodMenuImage", "upload food menu type: " + uploadFileType, global.defineManager.LOG_LEVEL_DEBUG)

                    admin.database().ref(foodMenuDatabasePath).set(foodMenuData)

                    callbackFunc(global.defineManager.MESSAGE_SUCCESS)
                })
                .catch(function (except) {

                    global.logManager.PrintLogMessage("FoodMenuManager", "UploadFoodMenuImage", "failed to upload: " + except, global.defineManager.LOG_LEVEL_ERROR)
                    callbackFunc(global.defineManager.MESSAGE_FAILED)
                })

            request.file = file_object
        })
        file.pipe(fileStream);
    });

    // This event will be triggered after all uploaded files are saved.
    busboy.on('finish', function() {
        // TODO(developer): Process uploaded files here
        global.logManager.PrintLogMessage("FoodMenuManager", "UploadFoodMenuImage", "finished process field data: " + JSON.stringify(fields), global.defineManager.LOG_LEVEL_DEBUG)
        for (const name in uploads) {
            const file = uploads[name];

            global.logManager.PrintLogMessage("FoodMenuManager", "UploadFoodMenuImage", "finished process name: " + file, global.defineManager.LOG_LEVEL_DEBUG)

            fs.unlinkSync(file);
        }
        // res.send();
    });

    busboy.end(request.rawBody)
    request.pipe(busboy);
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
                contentType: "image/jpeg"
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