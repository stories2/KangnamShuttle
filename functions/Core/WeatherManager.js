exports.GetCurrentWeather = function (admin, country, lang, weatherApiKey) {
    var httpManager = require("http")
    global.logManager.PrintLogMessage("WeatherManager", "GetCurrentWeather", "target country: " + country + " lang: " + lang,
        global.defineManager.LOG_LEVEL_INFO)

    httpHeadersOptions = {
        hostname: "api.openweathermap.org",
        path: "/data/2.5/weather",
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

    endpoint = "%s?q=%s&appid=%s&lang=%s"

    httpHeadersOptions["path"] = global.util.format(endpoint, httpHeadersOptions["path"], country, weatherApiKey, lang)

    httpManager.get(httpHeadersOptions, function (response) {

        global.logManager.PrintLogMessage("WeatherManager", "GetCurrentWeather",
            "weather getting http statusCode: " + response.statusCode + " headers: " + response.headers, global.defineManager.LOG_LEVEL_DEBUG)
        var serverData = ''
        response.on('data', function (chunk) {
            serverData += chunk
        })
        response.on('end', function () {
            weatherData = JSON.parse(serverData)
            global.logManager.PrintLogMessage("WeatherManager", "GetCurrentWeather",
                "weather data accepted successfully", global.defineManager.LOG_LEVEL_INFO)
            admin.database().ref(global.defineManager.DATABASE_WEATHER).set(weatherData);
        })
        response.on('error', function (except) {
            global.logManager.PrintLogMessage("WeatherManager", "GetCurrentWeather",
                "there is something problem: " + except, global.defineManager.LOG_LEVEL_ERROR)
        })
    })
}

exports.WeatherCast = function (weatherData, convertManager) {
    currentTemp = Math.floor(convertManager.ConvertKelvinToCelsius(weatherData["main"]["temp"]))

    currentWeather = weatherData["weather"][0]
    currentWeatherDes = currentWeather["description"]
    currentWeatherCode = currentWeather["id"]

    if(currentTemp > global.defineManager.HOT_WEATHER_CELSIUS_THRESHOLD &&
        (currentWeather["id"] == global.defineManager.WEATHER_CODE_CLEAR_SKY ||
            currentWeather["id"] == global.defineManager.WEATHER_CODE_FEW_CLOUDS)) {
        weatherCastStr = global.util.format(global.defineManager.WEATHER_CAST_WITH_NOTICE_STR, currentWeatherDes, currentTemp)
        global.logManager.PrintLogMessage("WeatherManager", "WeatherCast", "hot weather accepted",
            global.defineManager.LOG_LEVEL_INFO)
    }
    else {
        weatherCastStr = global.util.format(global.defineManager.WEATHER_CAST_STR, currentWeatherDes, currentTemp)
    }

    global.logManager.PrintLogMessage("WeatherManager", "WeatherCast", "current weather cast: " + weatherCastStr,
        global.defineManager.LOG_LEVEL_INFO)

    return weatherCastStr
}