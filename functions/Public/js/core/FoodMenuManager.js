function FoodMenuManager(firebase) {
    PrintLogMessage("FoodMenuManager", "FoodMenuManager", "init", LOG_LEVEL_INFO)
    this.firebase = firebase
    this.database = this.firebase.database()
}

FoodMenuManager.prototype.GetLatestFoodMenu = function () {
    PrintLogMessage("FoodMenuManager", "GetLatestFoodMenu", "get food menu from server", LOG_LEVEL_INFO)
    this.database.ref(DATABASE_SERVICE_V2_0_0_FOOD_MENU_INFO_PATH).once('value').then(function(foodMenuSnapshot) {
        var foodMenuData = JSON.parse(JSON.stringify(foodMenuSnapshot.val()))
        for(typeOfSection in foodMenuData) {
            SetMenuImage(typeOfSection, foodMenuData[typeOfSection][typeOfSection + "Img"])
            SetLastUpdateDateTime(typeOfSection, foodMenuData[typeOfSection][typeOfSection + "LastUploadDateTime"])
            SetLastUploader(typeOfSection, foodMenuData[typeOfSection][typeOfSection + "LastUploader"])
            PrintLogMessage("FoodMenuManager", "GetLatestFoodMenu", "key: " + typeOfSection + " data: " + JSON.stringify(foodMenuData[typeOfSection]), LOG_LEVEL_DEBUG)
        }
    })
}