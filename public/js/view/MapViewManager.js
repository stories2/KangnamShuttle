function PushMark(map, latPos, longPos, titleStr, iconLink) {
    PrintLogMessage("MapViewManager", "PushMark", "add new markers pos: " +
        latPos + " " + longPos + " title: " + titleStr, LOG_LEVEL_INFO)
    var marker = new google.maps.Marker({
        position: {lat: latPos, lng: longPos},
        map: map,
        title: titleStr,
        icon: iconLink
    });

    locationMarkStack.push(marker)
}

function PopMark() {
    stackPos = locationMarkStack.length - 1

    PrintLogMessage("MapViewManager", "PopMark", "Pop marker stack pos: " + stackPos, LOG_LEVEL_INFO)
    if(stackPos < 0) {
        return false
    }

    marker = locationMarkStack[stackPos]
    locationMarkStack.pop()
    marker.setMap(null)
    return true
}

function ResetMark() {
    PrintLogMessage("MapViewManager", "ResetMark", "reset all markers", LOG_LEVEL_INFO)
    while(PopMark()) {

    }
    PrintLogMessage("MapViewManager", "ResetMark", "all markers are deleted", LOG_LEVEL_INFO)
}