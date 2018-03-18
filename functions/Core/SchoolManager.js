exports.GetAcademicScheduleThisMonth = function (month, admin, convertManager, generateManager, responseApp, requestMessage, responseManager) {
    var requestManager = require("request")
    var cheerioManager = require("cheerio")
    var httpManager = require("http")

    global.logManager.PrintLogMessage("SchoolManager", "GetAcademicScheduleThisMonth",
        "init crawling module", global.defineManager.LOG_LEVEL_INFO)

    httpHeadersOptions = {
        hostname: "web.kangnam.ac.kr",
        path: "/menu/02be162adc07170ec7ee034097d627e9.do",
        method: "GET",
        headers: {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.162 Safari/537.36",
            'Content-Type': 'text/html',
            "Connection": "keep-alive",
            "Pragma": "no-cache",
            "Cache-Control": "no-cache",
            "Upgrade-Insecure-Requests": "1",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
            "Referer": "http://web.kangnam.ac.kr/",
            "Accept-Language": "en-US,en;q=0.9,ko;q=0.8"
        }
    }

    httpManager.get(httpHeadersOptions, function(res) {
        // console.log('statusCode:', res.statusCode);
        // console.log('headers:', res.headers);
        // console.log('headers:', res.headers["set-cookie"]);

        global.logManager.PrintLogMessage("SchoolManager", "GetAcademicScheduleThisMonth",
            "index.do getting http statusCode: " + res.statusCode + " headers: " + res.headers, global.defineManager.LOG_LEVEL_DEBUG)

        sessionId = res.headers["set-cookie"][0].split(";")[0]
        // console.log('headers:', sessionId);

        res.on('data', function (chunk) {
            // console.log("http data: " + chunk)
        })

        res.on('end', function () {
            global.logManager.PrintLogMessage("SchoolManager", "GetAcademicScheduleThisMonth",
                "index.do getting http session ok: " + sessionId, global.defineManager.LOG_LEVEL_INFO)

            cookie = requestManager.cookie(sessionId)
            httpHeadersOptions = {
                hostname: "web.kangnam.ac.kr",
                path: "/menu/02be162adc07170ec7ee034097d627e9.do",
                method: "GET",
                headers: {
                    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.162 Safari/537.36",
                    'Content-Type': 'text/html',
                    "Connection": "keep-alive",
                    "Pragma": "no-cache",
                    "Cache-Control": "no-cache",
                    "Upgrade-Insecure-Requests": "1",
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
                    "Referer": "http://web.kangnam.ac.kr/",
                    "Accept-Language": "en-US,en;q=0.9,ko;q=0.8",
                    "Cookie": sessionId
                }
            }
            // console.log("http rerequest: ", httpHeadersOptions)
            httpManager.get(httpHeadersOptions, function (response) {
                // console.log('statusCode:', response.statusCode);
                // console.log('headers:', response.headers);

                global.logManager.PrintLogMessage("SchoolManager", "GetAcademicScheduleThisMonth",
                    "schedule.do getting http statusCode: " + response.statusCode + " headers: " + response.headers, global.defineManager.LOG_LEVEL_DEBUG)
                var serverData = ''
                response.on('data', function (chunk) {
                    serverData += chunk
                })
                response.on('end', function () {
                    var $ = cheerioManager.load(serverData)
                    global.logManager.PrintLogMessage("SchoolManager", "GetAcademicScheduleThisMonth",
                        "http target url requested ok", global.defineManager.LOG_LEVEL_INFO)

                    scheduleCalendar = $("table.cal_data tbody")
                    // console.log("raw data: ", scheduleCalendar)
                    yearSchedule = []
                    scheduleCalendar.each(function () {
                        calChildren = $(this).children("tr")
                        // console.log("month")
                        indexOfMonth = []
                        calChildren.each(function () {
                            colText = $(this).text()
                            // console.log("test ", colText)
                            indexOfMonth.push(colText)
                        })
                        yearSchedule.push(indexOfMonth)
                    })
                    // console.log("year schedule: ", yearSchedule)
                    scheduleStr = global.util.format(global.defineManager.SCHEDULE_RESULT_STR, (month + 1))
                    scheduleStr = scheduleStr + yearSchedule[month].join("\n")
                    responseButton = global.defineManager.MAIN_BUTTONS
                    responseMessage["text"] = scheduleStr
                    responseManager.TemplateResponse(admin, convertManager, generateManager, responseApp, requestMessage, responseMessage, responseButton)
                })
                response.on('error', function (except) {
                    global.logManager.PrintLogMessage("SchoolManager", "GetAcademicScheduleThisMonth",
                        "http error while request target url: schedule.do\nerr: " + except, global.defineManager.LOG_LEVEL_ERROR)
                    responseButton = global.defineManager.MAIN_BUTTONS
                    responseMessage["text"] = global.defineManager.ERROR_MSG
                    responseManager.TemplateResponse(admin, convertManager, generateManager, responseApp, requestMessage, responseMessage, responseButton)
                })
            })
        })

    }).on('error', function(exception) {
        global.logManager.PrintLogMessage("SchoolManager", "GetAcademicScheduleThisMonth",
            "http error while request target url: index.do\nerr: " + except, global.defineManager.LOG_LEVEL_ERROR)
        responseButton = global.defineManager.MAIN_BUTTONS
        responseMessage["text"] = global.defineManager.ERROR_MSG
        responseManager.TemplateResponse(admin, convertManager, generateManager, responseApp, requestMessage, responseMessage, responseButton)
    });
}