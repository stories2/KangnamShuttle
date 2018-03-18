exports.GetAcademicScheduleThisMonth = function () {
    var requestManager = require("request")
    var requestPromise = require("request-promise")
    var cheerioManager = require("cheerio")
    var httpsManager = require("https")
    var httpManager = require("http")

    // Request.prototype.request = function () {
    //     var self = this
    //     self.setMaxListeners(0)
    // }
    // requestManager;
    // require('events').EventEmitter.prototype._maxListeners = 0;

    global.logManager.PrintLogMessage("SchoolManager", "GetAcademicScheduleThisMonth",
        "init crawling module", global.defineManager.LOG_LEVEL_INFO)

    cookie = requestManager.cookie("JSESSIONID=C5D167CCD1C9C590B3CF0943F360FE77")
    var url = "http://web.kangnam.ac.kr/menu/02be162adc07170ec7ee034097d627e9.do";

    headersOption = {
        method: 'GET',
        url: url,
        jar: true,
        headers: {
            "User-Agent": "Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.31 (KHTML, like Gecko) Chrome/26.0.1410.",
            "Cookie": cookie,
            'Content-Type': 'text/html',
        },
        maxRedirects:20,
        Accept: '/'
    }

    requestPromise(headersOption)
        .then(function (htmlString) {
            // Process html...
            var $ = cheerioManager.load(htmlString)
            global.logManager.PrintLogMessage("SchoolManager", "GetAcademicScheduleThisMonth",
                "target url requested ok body\n" + htmlString, global.defineManager.LOG_LEVEL_INFO)
        })
        .catch(function (err) {
            // Crawling failed...
            global.logManager.PrintLogMessage("SchoolManager", "GetAcademicScheduleThisMonth",
                            "error while request target url: " + url + "\nerr: " + err, global.defineManager.LOG_LEVEL_ERROR)
        });

    requestManager(headersOption,
        function(error, response, body) {
            if (error) {
                global.logManager.PrintLogMessage("SchoolManager", "GetAcademicScheduleThisMonth",
                    "error while request target url: " + url + "\nerr: " + error, global.defineManager.LOG_LEVEL_ERROR)
            }
            else {
                var $ = cheerioManager.load(body)
                global.logManager.PrintLogMessage("SchoolManager", "GetAcademicScheduleThisMonth",
                    "target url requested ok body\n" + body, global.defineManager.LOG_LEVEL_INFO)
            }
        }).setMaxListeners(0);
    
    function HandleHttpsRequest(response) {
        var serverData = ''
        response.on('data', function (chunk) {
            serverData += chunk
        })
        response.on('end', function () {
            global.logManager.PrintLogMessage("SchoolManager", "GetAcademicScheduleThisMonth",
                "https target url requested ok body\n" + serverData, global.defineManager.LOG_LEVEL_INFO)
        })
        response.on('error', function (except) {
            global.logManager.PrintLogMessage("SchoolManager", "GetAcademicScheduleThisMonth",
                "error while request target url: " + url + "\nerr: " + except, global.defineManager.LOG_LEVEL_ERROR)
        })
    }

    httpsHeadersOptions = {
        hostname: "web.kangnam.ac.kr",
        path: "/menu/02be162adc07170ec7ee034097d627e9.do",
        method: "GET",
        headers: {
            "User-Agent": "Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.31 (KHTML, like Gecko) Chrome/26.0.1410.",
            "Cookie": cookie,
            'Content-Type': 'text/html',
        }
    }

    // httpsManager.request(httpsHeadersOptions, function (response) {
    //     HandleHttpsRequest(response)
    // }).end()

    httpManager.get(url, (res) => {
        console.log('statusCode:', res.statusCode);
        console.log('headers:', res.headers);

        res.on('data', (d) => {
            process.stdout.write(d);
        });

    }).on('error', (e) => {
        console.error(e);
    });
}