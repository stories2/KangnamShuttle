exports.GetAllBusStation = function (admin, responseText, callbackFunc) {
    global.logManager.PrintLogMessage("BusManager", "GetAllBusStation", "checking bus station list", global.defineManager.LOG_LEVEL_INFO)

    admin.database().ref(global.defineManager.DATABASE_SERVICE_BUS_INFO_ROUTINE_PATH).once('value', function (busStationListSnapshot) {
        busStationListSnapshot = JSON.parse(JSON.stringify(busStationListSnapshot))
        responseText = global.util.format(
            responseText,
            busStationListSnapshot
        )

        global.logManager.PrintLogMessage("BusManager", "GetAllBusStation", "generated bus station list str: " + responseText, global.defineManager.LOG_LEVEL_DEBUG)

        callbackFunc(responseText)
    })
}

exports.UpdatePublicBusLocation = function(admin, busRoutineName, openApiInfo) {
    var httpManager = require("http");
    var x2js = require("x2js")
    global.logManager.PrintLogMessage("BusManager", "UpdatePublicBusLocation", "update routine name: " + busRoutineName + " api info: " + JSON.stringify(openApiInfo), global.defineManager.LOG_LEVEL_DEBUG)

    admin.database().ref(global.defineManager.DATABASE_SERVICE_V2_0_0_PUBLIC_BUS_STATION_PATH).once('value', function(publicBusStationListSnapshot) {
        publicBusStationListSnapshot = JSON.parse(JSON.stringify(publicBusStationListSnapshot))

        for(key in publicBusStationListSnapshot) {
            publicBusStation = publicBusStationListSnapshot[key]
            if(publicBusStation["id"] == openApiInfo["stationId"]) {
                global.logManager.PrintLogMessage("BusManager", "UpdatePublicBusLocation", "debug: " + JSON.stringify(publicBusStation), global.defineManager.LOG_LEVEL_DEBUG)
                publicBusRoutine = publicBusStation["busRoutines"][busRoutineName]
                global.logManager.PrintLogMessage("BusManager", "UpdatePublicBusLocation", "name: " + busRoutineName + " routine: " + publicBusRoutine, global.defineManager.LOG_LEVEL_DEBUG)
                openApiPath = global.util.format(openApiInfo["endpoint_path"], openApiInfo["key"], publicBusRoutine)
                publicBusLocationPath = global.util.format(global.defineManager.DATABASE_SERVICE_V2_0_0_PUBLIC_BUS_LOCATION_INFO_PATH, publicBusRoutine)

                fakeHeaderOptions = {
                    hostname: openApiInfo["endpoint"],
                    path: openApiPath,
                }

                global.logManager.PrintLogMessage("BusManager", "UpdatePublicBusLocation", "api request rdy: " + JSON.stringify(fakeHeaderOptions), global.defineManager.LOG_LEVEL_DEBUG)

                httpRequestCallback = function(httpRequestResponse) {
                    global.logManager.PrintLogMessage("BusManager", "httpRequestCallback",
                        "status code: " + httpRequestResponse.statusCode + " headers: " + httpRequestResponse.headers, global.defineManager.LOG_LEVEL_DEBUG)

                    var str = ''
                    httpRequestResponse.on('data', function (chunk) {
                        str += chunk;
                    });

                    httpRequestResponse.on('end', function () {
                        // console.log(str);
                        global.logManager.PrintLogMessage("BusManager", "httpRequestCallback", "response accepted: " + str,
                            global.defineManager.LOG_LEVEL_DEBUG)

                        busResponseInfo = x2js.xml2js(str)

                        global.logManager.PrintLogMessage("BusManager", "httpRequestCallback", "bus location info save path: " + publicBusLocationPath,
                            global.defineManager.LOG_LEVEL_DEBUG)

                        admin.database().ref(publicBusLocationPath).set(busResponseInfo)

                    });
                    httpRequestResponse.on('error', function (except) {
                        global.logManager.PrintLogMessage("BusManager", "httpRequestCallback", "somthing goes wrong: " + except,
                            global.defineManager.LOG_LEVEL_ERROR)
                    })
                }

                var httpRequest = httpManager.request(fakeHeaderOptions, httpRequestCallback);
                httpRequest.end();

                break;
            }
        }
    })




}