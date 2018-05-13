exports.LoginToEclass = function (admin, request, response, responseManager, schoolAuthManager) {
    requestBodyData = request.body
    global.logManager.PrintLogMessage("SchoolAuthManager", "LoginToEclass", "login data: " + JSON.stringify(requestBodyData),
        global.defineManager.LOG_LEVEL_DEBUG)

    responseData = {
        "msg": "ok"
    }

    response.setHeader('Content-Type', 'application/json');
    response.status(200).send(JSON.stringify(responseData))
}