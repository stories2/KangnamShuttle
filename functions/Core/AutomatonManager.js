exports.AnalysisCurrentOrderNumber = function (admin, callbackFunc, routineLinkedList, inputMsg, currentUserKey) {

    global.logManager.PrintLogMessage("AutomatonManager", "AnalysisCurrentOrderNumber", "base input: " + inputMsg + " / " + currentUserKey, global.defineManager.LOG_LEVEL_DEBUG)

    if(currentUserKey != null) {
        searchPath = global.defineManager.DATABASE_USERS_PATH + "/" + currentUserKey
        global.logManager.PrintLogMessage("AutomatonManager", "AnalysisCurrentOrderNumber", "search path: " + searchPath, global.defineManager.LOG_LEVEL_DEBUG)
        admin.database().ref(searchPath)
            .once('value', function (snapshot) {
                snapshot = JSON.parse(JSON.stringify(snapshot))

                if(snapshot == null) {
                    userManager = require('./UserManager');
                    snapshot = userManager.CreateNewUserTemplate(admin, currentUserKey)
                    global.logManager.PrintLogMessage("AutomatonManager", "AnalysisCurrentOrderNumber", "user created return template", global.defineManager.LOG_LEVEL_WARN)
                }

                global.logManager.PrintLogMessage("AutomatonManager", "AnalysisCurrentOrderNumber", "snapshot: " + JSON.stringify(snapshot), global.defineManager.LOG_LEVEL_DEBUG)

                lastOrderNumber = snapshot["lastOrder"] == null ? global.defineManager.AUTOMATON_START_NUMBER : snapshot["lastOrder"]

                global.logManager.PrintLogMessage("AutomatonManager", "AnalysisCurrentOrderNumber", "last input order: " + lastOrderNumber, global.defineManager.LOG_LEVEL_DEBUG)

                lastUsedOrderIndex = routineLinkedList[lastOrderNumber]
                inputOrderList = lastUsedOrderIndex["inputOrderList"]
                currentOrderNumber = lastOrderNumber//global.defineManager.AUTOMATON_MAIN_ORDER_NUMBER
                for(key in inputOrderList) {
                    if(inputOrderList[key] == inputMsg) {
                        currentOrderNumber = lastUsedOrderIndex["nextOrderList"][key]
                        break;
                    }
                }
                global.logManager.PrintLogMessage("AutomatonManager", "AnalysisCurrentOrderNumber", "current order number: " + currentOrderNumber, global.defineManager.LOG_LEVEL_DEBUG)
                callbackFunc(currentOrderNumber, snapshot)
            })
    }
    else {
        global.logManager.PrintLogMessage("AutomatonManager", "AnalysisCurrentOrderNumber", "you must send user_key", global.defineManager.LOG_LEVEL_WARN)
        callbackFunc(global.defineManager.NOT_AVAILABLE)
    }
}

exports.IsRightTypeOfInput = function(currentRoutineLinkItem, currentRequestInputType) {
    expectedInputType = currentRoutineLinkItem["acceptInputType"]
    if(expectedInputType == currentRequestInputType) {
        global.logManager.PrintLogMessage("AutomatonManager", "IsRightTypeOfInput", "input type is ok", global.defineManager.LOG_LEVEL_INFO)
        return true
    }
    global.logManager.PrintLogMessage("AutomatonManager", "IsRightTypeOfInput", "unexpected input type " + expectedInputType + " <-> " + currentRequestInputType, global.defineManager.LOG_LEVEL_WARN)
    return false
}

