exports.GetAcademicScheduleThisMonth = function (month, admin, convertManager, generateManager, responseApp, requestMessage, responseManager) {
    var requestManager = require("request")
    var cheerioManager = require("cheerio")
    var httpManager = require("http")

    global.logManager.PrintLogMessage("SchoolManager", "GetAcademicScheduleThisMonth",
        "init crawling module", global.defineManager.LOG_LEVEL_INFO)
    databasePath = global.defineManager.DATABASE_SCHOOL_SCHEDULE + month + "/"

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
            // "Cookie": sessionId
        }
    }

    admin.database().ref(databasePath).once('value', function(snapshot){
        databaseSnapshot = snapshot.val()
        if(databaseSnapshot != null) {
            global.logManager.PrintLogMessage("SchoolManager", "GetAcademicScheduleThisMonth",
                "schedule database available", global.defineManager.LOG_LEVEL_INFO)

            scheduleStr = global.util.format(global.defineManager.SCHEDULE_RESULT_STR, (month + 1))
            scheduleStr = scheduleStr + databaseSnapshot.join("\n")
            responseButton = global.defineManager.MAIN_BUTTONS
            responseMessage["text"] = scheduleStr
            global.logManager.PrintLogMessage("SchoolManager", "GetAcademicScheduleThisMonth",
                "try to send super fast schedule response", global.defineManager.LOG_LEVEL_INFO)
            responseManager.TemplateResponse(admin, convertManager, generateManager, responseApp, requestMessage, responseMessage, responseButton)

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
                    status = admin.database().ref(global.defineManager.DATABASE_SCHOOL_SCHEDULE).set(yearSchedule);

                    global.logManager.PrintLogMessage("SchoolManager", "GetAcademicScheduleThisMonth",
                        "save crawled data after super fast response", global.defineManager.LOG_LEVEL_INFO)
                })
                response.on('error', function (except) {
                    global.logManager.PrintLogMessage("SchoolManager", "GetAcademicScheduleThisMonth",
                        "http error while request target url: schedule.do\nerr: " + except, global.defineManager.LOG_LEVEL_ERROR)
                    responseButton = global.defineManager.MAIN_BUTTONS
                    responseMessage["text"] = global.defineManager.ERROR_MSG
                    responseManager.TemplateResponse(admin, convertManager, generateManager, responseApp, requestMessage, responseMessage, responseButton)
                })
            })
        }
        else {
            global.logManager.PrintLogMessage("SchoolManager", "GetAcademicScheduleThisMonth",
                "schedule database isnt available", global.defineManager.LOG_LEVEL_WARN)
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

                    status = admin.database().ref(global.defineManager.DATABASE_SCHOOL_SCHEDULE).set(yearSchedule);

                    global.logManager.PrintLogMessage("SchoolManager", "GetAcademicScheduleThisMonth",
                        "save crawled data after save new data", global.defineManager.LOG_LEVEL_INFO)
                })
                response.on('error', function (except) {
                    global.logManager.PrintLogMessage("SchoolManager", "GetAcademicScheduleThisMonth",
                        "http error while request target url: schedule.do\nerr: " + except, global.defineManager.LOG_LEVEL_ERROR)
                    responseButton = global.defineManager.MAIN_BUTTONS
                    responseMessage["text"] = global.defineManager.ERROR_MSG
                    responseManager.TemplateResponse(admin, convertManager, generateManager, responseApp, requestMessage, responseMessage, responseButton)
                })
            })
        }
    })
}