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

exports.UpdateAllPublicBusLocation = function(admin, openApiInfo) {
    var httpManager = require("http");
    var x2js = require("x2js")
    convertManager = require('../Utils/ConvertManager');

    x2jsManager = new x2js()
    global.logManager.PrintLogMessage("BusManager", "UpdatePublicBusLocation", "bus api info: " + JSON.stringify(openApiInfo), global.defineManager.LOG_LEVEL_DEBUG)

    admin.database().ref(global.defineManager.DATABASE_SERVICE_V2_0_0_PUBLIC_BUS_STATION_PATH).once('value', function(publicBusStationListSnapshot) {
        publicBusStationListSnapshot = JSON.parse(JSON.stringify(publicBusStationListSnapshot))

        for(key in publicBusStationListSnapshot) {
            publicBusStation = publicBusStationListSnapshot[key]
            stationId = publicBusStation["id"]
            for(busRoutineName in publicBusStation["busRoutines"]) {
                global.logManager.PrintLogMessage("BusManager", "UpdatePublicBusLocation", "debug: " + JSON.stringify(publicBusStation), global.defineManager.LOG_LEVEL_DEBUG)
                publicBusRoutine = publicBusStation["busRoutines"][busRoutineName]
                global.logManager.PrintLogMessage("BusManager", "UpdatePublicBusLocation", "name: " + busRoutineName + " routine: " + publicBusRoutine, global.defineManager.LOG_LEVEL_DEBUG)
                openApiPath = global.util.format(openApiInfo["endpoint_path"], openApiInfo["key"], publicBusRoutine)
                publicBusLocationPath = global.util.format(global.defineManager.DATABASE_SERVICE_V2_0_0_PUBLIC_BUS_LOCATION_INFO_PATH, stationId, publicBusRoutine)
                global.logManager.PrintLogMessage("BusManager", "UpdatePublicBusLocation", "db path: " + publicBusLocationPath, global.defineManager.LOG_LEVEL_DEBUG)

                fakeHeaderOptions = {
                    hostname: openApiInfo["endpoint"],
                    path: openApiPath,
                }

                global.logManager.PrintLogMessage("BusManager", "UpdatePublicBusLocation", "api request rdy: " + JSON.stringify(fakeHeaderOptions), global.defineManager.LOG_LEVEL_DEBUG)

                httpRequestCallback = function(httpRequestResponse, publicBusLocationPath) {
                    global.logManager.PrintLogMessage("BusManager", "httpRequestCallback",
                        "status code: " + httpRequestResponse.statusCode + " headers: " + httpRequestResponse.headers, global.defineManager.LOG_LEVEL_DEBUG)
                    global.logManager.PrintLogMessage("BusManager", "httpRequestCallback","public bus loc db path: " + publicBusLocationPath, global.defineManager.LOG_LEVEL_DEBUG)

                    var str = ''
                    httpRequestResponse.on('data', function (chunk) {
                        str += chunk;
                    });

                    httpRequestResponse.on('end', function () {
                        // console.log(str);
                        // global.logManager.PrintLogMessage("BusManager", "httpRequestCallback", "response accepted: " + str,
                        //     global.defineManager.LOG_LEVEL_DEBUG)

                        busResponseInfo = x2jsManager.xml2js(str)
                        openApiResponseCode = busResponseInfo["ServiceResult"]["msgHeader"]["headerCd"]
                        if(openApiResponseCode == global.defineManager.PUBLIC_BUS_OPEN_API_RESULT_OK) {

                            global.logManager.PrintLogMessage("BusManager", "httpRequestCallback", "bus location info save path: " + publicBusLocationPath + " code: " + openApiResponseCode,
                                global.defineManager.LOG_LEVEL_DEBUG)

                            busResponseInfo["updatedDateTime"] = convertManager.ConvertDateTimeToStr()

                            admin.database().ref(publicBusLocationPath).set(busResponseInfo)
                        }
                        else {
                            global.logManager.PrintLogMessage("BusManager", "httpRequestCallback", "api returns wrong code: " + openApiResponseCode,
                                global.defineManager.LOG_LEVEL_WARN)
                        }

                    });
                    httpRequestResponse.on('error', function (except) {
                        global.logManager.PrintLogMessage("BusManager", "httpRequestCallback", "somthing goes wrong: " + except,
                            global.defineManager.LOG_LEVEL_ERROR)
                    })
                }
                let dbPath = publicBusLocationPath
                global.logManager.PrintLogMessage("BusManager", "httpRequestCallback", "station id: " + stationId + " bus routine: " + publicBusRoutine + " let db path: " + dbPath, global.defineManager.LOG_LEVEL_DEBUG)
                var httpRequest = httpManager.request(fakeHeaderOptions, function(httpRequestResponse) {
                    httpRequestCallback(httpRequestResponse, dbPath)
                });
                httpRequest.end();

                // break;
            }
        }
    })
}

