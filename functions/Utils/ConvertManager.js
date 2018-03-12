exports.ConvertOrderToNumber = function (order) {
    convertedID = global.defineManager.ORDER_TO_ID[order]
    if(typeof convertedID == 'undefined') {
        convertedID = global.defineManager.NOT_AVAILABLE
    }
    global.logManager.PrintLogMessage("ConvertManager", "ConvertOrderToNumber", "input order: " + order + " converted: " + convertedID,
        global.defineManager.LOG_LEVEL_INFO)
    return convertedID
}