exports.OrderExecute = function (admin, functions, request, currentRoutineLinkItem, currentOrderNumber, currentUserData, currentUserKey, callbackFunc) {
    global.logManager.PrintLogMessage("AutomatonManager", "OrderExecute", "execute order: " + currentOrderNumber, global.defineManager.LOG_LEVEL_DEBUG)

    currentUserResponseMsgType = currentUserData["responseType"]
    makeUpResponse = function (responseText, labelUrl, photoUrl) {

        responseMessage = {
            "message": {
                "text": responseText,
            },
            "keyboard": {
                "type": currentRoutineLinkItem["nextInputType"],
                "buttons": currentRoutineLinkItem["inputOrderList"]
            }
        }

        if(labelUrl != null) {
            msgBtnTemplate = {
                "message_button": {
                    "label": currentRoutineLinkItem["labelText"],
                    "url": labelUrl
                }
            }

            responseMessage["message"]["message_button"] = msgBtnTemplate["message_button"]
            global.logManager.PrintLogMessage("AutomatonManager", "OrderExecute", "msg btn template attached", global.defineManager.LOG_LEVEL_INFO)
        }
        if(photoUrl != null) {
            msgPhotoTemplate = {
                "photo": {
                    "url": photoUrl,
                    "width": currentRoutineLinkItem["photo"]["width"],
                    "height": currentRoutineLinkItem["photo"]["height"]
                }
            }

            responseMessage["message"]["photo"] = msgPhotoTemplate["photo"]
            global.logManager.PrintLogMessage("AutomatonManager", "OrderExecute", "msg photo template attached", global.defineManager.LOG_LEVEL_INFO)
        }

        global.logManager.PrintLogMessage("AutomatonManager", "OrderExecute", "response template: " + JSON.stringify(responseMessage), global.defineManager.LOG_LEVEL_DEBUG)

        callbackFunc(responseMessage)
    }

    if(currentOrderNumber >= global.defineManager.AUTOMATON_BUS_SEARCH_ORDER_START_NUMBER && currentOrderNumber <= global.defineManager.AUTOMATON_BUS_SEARCH_ORDER_END_NUMBER) {
        busTimeManager = require('./BusTimeManager');
        busTimeListSavedPoint = currentOrderNumber % global.defineManager.AUTOMATON_BUS_SEARCH_ORDER_START_NUMBER
        busTimeManager.SearchFastestShuttleBasedOnStartPointV2(admin, busTimeListSavedPoint, function (resultTimeSec, nextShuttleSec, state) {
            global.logManager.PrintLogMessage("AutomatonManager", "OrderExecute", "received shuttle time sec: " + resultTimeSec, global.defineManager.LOG_LEVEL_DEBUG)

            responseMsgStr = busTimeManager.GenerateBusScheduleReview(
                currentRoutineLinkItem["responseMsgDic"][currentUserResponseMsgType],
                resultTimeSec,
                nextShuttleSec,
                state
                )
            makeUpResponse(responseMsgStr, null, null)
        })
    }
    else if(currentOrderNumber == global.defineManager.AUTOMATON_BUS_INFO_SELECTION_ORDER_NUMBER) {
        busTimeManager = require('./BusTimeManager');
        busTimeManager.GenerateIsConfusionTime(admin,
            currentRoutineLinkItem["responseMsgDic"][currentUserResponseMsgType][global.defineManager.RESPONSE_DEFAULT_SELECTION],
            function (responseStr) {
                makeUpResponse(
                    responseStr,
                    null,
                    null
                )
            })
    }
    else if(currentOrderNumber == global.defineManager.AUTOMATON_PRINT_ALL_SHUTTLE_SCHEDULE_ORDER_NUMBER) {
        makeUpResponse(
            currentRoutineLinkItem["responseMsgDic"][currentUserResponseMsgType][global.defineManager.RESPONSE_DEFAULT_SELECTION],
            currentRoutineLinkItem["labelUrl"],
            currentRoutineLinkItem["photo"]["url"])
    }
    else if(currentOrderNumber == global.defineManager.AUTOMATON_SERVICE_INFO_ORDER_NUMBER) {
        systemManager = require('./SystemManager');
        systemManager.CurrentServiceInfo(
            admin,
            currentRoutineLinkItem["responseMsgDic"][currentUserResponseMsgType][global.defineManager.RESPONSE_DEFAULT_SELECTION],
            function (responseText, webUrl) {
                makeUpResponse(responseText, webUrl, null)
            })
    }
    else if(currentOrderNumber == global.defineManager.AUTOMATON_SERVICE_RELEASE_NOTE_ORDER_NUMBER) {
        systemManager = require('./SystemManager');
        systemManager.LatestServiceReleaseNote(
            admin,
            currentRoutineLinkItem["responseMsgDic"][currentUserResponseMsgType][global.defineManager.RESPONSE_DEFAULT_SELECTION],
            function (responseText) {
                makeUpResponse(responseText, null, null)
            }
        )
    }
    else if(currentOrderNumber == global.defineManager.AUTOMATON_BUS_STATION_PRINT_ORDER_NUMBER) {
        busManager = require('./BusManager');
        busManager.GetAllBusStation(
            admin,
            currentRoutineLinkItem["responseMsgDic"][currentUserResponseMsgType][global.defineManager.RESPONSE_DEFAULT_SELECTION],
            function (responseText) {
                makeUpResponse(responseText, null, null)
            }
        )
    }
    else if(currentOrderNumber == global.defineManager.AUTOMATON_BUS_LOCATION_INFO_ORDER_NUMBER) {
        busTrackingManager = require('./BusTrackingManager');
        busTrackingManager.GetBusTrackingPageUrl(admin, function (busLocationPageUrl) {
            makeUpResponse(
                currentRoutineLinkItem["responseMsgDic"][currentUserResponseMsgType][global.defineManager.RESPONSE_DEFAULT_SELECTION],
                busLocationPageUrl,
                null
                )
        })
    }
    else if(currentOrderNumber == global.defineManager.AUTOMATON_MAIN_ORDER_NUMBER) {

        makeUpResponse(currentRoutineLinkItem["responseMsgDic"][currentUserResponseMsgType][global.defineManager.RESPONSE_DEFAULT_SELECTION], null, null)

        subwayManager = require('./SubwayManager');
        subwayOpenApiInfo = {
            "endpoint_path": functions.config().seoul_open_api.endpoint_path,
            "key": functions.config().seoul_open_api.key,
            "endpoint": functions.config().seoul_open_api.endpoint,
            "platform_giheung": functions.config().seoul_open_api.platform_giheung,
            "platform_kangnam_univ": functions.config().seoul_open_api.platform_kangnam_univ
        }

        weatherManager = require('./WeatherManager');
        weatherOpenApiInfo = {
            "key": functions.config().weather_open_api.key,
            "local_name": functions.config().weather_open_api.local_name,
            "lang": functions.config().weather_open_api.lang
        }

        subwayManager.PostfixUpdateSubwaySchedule(admin, subwayManager, subwayOpenApiInfo, subwayOpenApiInfo["platform_giheung"],
            global.defineManager.SUBWAY_DIRECTION_UP)
        subwayManager.PostfixUpdateSubwaySchedule(admin, subwayManager, subwayOpenApiInfo, subwayOpenApiInfo["platform_giheung"],
            global.defineManager.SUBWAY_DIRECTION_DOWN)
        subwayManager.PostfixUpdateSubwaySchedule(admin, subwayManager, subwayOpenApiInfo, subwayOpenApiInfo["platform_kangnam_univ"],
            global.defineManager.SUBWAY_DIRECTION_UP)
        subwayManager.PostfixUpdateSubwaySchedule(admin, subwayManager, subwayOpenApiInfo, subwayOpenApiInfo["platform_kangnam_univ"],
            global.defineManager.SUBWAY_DIRECTION_DOWN)

        weatherManager.GetCurrentWeather(admin, weatherOpenApiInfo["local_name"], weatherOpenApiInfo["lang"], weatherOpenApiInfo["key"])
    }
    else if(currentOrderNumber == global.defineManager.AUTOMATON_SUBWAY_PLATFORM_KANGNAM_UNIV_TO_GIHEUNG_ORDER_NUMBER) {
        subwayManager = require('./SubwayManager');
        subwayOpenApiInfo = {
            "platform_giheung": functions.config().seoul_open_api.platform_giheung,
            "platform_kangnam_univ": functions.config().seoul_open_api.platform_kangnam_univ
        }
        subwayManager.GetLastUpdatedSubwayScheduleInfo(admin,
            currentRoutineLinkItem["responseMsgDic"][currentUserResponseMsgType][global.defineManager.RESPONSE_DEFAULT_SELECTION],
            subwayOpenApiInfo["platform_kangnam_univ"],
            global.defineManager.SUBWAY_DIRECTION_UP,
            function (responseText) {
                makeUpResponse(responseText, null, null)
            })
    }
    else if(currentOrderNumber == global.defineManager.AUTOMATON_SUBWAY_PLATFORM_KANGNAM_UNIV_TO_EVERLAND_NUMBER) {
        subwayManager = require('./SubwayManager');
        subwayOpenApiInfo = {
            "platform_giheung": functions.config().seoul_open_api.platform_giheung,
            "platform_kangnam_univ": functions.config().seoul_open_api.platform_kangnam_univ
        }
        subwayManager.GetLastUpdatedSubwayScheduleInfo(admin,
            currentRoutineLinkItem["responseMsgDic"][currentUserResponseMsgType][global.defineManager.RESPONSE_DEFAULT_SELECTION],
            subwayOpenApiInfo["platform_kangnam_univ"],
            global.defineManager.SUBWAY_DIRECTION_DOWN,
            function (responseText) {
                makeUpResponse(responseText, null, null)
            })
    }
    else if(currentOrderNumber == global.defineManager.AUTOMATON_SUBWAY_PLATFORM_GIHEUNG_TO_WANGSIMNI_NUMBER) {
        subwayManager = require('./SubwayManager');
        subwayOpenApiInfo = {
            "platform_giheung": functions.config().seoul_open_api.platform_giheung,
            "platform_kangnam_univ": functions.config().seoul_open_api.platform_kangnam_univ
        }
        subwayManager.GetLastUpdatedSubwayScheduleInfo(admin,
            currentRoutineLinkItem["responseMsgDic"][currentUserResponseMsgType][global.defineManager.RESPONSE_DEFAULT_SELECTION],
            subwayOpenApiInfo["platform_giheung"],
            global.defineManager.SUBWAY_DIRECTION_UP,
            function (responseText) {
                makeUpResponse(responseText, null, null)
            })
    }
    else if(currentOrderNumber == global.defineManager.AUTOMATON_SUBWAY_PLATFORM_GIHEUNG_TO_SUWON_NUMBER) {
        subwayManager = require('./SubwayManager');
        subwayOpenApiInfo = {
            "platform_giheung": functions.config().seoul_open_api.platform_giheung,
            "platform_kangnam_univ": functions.config().seoul_open_api.platform_kangnam_univ
        }
        subwayManager.GetLastUpdatedSubwayScheduleInfo(admin,
            currentRoutineLinkItem["responseMsgDic"][currentUserResponseMsgType][global.defineManager.RESPONSE_DEFAULT_SELECTION],
            subwayOpenApiInfo["platform_giheung"],
            global.defineManager.SUBWAY_DIRECTION_DOWN,
            function (responseText) {
                makeUpResponse(responseText, null, null)
            })
    }
    else if(currentOrderNumber == global.defineManager.AUTOMATON_TODAY_WEATHER_CAST) {
        weatherManager = require('./WeatherManager');
        weatherOpenApiInfo = {
            "key": functions.config().weather_open_api.key,
            "local_name": functions.config().weather_open_api.local_name,
            "lang": functions.config().weather_open_api.lang
        }

        weatherManager.GenerateTodayWeatherCast(admin,
            currentRoutineLinkItem["responseMsgDic"][currentUserResponseMsgType][global.defineManager.RESPONSE_DEFAULT_SELECTION],
            function (responseText) {
                makeUpResponse(responseText, null, null)
            })
    }
    else if(currentOrderNumber == global.defineManager.AUTOMATON_USER_WANT_CHANGE_OWN_SETTING_ORDER_NUMBER) {
        userManager = require('./UserManager');
        userManager.SayHelloToUser(admin,
            currentRoutineLinkItem["responseMsgDic"][currentUserResponseMsgType][global.defineManager.RESPONSE_DEFAULT_SELECTION],
            currentUserKey,
            function (responseText) {
                makeUpResponse(responseText, null, null)
            })
    }
    else if(currentOrderNumber == global.defineManager.AUTOMATON_USER_CHECK_PROFILE_ORDER_NUMBER) {
        userManager = require('./UserManager');
        userManager.GoToMyProfile(admin,
            currentRoutineLinkItem,
            currentUserKey,
            function (labelUrl) {
                makeUpResponse(
                    currentRoutineLinkItem["responseMsgDic"][currentUserResponseMsgType][global.defineManager.RESPONSE_DEFAULT_SELECTION],
                    labelUrl,
                    null
                )
            }
        )
    }
    else if(currentOrderNumber == global.defineManager.AUTOMATON_USER_UPDATE_SCHOOL_FOOD_MENU_ORDER_NUMBER) {
        foodMenuManager = require('./FoodMenuManager');
        foodMenuManager.GenerateUpdateFoodMenuUrl(
            currentRoutineLinkItem,
            currentUserKey,
            function (labelUrl) {
                makeUpResponse(
                    currentRoutineLinkItem["responseMsgDic"][currentUserResponseMsgType][global.defineManager.RESPONSE_DEFAULT_SELECTION],
                    labelUrl,
                    null
                )
            })
    }
    else if(currentOrderNumber == global.defineManager.AUTOMATON_FOOD_MENU_SHALOM_ORDER_NUMBER) {
        foodMenuManager = require('./FoodMenuManager');
        foodMenuManager.GenerateDownloadFoodMenuUrl(admin, currentRoutineLinkItem, global.defineManager.FOOD_MENU_TYPE_SHALOM,
            function(imgUrl){
                makeUpResponse(
                    currentRoutineLinkItem["responseMsgDic"][currentUserResponseMsgType][global.defineManager.RESPONSE_DEFAULT_SELECTION],
                    imgUrl,
                    imgUrl
                )
        })
    }
    else if(currentOrderNumber == global.defineManager.AUTOMATON_FOOD_MENU_PERSONNEL_ORDER_NUMBER) {
        foodMenuManager = require('./FoodMenuManager');
        foodMenuManager.GenerateDownloadFoodMenuUrl(admin, currentRoutineLinkItem, global.defineManager.FOOD_MENU_TYPE_PERSONNEL,
            function(imgUrl){
                makeUpResponse(
                    currentRoutineLinkItem["responseMsgDic"][currentUserResponseMsgType][global.defineManager.RESPONSE_DEFAULT_SELECTION],
                    imgUrl,
                    imgUrl
                )
            })
    }
    else if(currentOrderNumber == global.defineManager.AUTOMATON_WIFI_INFO_ORDER_NUMBER) {
        schoolManager = require('./SchoolManager');
        schoolManager.GetSchoolWifiInfoUrl(currentUserKey, currentRoutineLinkItem,
            function(urlLink){
                makeUpResponse(
                    currentRoutineLinkItem["responseMsgDic"][currentUserResponseMsgType][global.defineManager.RESPONSE_DEFAULT_SELECTION],
                    urlLink,
                    null
                )
            })
    }
    else if(currentOrderNumber == global.defineManager.AUTOMATON_GAME_DIE_ORDER_NUMBER) {
        gameManager = require('./GameManager');
        gameManager.RollingDie(
            currentRoutineLinkItem["responseMsgDic"][currentUserResponseMsgType][global.defineManager.RESPONSE_DEFAULT_SELECTION],
            function (resultStr) {
                makeUpResponse(
                    resultStr,
                    null,
                    null
                )
            }
        )
    }
    else if(currentOrderNumber == global.defineManager.AUTOMATON_GAME_ROCK_SCISSORS_PAPER_ORDER_NUMBER) {
        gameManager = require('./GameManager');
        gameManager.RockScissorsPaper(
            currentRoutineLinkItem["responseMsgDic"][currentUserResponseMsgType][global.defineManager.RESPONSE_DEFAULT_SELECTION],
            function (resultStr) {
                makeUpResponse(
                    resultStr,
                    null,
                    null
                )
            }
        )
    }
    else if(currentOrderNumber == global.defineManager.AUTOMATON_SEARCH_PROFESSOR) {
        makeUpResponse(
            currentRoutineLinkItem["responseMsgDic"][currentUserResponseMsgType][global.defineManager.RESPONSE_DEFAULT_SELECTION],
            currentRoutineLinkItem["labelUrl"],
            null
        )
    }
    else if(currentOrderNumber >= global.defineManager.AUTOMATON_HELP_SPEED_WAGON_ORDER_START_NUMBER &&
                currentOrderNumber <= global.defineManager.AUTOMATON_HELP_SPEED_WAGON_ORDER_END_NUMBER) {

        makeUpResponse(
            currentRoutineLinkItem["responseMsgDic"][currentUserResponseMsgType][global.defineManager.RESPONSE_DEFAULT_SELECTION],
            currentRoutineLinkItem["labelUrl"],
            null
        )
    }
    else if(currentOrderNumber == global.defineManager.AUTOMATON_PUBLIC_BUS_KANGNAM_UNIV_ORDER_NUMBER) {
        busManager = require('./BusManager');

        busOpenApiInfo = {
            "endpoint": functions.config().seoul_open_api.public_bus_endpoint,
            "key": functions.config().seoul_open_api.bus_service_key,
            "endpoint_path": functions.config().seoul_open_api.public_bus_endpoint_path,
            "stationId": functions.config().seoul_open_api.bus_station_kangnam_univ_platform
        }

        busManager.GetLatestPublicBusLocation(admin, request.body["content"], busOpenApiInfo,
            function (busRoutineName, thisPublicBusLoc, nextPublicBusLoc, updatedDateTime) {
                global.logManager.PrintLogMessage("AutomatonManager", "OrderExecute",
                    "result: " + busRoutineName + ", " + thisPublicBusLoc + ", " + nextPublicBusLoc + ", " + updatedDateTime,
                    global.defineManager.LOG_LEVEL_DEBUG)

                busManager.GeneratePublicBusInfoStr(
                    currentRoutineLinkItem["responseMsgDic"][currentUserResponseMsgType][global.defineManager.RESPONSE_DEFAULT_SELECTION],
                    busRoutineName, thisPublicBusLoc, nextPublicBusLoc, updatedDateTime,
                    function (responseStr) {
                        makeUpResponse(
                            responseStr,
                            null,
                            null
                        )
                    })
            })

        busManager.UpdatePublicBusLocation(admin, request.body["content"], busOpenApiInfo)


    }
    else if(currentOrderNumber == global.defineManager.AUTOMATON_PUBLIC_BUS_NEXT_TO_KANGNAM_UNIV_ORDER_NUMBER) {
        busManager = require('./BusManager');

        busOpenApiInfo = {
            "endpoint": functions.config().seoul_open_api.public_bus_endpoint,
            "key": functions.config().seoul_open_api.bus_service_key,
            "endpoint_path": functions.config().seoul_open_api.public_bus_endpoint_path,
            "stationId": functions.config().seoul_open_api.bus_station_next_to_kangnam_univ_platform
        }

        busManager.GetLatestPublicBusLocation(admin, request.body["content"], busOpenApiInfo,
            function (busRoutineName, thisPublicBusLoc, nextPublicBusLoc, updatedDateTime) {
                global.logManager.PrintLogMessage("AutomatonManager", "OrderExecute",
                    "result: " + busRoutineName + ", " + thisPublicBusLoc + ", " + nextPublicBusLoc + ", " + updatedDateTime,
                    global.defineManager.LOG_LEVEL_DEBUG)

                busManager.GeneratePublicBusInfoStr(
                    currentRoutineLinkItem["responseMsgDic"][currentUserResponseMsgType][global.defineManager.RESPONSE_DEFAULT_SELECTION],
                    busRoutineName, thisPublicBusLoc, nextPublicBusLoc, updatedDateTime,
                    function (responseStr) {
                        makeUpResponse(
                            responseStr,
                            null,
                            null
                        )
                    })
            })

        busManager.UpdatePublicBusLocation(admin, request.body["content"], busOpenApiInfo)
    }
    else if(currentOrderNumber == global.defineManager.AUTOMATON_MAIN_INFO_SYSTEM_ORDER_NUMBER) {
        makeUpResponse(
            currentRoutineLinkItem["responseMsgDic"][currentUserResponseMsgType][global.defineManager.RESPONSE_DEFAULT_SELECTION],
            currentRoutineLinkItem["labelUrl"],
            null
        )
    }
    // else if(currentOrderNumber == global.defineManager.AUTOMATON_PUBLIC_TRANSPORT_INFO_ORDER_NUMBER) {
    //
    //     busOpenApiInfo = {
    //         "endpoint": functions.config().seoul_open_api.public_bus_endpoint,
    //         "key": functions.config().seoul_open_api.bus_service_key,
    //         "endpoint_path": functions.config().seoul_open_api.public_bus_endpoint_path,
    //         "stationId": functions.config().seoul_open_api.bus_station_kangnam_univ_platform
    //     }
    //     busManager = require('./BusManager');
    //     busManager.UpdateAllPublicBusLocation(admin, busOpenApiInfo)
    //
    //     makeUpResponse(
    //         currentRoutineLinkItem["responseMsgDic"][currentUserResponseMsgType][global.defineManager.RESPONSE_DEFAULT_SELECTION],
    //         null,
    //         null
    //     )
    // }
    else {

        makeUpResponse(currentRoutineLinkItem["responseMsgDic"][currentUserResponseMsgType][global.defineManager.RESPONSE_DEFAULT_SELECTION], null, null)
    }
}