exports.PostfixUpdateSubwaySchedule = function (admin, subwayApiInfo, platformID, direction) {
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
        });
        httpRequestResponse.on('error', function (except) {
            global.logManager.PrintLogMessage("SubwayManager", "httpRequestCallback", "somthing goes wrong: " + except,
                global.defineManager.LOG_LEVEL_ERROR)
        })
    }

    var httpRequest = httpManager.request(fakeHeaderOptions, httpRequestCallback);
    httpRequest.end();
}