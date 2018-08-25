function UpdateWifiInfoList(wifiList) {
    // console.log(">>", JSON.stringify(wifiList))
    counter = 0
    for(index in wifiList) {
        $("#index" + counter).text("PW: " + wifiList[index]["wifiPassword"])
        counter += 1
    }
}