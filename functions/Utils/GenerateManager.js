exports.CreateHash = function (data) {
    crypto = require('crypto');
    hashData = crypto.createHash('md5').update(data).digest("hex");
    global.logManager.PrintLogMessage("GenerateManager", "CreateHash", "generate hash base: " + data + " -> " + hashData,
        global.defineManager.LOG_LEVEL_INFO)
    return hashData
}