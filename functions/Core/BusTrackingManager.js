exports.PostfixUpdateUbikanBusData = function (admin, busTrackingManager, ubikanRequestData) {
    global.logManager.PrintLogMessage("BusTrackingManager", "PostfixUpdateUbikanBusData", "try update ubikan bus data",
        global.defineManager.LOG_LEVEL_DEBUG)
    busTrackingManager.LoginUbikan(admin, busTrackingManager, ubikanRequestData)
}

exports.LoginUbikan = function (admin, busTrackingManager, ubikanRequestData) {
    var httpManager = require("http")

    postData = ubikanRequestData["loginInfo"]
    global.logManager.PrintLogMessage("BusTrackingManager", "LoginUbikan", "checking login info: " + postData,
        global.defineManager.LOG_LEVEL_DEBUG)

    fakeHeaderOptions = {
        hostname: 'new.ubikhan.com',
        path: '/member/login',
        port: '80',
        method: 'POST',
        // referer: "http://new.ubikhan.com/member/login?request_url=map",
        Referer: "http://new.ubikhan.com/member/login?request_url=map",
        headers: {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.162 Safari/537.36",
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData,'utf8'),
            'Referer': "http://new.ubikhan.com/member/login?request_url=map",
            "Connection": "keep-alive",
            "Pragma": "no-cache",
            "Cache-Control": "no-cache",
            "Upgrade-Insecure-Requests": "1",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9,ko;q=0.8",
            // "Cookie": sessionId
        }
    }

    httpRequestCallback = function(httpRequestResponse) {
        global.logManager.PrintLogMessage("BusTrackingManager", "LoginUbikan",
            "status code: " + httpRequestResponse.statusCode + " headers: " + httpRequestResponse.headers, global.defineManager.LOG_LEVEL_INFO)

        // for(key in httpRequestResponse.headers) {
        //     console.log("key: " + key + " val: " + httpRequestResponse.headers[key])
        // }
        var str = ''
        httpRequestResponse.on('data', function (chunk) {
            str += chunk;
        });

        httpRequestResponse.on('end', function () {
            // console.log(str);
            global.logManager.PrintLogMessage("BusTrackingManager", "LoginUbikan", "response accepted: " + str,
                global.defineManager.LOG_LEVEL_DEBUG)

            busTrackingManager.CheckLoggedInUbikan(admin, httpRequestResponse.headers["set-cookie"], busTrackingManager, ubikanRequestData)
        });
        httpRequestResponse.on('error', function (except) {
            global.logManager.PrintLogMessage("BusTrackingManager", "LoginUbikan", "somthing goes wrong: " + except,
                global.defineManager.LOG_LEVEL_ERROR)
        })
    }

    var httpRequest = httpManager.request(fakeHeaderOptions, httpRequestCallback);
//This is the data we are posting, it needs to be a string or a buffer
//     httpRequest.write(JSON.stringify(postData));
    httpRequest.write(postData);
    httpRequest.end();
}

exports.CheckLoggedInUbikan = function (admin, cookieData, busTrackingManager, ubikanRequestData) {
    var httpManager = require("http")

    global.logManager.PrintLogMessage("BusTrackingManager", "CheckLoggedInUbikan", "cookie val: " + cookieData,
        global.defineManager.LOG_LEVEL_DEBUG)

    fakeHeaderOptions = {
        hostname: 'new.ubikhan.com',
        path: '/member/check_logged',
        port: '80',
        method: 'POST',
        headers: {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.162 Safari/537.36",
            'Content-Type': 'application/x-www-form-urlencoded',
            "Connection": "keep-alive",
            "Pragma": "no-cache",
            "Cache-Control": "no-cache",
            "Upgrade-Insecure-Requests": "1",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9,ko;q=0.8",
            "Cookie": cookieData
        }
    }

    httpRequestCallback = function(httpRequestResponse) {
        global.logManager.PrintLogMessage("BusTrackingManager", "CheckLoggedInUbikan",
            "status code: " + httpRequestResponse.statusCode + " headers: " + httpRequestResponse.headers, global.defineManager.LOG_LEVEL_INFO)

        var str = ''
        httpRequestResponse.on('data', function (chunk) {
            str += chunk;
        });

        httpRequestResponse.on('end', function () {
            // console.log(str);
            global.logManager.PrintLogMessage("BusTrackingManager", "CheckLoggedInUbikan", "response accepted: " + str,
                global.defineManager.LOG_LEVEL_DEBUG)

            ubikanLoginResponseData = JSON.parse(str)

            if(ubikanLoginResponseData["Logged In"] == true) {
                global.logManager.PrintLogMessage("BusTrackingManager", "CheckLoggedInUbikan", "successfully logged in",
                    global.defineManager.LOG_LEVEL_DEBUG)
                busTrackingManager.GetBusDataList(admin, cookieData, busTrackingManager, ubikanRequestData)
            }
            else {
                global.logManager.PrintLogMessage("BusTrackingManager", "CheckLoggedInUbikan", "login failed",
                    global.defineManager.LOG_LEVEL_WARN)
            }
        });
        httpRequestResponse.on('error', function (except) {
            global.logManager.PrintLogMessage("BusTrackingManager", "CheckLoggedInUbikan", "somthing goes wrong: " + except,
                global.defineManager.LOG_LEVEL_ERROR)
        })
    }

    var httpRequest = httpManager.request(fakeHeaderOptions, httpRequestCallback);
    httpRequest.end();
}

