exports.PostfixUpdateSubwaySchedule = function (admin, subwayManager, subwayApiInfo, platformID, direction) {
    global.logManager.PrintLogMessage("SubwayManager", "PostfixUpdateSubwaySchedule", "update subway time info", global.defineManager.LOG_LEVEL_INFO)
    var httpManager = require("http");
    var convertManager = require("../Utils/ConvertManager");

    currentDayOfWeek = convertManager.ConvertCurrentDayOfWeekStartAtOne()
    openApiPath = global.util.format(subwayApiInfo["endpoint_path"],
        subwayApiInfo["key"], platformID, direction, currentDayOfWeek)

    fakeHeaderOptions = {
        hostname: subwayApiInfo["endpoint"],
        path: openApiPath,
        port: '8088',
    }

    httpRequestCallback = function(httpRequestResponse) {
        global.logManager.PrintLogMessage("SubwayManager", "httpRequestCallback",
            "status code: " + httpRequestResponse.statusCode + " headers: " + httpRequestResponse.headers, global.defineManager.LOG_LEVEL_DEBUG)

        var str = ''
        httpRequestResponse.on('data', function (chunk) {
            str += chunk;
        });

        httpRequestResponse.on('end', function () {
            // console.log(str);
            global.logManager.PrintLogMessage("SubwayManager", "httpRequestCallback", "response accepted: " + str,
                global.defineManager.LOG_LEVEL_DEBUG)

            subwayResponseInfo = JSON.parse(str)

            subwayManager.UpdateSubwayScheduleToDatabase(admin, subwayResponseInfo, platformID, direction)
        });
        httpRequestResponse.on('error', function (except) {
            global.logManager.PrintLogMessage("SubwayManager", "httpRequestCallback", "somthing goes wrong: " + except,
                global.defineManager.LOG_LEVEL_ERROR)
        })
    }

    var httpRequest = httpManager.request(fakeHeaderOptions, httpRequestCallback);
    httpRequest.end();
}

exports.UpdateSubwayScheduleToDatabase = function (admin, responseInfo, platformID, direction) {
    convertManager = require('../Utils/ConvertManager');

    global.logManager.PrintLogMessage("SubwayManager", "UpdateSubwayScheduleToDatabase",
        "save data platform ID: " + platformID + " dir: " + direction, global.defineManager.LOG_LEVEL_DEBUG)

    responseCode = responseInfo["SearchArrivalTimeOfLine2SubwayByIDService"]["RESULT"]["CODE"]

    if(responseCode == global.defineManager.SUBWAY_OPEN_API_RESULT_OK) {
        global.logManager.PrintLogMessage("SubwayManager", "UpdateSubwayScheduleToDatabase", "response code says ok, lets save data to database",
            global.defineManager.LOG_LEVEL_INFO)
        databasePath = global.util.format(global.defineManager.DATABASE_SERVICE_V2_0_0_SUBWAY_PLATFORM_INFO_PATH,
            platformID, direction)
        global.logManager.PrintLogMessage("SubwayManager", "UpdateSubwayScheduleToDatabase", "update path: " + databasePath,
            global.defineManager.LOG_LEVEL_DEBUG)

        saveSubwayData = {
            "updatedDateTime": convertManager.ConvertDateTimeToStr(),
            "data": responseInfo["SearchArrivalTimeOfLine2SubwayByIDService"]["row"]
        }
        admin.database().ref(databasePath).set(saveSubwayData);
        global.logManager.PrintLogMessage("SubwayManager", "UpdateSubwayScheduleToDatabase", "subway data updated",
            global.defineManager.LOG_LEVEL_INFO)
    }
    else {
        global.logManager.PrintLogMessage("SubwayManager", "UpdateSubwayScheduleToDatabase", "wrong response accepted code: " + responseCode,
            global.defineManager.LOG_LEVEL_WARN)
    }
}

exports.GetLastUpdatedSubwayScheduleInfo = function (admin, responseText, platformID, direction, callbackFunc) {
    global.logManager.PrintLogMessage("SubwayManager", "GetLastUpdatedSubwayScheduleInfo", "generate subway info str", global.defineManager.LOG_LEVEL_INFO)
    databasePath = global.util.format(global.defineManager.DATABASE_SERVICE_V2_0_0_SUBWAY_PLATFORM_INFO_PATH,
        platformID, direction)
    global.logManager.PrintLogMessage("SubwayManager", "GetLastUpdatedSubwayScheduleInfo", "database path: " + databasePath, global.defineManager.LOG_LEVEL_DEBUG)
    admin.database().ref(databasePath).once('value', function (subwayScheduleSnapshot) {
        subwayScheduleSnapshot = JSON.parse(JSON.stringify(subwayScheduleSnapshot))
        responseText = global.util.format(
            responseText,
            subwayScheduleSnapshot["data"][0]["SUBWAYNAME"],
            subwayScheduleSnapshot["data"][0]["TRAINCODE"],
            subwayScheduleSnapshot["data"][0]["ARRIVETIME"],
            subwayScheduleSnapshot["data"][1]["SUBWAYNAME"],
            subwayScheduleSnapshot["data"][1]["TRAINCODE"],
            subwayScheduleSnapshot["data"][1]["ARRIVETIME"],
            subwayScheduleSnapshot["updatedDateTime"]
        )
        global.logManager.PrintLogMessage("SubwayManager", "GetLastUpdatedSubwayScheduleInfo", "generated str: " + responseText, global.defineManager.LOG_LEVEL_DEBUG)
        callbackFunc(responseText)
    })
}