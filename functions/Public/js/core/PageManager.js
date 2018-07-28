function PageManager() {
    PrintLogMessage("PageManager", "PageManager", "init", LOG_LEVEL_INFO)
}

PageManager.prototype.RenderContentPage = function (pageName, pageData) {
    PrintLogMessage("PageManager", "RenderContentPage", "load page name: " + pageName + " data: " + JSON.stringify(pageData), LOG_LEVEL_DEBUG)

    // dataParsed = JSON.parse(JSON.stringify(pageData))
    // PrintLogMessage("PageManager", "RenderContentPage", "data parsed: " + dataParsed["test"], LOG_LEVEL_DEBUG)

    pageUrl = this.MakeUrlBasedOnReceivedQueryData(pageName, pageData)

    $('#contentLoader').load(pageUrl);
}

PageManager.prototype.MakeUrlBasedOnReceivedQueryData = function (pageName, pageData) {
    PrintLogMessage("PageManager", "MakeUrlBasedOnReceivedQueryData", "make url with query", LOG_LEVEL_INFO);
    pageName = pageName + "?"
    for(key in pageData) {
        indexOfQueryData = pageData[key]
        if(indexOfQueryData[QUERY_TYPE] == QUERY_TYPE_QUERY) {
            pageName = pageName + key + "=" + indexOfQueryData[QUERY_VALUE] + "&"
        }
    }

    PrintLogMessage("PageManager", "MakeUrlBasedOnReceivedQueryData", "generated page url: " + pageName, LOG_LEVEL_DEBUG)

    return pageName
}