exports.GetBusDataList = function (admin, cookieData, busTrackingManager, ubikanRequestData) {
    var httpManager = require("http")

    global.logManager.PrintLogMessage("BusTrackingManager", "GetBusDataList", "get realtime bus data param: " + ubikanRequestData["apiParam"],
        global.defineManager.LOG_LEVEL_DEBUG)

    postData = ubikanRequestData["apiParam"]

    fakeHeaderOptions = {
        hostname: 'new.ubikhan.com',
        path: '/my_ubikhan/car_status',
        port: '80',
        method: 'POST',
        // referer: "http://new.ubikhan.com/member/login?request_url=map",
        Referer: "http://new.ubikhan.com/map",
        headers: {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.162 Safari/537.36",
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData,'utf8'),
            'Referer': "http://new.ubikhan.com/map",
            "Connection": "keep-alive",
            "Pragma": "no-cache",
            "Cache-Control": "no-cache",
            "Upgrade-Insecure-Requests": "1",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9,ko;q=0.8",
            "Cookie": cookieData
        }
    }

    httpRequestCallback = function(httpRequestResponse) {
        global.logManager.PrintLogMessage("BusTrackingManager", "GetBusDataList",
            "status code: " + httpRequestResponse.statusCode + " headers: " + httpRequestResponse.headers, global.defineManager.LOG_LEVEL_INFO)

        // for(key in httpRequestResponse.headers) {
        //     console.log("key: " + key + " val: " + httpRequestResponse.headers[key])
        // }
        var str = ''
        httpRequestResponse.on('data', function (chunk) {
            str += chunk;
        });

        httpRequestResponse.on('end', function () {
            // console.log(str);
            global.logManager.PrintLogMessage("BusTrackingManager", "GetBusDataList", "response accepted len: " + str.length,
                global.defineManager.LOG_LEVEL_DEBUG)

            if(!str.includes('The wrong path')) {

                busTrackingData = JSON.parse(str)
                if(busTrackingData["result"] == true) {
                    global.logManager.PrintLogMessage("BusTrackingManager", "GetBusDataList", "getting bus realtime data successfully",
                        global.defineManager.LOG_LEVEL_DEBUG)
                    busTrackingManager.SaveUbikanRealtimeData(admin, busTrackingData)
                }
                else {
                    global.logManager.PrintLogMessage("BusTrackingManager", "GetBusDataList", "something wrong with bus data: " + JSON.stringify(busTrackingData),
                        global.defineManager.LOG_LEVEL_WARN)
                }
            }
            else {
                global.logManager.PrintLogMessage("BusTrackingManager", "GetBusDataList", "something gonna wrong: " + str,
                    global.defineManager.LOG_LEVEL_WARN)
            }

        });
        httpRequestResponse.on('error', function (except) {
            global.logManager.PrintLogMessage("BusTrackingManager", "GetBusDataList", "somthing goes wrong: " + except,
                global.defineManager.LOG_LEVEL_ERROR)
        })
    }

    var httpRequest = httpManager.request(fakeHeaderOptions, httpRequestCallback);
    httpRequest.write(postData);
    httpRequest.end();
}

exports.SaveUbikanRealtimeData = function (admin, busTrackingData) {
    global.logManager.PrintLogMessage("BusTrackingManager", "SaveUbikanRealtimeData", "save ubikan bus tracking data to database",
        global.defineManager.LOG_LEVEL_DEBUG)

    date = new Date()
    var currentDate = date
    date = new Date(currentDate.valueOf() + global.defineManager.GMT_KOREA_TIME_MIN * global.defineManager.HOUR_TO_MILE)
    dateStr = date.toISOString()
    busTrackingData["updatedDateTime"] = dateStr

    status = admin.database().ref(global.defineManager.DATABASE_SERVICE_V2_0_0_BUS_LOCATION_PATH).set(busTrackingData);
    global.logManager.PrintLogMessage("BusTrackingManager", "SaveUbikanRealtimeData", "whatever i am done!",
        global.defineManager.LOG_LEVEL_DEBUG)
}

exports.GetUbikanRealtimeData = function (databaseSnapshot) {
    global.logManager.PrintLogMessage("BusTrackingManager", "GetUbikanRealtimeData", "return latest ubikan bus data from database",
        global.defineManager.LOG_LEVEL_INFO)
    return databaseSnapshot
}