exports.UpdatePublicBusLocation = function(admin, busRoutineName, openApiInfo) {
    var httpManager = require("http");
    var x2js = require("x2js")
    convertManager = require('../Utils/ConvertManager');

    x2jsManager = new x2js()
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
                publicBusLocationPath = global.util.format(global.defineManager.DATABASE_SERVICE_V2_0_0_PUBLIC_BUS_LOCATION_INFO_PATH, openApiInfo["stationId"], publicBusRoutine)

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

                        busResponseInfo = x2jsManager.xml2js(str)
                        openApiResponseCode = busResponseInfo["ServiceResult"]["msgHeader"]["headerCd"]
                        if(openApiResponseCode == global.defineManager.PUBLIC_BUS_OPEN_API_RESULT_OK) {

                            global.logManager.PrintLogMessage("BusManager", "httpRequestCallback", "bus location info save path: " + publicBusLocationPath + " code: " + openApiResponseCode,
                                global.defineManager.LOG_LEVEL_DEBUG)

                            busResponseInfo["updatedDateTime"] = convertManager.ConvertDateTimeToStr()

                            admin.database().ref(publicBusLocationPath).set(busResponseInfo)
                        }
                        else {
                            global.logManager.PrintLogMessage("BusManager", "httpRequestCallback", "api returns wrong code: " + openApiResponseCode,
                                global.defineManager.LOG_LEVEL_WARN)
                        }

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

exports.GetLatestPublicBusLocation = function (admin, busRoutineName, openApiInfo, callbackFunc) {

    stationId = openApiInfo["stationId"]
    updatedDateTime = "---"
    thisPublicBusLoc = "---"
    nextPublicBusLoc = "---"

    admin.database().ref(global.defineManager.DATABASE_SERVICE_V2_0_0_PUBLIC_BUS_STATION_PATH).once('value', function(publicBusStationListSnapshot) {
        publicBusStationListSnapshot = JSON.parse(JSON.stringify(publicBusStationListSnapshot))

        for(key in publicBusStationListSnapshot) {
            publicBusStation = publicBusStationListSnapshot[key]
            if(publicBusStation["id"] == stationId) {
                global.logManager.PrintLogMessage("BusManager", "GetLatestPublicBusLocation", "debug: " + JSON.stringify(publicBusStation), global.defineManager.LOG_LEVEL_DEBUG)
                publicBusRoutine = publicBusStation["busRoutines"][busRoutineName]
                publicBusLocationPath = global.util.format(global.defineManager.DATABASE_SERVICE_V2_0_0_PUBLIC_BUS_LOCATION_INFO_PATH, stationId, publicBusRoutine)

                admin.database().ref(publicBusLocationPath).once('value', function(savedPublicBusLocationSnapshot) {

                    savedPublicBusLocationSnapshot = JSON.parse(JSON.stringify(savedPublicBusLocationSnapshot))

                    if(savedPublicBusLocationSnapshot != null) {

                        updatedDateTime = savedPublicBusLocationSnapshot["updatedDateTime"]

                        for(index in savedPublicBusLocationSnapshot["ServiceResult"]["msgBody"]["itemList"]) {
                            indexOfStation = savedPublicBusLocationSnapshot["ServiceResult"]["msgBody"]["itemList"][index]
                            if(indexOfStation["stId"] == stationId) {
                                global.logManager.PrintLogMessage("BusManager", "GetLatestPublicBusLocation", "found station id: " + stationId + " at: " + index, global.defineManager.LOG_LEVEL_DEBUG)
                                thisPublicBusLoc = indexOfStation["arrmsg1"]
                                nextPublicBusLoc = indexOfStation["arrmsg2"]
                                break;
                            }
                        }
                    }

                    if(callbackFunc !== undefined) {
                        callbackFunc(busRoutineName, thisPublicBusLoc, nextPublicBusLoc, updatedDateTime)
                    }
                })
                break;
            }
        }
    })
}

exports.GeneratePublicBusInfoStr = function (responseStr, busRoutineName, thisPublicBusLoc, nextPublicBusLoc, updatedDateTime, callbackFunc) {
    responseStr = global.util.format(responseStr, busRoutineName, thisPublicBusLoc, nextPublicBusLoc, updatedDateTime)
    if(callbackFunc !== undefined) {
        callbackFunc(responseStr)
    }
}