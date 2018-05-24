exports.SendSms = function (nexmoApiModule, request, response, responseManager) {
    requestBody = request.body
    var from = requestBody["from"]
    var to = requestBody["to"]
    var text = requestBody["text"]
    global.logManager.PrintLogMessage("AdminManager", "SendSms", "request data: " + JSON.stringify(requestBody),
        global.defineManager.LOG_LEVEL_DEBUG)
    nexmoApiModule.message.sendSms(from, to, text, function (error, responseData) {
        responseMsg = {}
        if(error) {
            global.logManager.PrintLogMessage("AdminManager", "SendSms", "something goes wrong: " + error,
                global.defineManager.LOG_LEVEL_ERROR)
            responseMsg["msg"] = "failed to send sms"
            responseManager.TemplateOfResponse(responseMsg, global.defineManager.HTTP_SERVER_ERROR, response)
        }
        else {
            global.logManager.PrintLogMessage("AdminManager", "SendSms", "send sms successfully: " + JSON.stringify(responseData),
                global.defineManager.LOG_LEVEL_INFO)
            responseMsg["msg"] = "send sms successfully"
            responseManager.TemplateOfResponse(responseMsg, global.defineManager.HTTP_SUCCESS, response)
        }
    })
}