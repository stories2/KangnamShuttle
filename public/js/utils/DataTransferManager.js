function DataTransferManager() {
    PrintLogMessage("DataTransferManager", "DataTransferManager", "init", LOG_LEVEL_INFO)
}

DataTransferManager.prototype.PostRequest = function (url, data, callbackObj) {
    PrintLogMessage("DataTransferManager", "PostRequest", "send data to url: " + url, LOG_LEVEL_INFO)
    $.ajax({
        type: "POST",
        dataType: 'json',
        url: url,
        data: data,
        crossDomain : true,
        xhrFields: {
            withCredentials: false
        }
    })
        .done(function( receivedData ) {
            PrintLogMessage("DataTransferManager", "PostRequest", "data received successfully", LOG_LEVEL_INFO)
            callbackObj.RequestSuccess(receivedData)
        })
        .fail( function(xhr, textStatus, errorThrown) {
            PrintLogMessage("DataTransferManager", "PostRequest", "something has problem: " + textStatus, LOG_LEVEL_ERROR)
            callbackObj.RequestFail(xhr.responseText, textStatus)
        });
}

DataTransferManager.prototype.PostRequestWithCallbackFunc = function (url, data, successFunc, failFunc) {
    PrintLogMessage("DataTransferManager", "PostRequestWithCallbackFunc", "send data to url: " + url, LOG_LEVEL_INFO)
    $.ajax({
        type: "POST",
        dataType: 'json',
        url: url,
        data: data,
        crossDomain : true,
        xhrFields: {
            withCredentials: false
        }
    })
        .done(function( receivedData ) {
            PrintLogMessage("DataTransferManager", "PostRequestWithCallbackFunc", "data received successfully", LOG_LEVEL_INFO)
            successFunc(receivedData)
        })
        .fail( function(xhr, textStatus, errorThrown) {
            PrintLogMessage("DataTransferManager", "PostRequestWithCallbackFunc", "something has problem: " + textStatus, LOG_LEVEL_ERROR)
            failFunc(xhr.responseText, textStatus)
        });
}

DataTransferManager.prototype.GetRequest = function (url, data, callbackObj) {
    PrintLogMessage("DataTransferManager", "GetRequest", "send data to url: " + url, LOG_LEVEL_INFO)
    $.ajax({
        type: "GET",
        dataType: 'text',
        url: url,
        data: data,
        crossDomain : true,
        xhrFields: {
            withCredentials: false
        }
    })
        .done(function( receivedData ) {
            PrintLogMessage("DataTransferManager", "GetRequest", "data received successfully", LOG_LEVEL_INFO)
            callbackObj.RequestSuccess(receivedData)
        })
        .fail( function(xhr, textStatus, errorThrown) {
            PrintLogMessage("DataTransferManager", "GetRequest", "something has problem: " + textStatus, LOG_LEVEL_ERROR)
            callbackObj.RequestFail(xhr.responseText, textStatus)
        });
}