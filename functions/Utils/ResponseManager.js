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