exports.GetTimeAdvertise = function (database, baseStr) {
    responseMessage = {}
    responseMessage["text"] = baseStr

    var currentDate = new Date();
    // var hour = (currentDate.getHours() + global.defineManager.GMT_KOREA_TIME) % global.defineManager.DAY_TO_HOUR
    currentTimezoneDate = new Date(currentDate.valueOf() + global.defineManager.GMT_KOREA_TIME_MIN * global.defineManager.HOUR_TO_MILE)
    currentHour = currentTimezoneDate.getHours()
    global.logManager.PrintLogMessage("AdvertiseManager", "GetTimeAdvertise",
        "current timezone time: " + currentTimezoneDate + " current hour: " + currentHour, global.defineManager.LOG_LEVEL_INFO)

    advertiseHourInfo = database[currentHour]
    advertiseDeadline = new Date(advertiseHourInfo["deadline"])
    advertiseStartDate = new Date(advertiseHourInfo["startDate"])
    dayOfWeek = advertiseHourInfo["dayOfWeek"]
    currentDay = currentTimezoneDate.getDay()

    if(currentTimezoneDate - advertiseStartDate >= global.defineManager.ZERO &&
        currentTimezoneDate - advertiseDeadline < global.defineManager.ZERO) {
        if(advertiseHourInfo["enable"] == global.defineManager.ENABLE &&
            dayOfWeek[currentDay] == global.defineManager.ENABLE) {
            global.logManager.PrintLogMessage("AdvertiseManager", "GetTimeAdvertise",
                "This advertisement still on going photo: " + advertiseHourInfo["photoEnable"] +
                " btn: " + advertiseHourInfo["messageButtonEnable"], global.defineManager.LOG_LEVEL_INFO)
            responseMessage["text"] = baseStr + "\n\n" + advertiseHourInfo["text"]
            if(advertiseHourInfo["photoEnable"] == global.defineManager.ENABLE) {
                responseMessage["photo"] = advertiseHourInfo["photo"]
            }
            if(advertiseHourInfo["messageButtonEnable"] == global.defineManager.ENABLE) {
                responseMessage["message_button"] = advertiseHourInfo["message_button"]
            }
        }
        else {
            global.logManager.PrintLogMessage("AdvertiseManager", "GetTimeAdvertise",
                "This advertisement was disabled", global.defineManager.LOG_LEVEL_WARN)
        }
    }
    else {
        global.logManager.PrintLogMessage("AdvertiseManager", "GetTimeAdvertise",
            "This advertisement closed", global.defineManager.LOG_LEVEL_WARN)
    }
    return responseMessage
}

exports.GetListOfAdvertise = function (database) {
    global.logManager.PrintLogMessage("AdvertiseManager", "GetListOfAdvertise",
        "listing advertise table", global.defineManager.LOG_LEVEL_INFO)
    listOfAdvertise = []
    for(advertiseIndexNumber in database) {
        indexOfAdvertise = database[advertiseIndexNumber]

        filteredAdvertise = {}
        filteredAdvertise["enable"] = indexOfAdvertise["enable"]
        filteredAdvertise["time"] = global.util.format("%d:00:00 ~ %d:59:59",
            advertiseIndexNumber, advertiseIndexNumber)
        if(filteredAdvertise["enable"] == global.defineManager.ENABLE) {
            filteredAdvertise["text"] = indexOfAdvertise["text"]
            filteredAdvertise["duration"] = global.util.format("%s ~ %s",
                indexOfAdvertise["startDate"], indexOfAdvertise["deadline"])
            global.logManager.PrintLogMessage("AdvertiseManager", "GetListOfAdvertise",
                "#" + advertiseIndexNumber + " this ad is enabled", global.defineManager.LOG_LEVEL_INFO)
        }
        else{
            filteredAdvertise["text"] = "N/A"
            filteredAdvertise["duration"] = global.util.format("%s ~ %s",
                "Empty", "Empty")
            global.logManager.PrintLogMessage("AdvertiseManager", "GetListOfAdvertise",
                "#" + advertiseIndexNumber + " this ad is not enabled", global.defineManager.LOG_LEVEL_WARN)
        }

        listOfAdvertise.push(filteredAdvertise)
    }

    return listOfAdvertise
}

exports.ReservateAdvertise = function (admin, response, requestBody) {
    global.logManager.PrintLogMessage("AdvertiseManager", "ReservateAdvertise", "reservate time: " + requestBody["adTime"],
        global.defineManager.LOG_LEVEL_INFO)
    admin.database().ref('/' + global.defineManager.DATABASE_ADVERTISE + '/' + requestBody["adTime"] + '/').once('value', function(snapshot) {
        databaseSnapshot = snapshot.val()

        indexOfAd = databaseSnapshot
        responseData = {}
        if(indexOfAd["enable"] == global.defineManager.ENABLE) {
            responseData["msg"] = global.defineManager.MSG_ALREADY_RESERVATED
        }
        else if(indexOfAd["enable"] == global.defineManager.DISABLE){
            savePointUrl = '/' + global.defineManager.DATABASE_ADVERTISE + '/' + requestBody["adTime"] + "/"

            dayOfWeek = [0, 0, 0, 0, 0, 0, 0]
            for(indexOfDay in requestBody["week"]) {
                dayOfWeek[requestBody["week"][indexOfDay]] = 1
            }
            indexOfAd["dayOfWeek"] = dayOfWeek

            startDate = new Date()
            startDate.setFullYear(requestBody["adStartYear"],
                requestBody["adStartMonth"] - 1,
                requestBody["adStartDay"])
            startDate.setUTCHours(0, 0, 0, 0)
            startDateStr = startDate.toISOString()
            indexOfAd["startDate"] = startDateStr

            endDate = new Date()
            endDate.setFullYear(requestBody["adEndYear"],
                requestBody["adEndMonth"] - 1,
                requestBody["adEndDay"])
            endDate.setUTCHours(0, 0, 0, 0)
            endDateStr = endDate.toISOString()
            indexOfAd["deadline"] = endDateStr

            indexOfAd["text"] = requestBody["textAd"]

            global.logManager.PrintLogMessage("AdvertiseManager", "ReservateAdvertise", "try to save reservate: " +
                savePointUrl + " start: " + startDateStr + " end: " + endDateStr,
                global.defineManager.LOG_LEVEL_INFO)
            status = admin.database().ref(savePointUrl).set(indexOfAd);
            responseData["msg"] = global.defineManager.MSG_SUCCESSFULLY_RESERVATED
        }
        response.setHeader('Content-Type', 'application/json');
        response.setHeader("Access-Control-Allow-Origin", "*")
        response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
        response.status(200).send(JSON.stringify(responseData))
    })
}