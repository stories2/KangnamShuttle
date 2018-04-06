function OuterViewManager() {
    PrintLogMessage("OuterViewManager", "OuterViewManager", "init", LOG_LEVEL_INFO)
}

OuterViewManager.prototype.ListenSubLinkClick = function () {
    PrintLogMessage("OuterViewManager", "ListenSubLinkClick", "listen sub-link click event", LOG_LEVEL_INFO)
    $(".sub-links").click(function(){
        htmlDataPath = $(this).attr("data-html")
        testFeatureName = $(this).text()
        PrintLogMessage("OuterViewManager", "ListenSubLinkClick", "sub link clicked path: " + htmlDataPath, LOG_LEVEL_INFO)
        outerViewManager.MoveToAnotherView(htmlDataPath, testFeatureName)
    })
}

OuterViewManager.prototype.MoveToAnotherView = function (link, title) {
    PrintLogMessage("OuterViewManager", "MoveToAnotherView", "path: " + link + " title: " + title, LOG_LEVEL_INFO)
    $("#contentHeader").text(title)
    $("#contentBody").load(link);
}

outerViewManager = new OuterViewManager()
outerViewManager.ListenSubLinkClick()
outerViewManager.MoveToAnotherView("auth.html", "Sign in")