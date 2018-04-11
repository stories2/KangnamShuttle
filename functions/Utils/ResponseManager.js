exports.TemplateResponse = function (admin, convertManager, generateManager, response, requestMessage, responseMsg, responseButton) {
    global.logManager.PrintLogMessage("ResponseManager", "TemplateResponse",
        "result message: " + responseMsg["text"],
        global.defineManager.LOG_LEVEL_INFO)

    orderId = convertManager.ConvertOrderToNumber(requestMessage["content"])
    global.logManager.SaveLog(admin, generateManager, orderId, requestMessage["user_key"], responseMsg["text"])

    responseMsg = {"message": responseMsg,
        "keyboard": {"type" : "buttons", "buttons" : responseButton}}

    response.setHeader('Content-Type', 'application/json');
    response.status(200).send(JSON.stringify(responseMsg))
}

exports.TemplateOfResponse = function (responseJsonDicData, responseCode, response) {

    global.logManager.PrintLogMessage("ResponseManager", "TemplateOfResponse", "res code: " + responseCode,
        global.defineManager.LOG_LEVEL_DEBUG)

    template = {}
    template["code"] = responseCode
    template["data"] = responseJsonDicData

    response.setHeader('Content-Type', 'application/json');
    response.setHeader("Access-Control-Allow-Origin", "*")
    response.setHeader('Access-Control-Allow-Methods', '*')
    response.setHeader("Access-Control-Allow-Headers", "*")
    response.setHeader("Access-Control-Allow-Credentials", true)
    response.setHeader('Access-Control-Request-Method', '*');
    response.status(responseCode).send(JSON.stringify(template));
}