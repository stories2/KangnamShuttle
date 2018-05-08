exports.LoginUbikan = function (busTrackingManager, loginInfo) {
    var httpManager = require("http")

    postData = loginInfo
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

            busTrackingManager.CheckLoggedInUbikan(httpRequestResponse.headers["set-cookie"], busTrackingManager)
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

exports.CheckLoggedInUbikan = function (cookieData, busTrackingManager) {
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

exports.GetBusDataList = function (cookieData, busTrackingManager) {


    // fakeHeaderOptions = {
    //     hostname: 'new.ubikhan.com',
    //     path: '/member/login',
    //     port: '80',
    //     method: 'POST',
    //     // referer: "http://new.ubikhan.com/member/login?request_url=map",
    //     Referer: "http://new.ubikhan.com/map",
    //     headers: {
    //         "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.162 Safari/537.36",
    //         'Content-Type': 'application/x-www-form-urlencoded',
    //         'Content-Length': Buffer.byteLength(postData,'utf8'),
    //         'Referer': "http://new.ubikhan.com/map",
    //         "Connection": "keep-alive",
    //         "Pragma": "no-cache",
    //         "Cache-Control": "no-cache",
    //         "Upgrade-Insecure-Requests": "1",
    //         "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
    //         "Accept-Language": "en-US,en;q=0.9,ko;q=0.8",
    //         "Cookie": cookieData
    //     }
    // }
}