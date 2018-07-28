exports.PublicApiParseRequestQuery = function (requestQuery) {

    queryDict = {}

    for(indexOfQuery in requestQuery) {

        queryValue = requestQuery[indexOfQuery]

        global.logManager.PrintLogMessage("QueryParseManager", "PublicApiParseRequestQuery", "query: " + indexOfQuery + " val: " + queryValue, global.defineManager.LOG_LEVEL_DEBUG)
        queryKeys = indexOfQuery.split("_")

        if(queryKeys.length == 2) {
            queryName = queryKeys[0]
            queryType = queryKeys[1]

            queryDict[queryName] = {
                "type": queryType,
                "value": queryValue
            }

            global.logManager.PrintLogMessage("QueryParseManager", "PublicApiParseRequestQuery", "query data parsed key: " +
                queryName + " type: " + queryType + " val: " + queryValue, global.defineManager.LOG_LEVEL_DEBUG)
        }
        else {
            global.logManager.PrintLogMessage("QueryParseManager", "PublicApiParseRequestQuery", "wrong query data accepted", global.defineManager.LOG_LEVEL_WARN)
        }
    }

    return queryDict
}