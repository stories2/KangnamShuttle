exports.TemplateResponse = function (response, responseMsg, responseButton) {
    global.logManager.PrintLogMessage("ResponseManager", "TemplateResponse",
        "result message: " + responseMsg["text"],
        global.defineManager.LOG_LEVEL_INFO)

    responseMsg = {"message": responseMsg,
        "keyboard": {"type" : "buttons", "buttons" : responseButton}}

    response.setHeader('Content-Type', 'application/json');
    response.status(200).send(JSON.stringify(responseMsg))
}