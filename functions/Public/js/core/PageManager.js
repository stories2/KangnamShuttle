function PageManager() {
    PrintLogMessage("PageManager", "PageManager", "init", LOG_LEVEL_INFO)
}

PageManager.prototype.RenderContentPage = function (pageName, pageData) {
    PrintLogMessage("PageManager", "RenderContentPage", "load page name: " + pageName + " data: " + JSON.stringify(pageData), LOG_LEVEL_DEBUG)

    // dataParsed = JSON.parse(JSON.stringify(pageData))
    // PrintLogMessage("PageManager", "RenderContentPage", "data parsed: " + dataParsed["test"], LOG_LEVEL_DEBUG)

    $('#contentLoader').load(pageName);
}