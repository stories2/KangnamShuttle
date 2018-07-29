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

FoodMenuManager.prototype.InitUploadFoodMenuImageForm = function(foodMenuImageUploadType, callbackFunc) {
    PrintLogMessage("FoodMenuManager", "InitUploadFoodMenuImageForm", "init form: " + foodMenuImageUploadType, LOG_LEVEL_DEBUG)
    $("#" + foodMenuImageUploadType).on("submit", function(event) {
        event.preventDefault();
        if(callbackFunc !== undefined) {

            foodMenuImg = $(this).find('[name=foodMenuImg]').val();
            userKey = $(this).find('[name=userKey]').val();
            imgType = $(this).find('[name=imgType]').val();

            PrintLogMessage("FoodMenuManager", "InitUploadFoodMenuImageForm", "user key: " + userKey + " type: " + imgType, LOG_LEVEL_DEBUG)

            if(callbackFunc !== undefined) {
                callbackFunc(foodMenuImg, userKey, imgType)
            }
        }
    })
}

FoodMenuManager.prototype.UploadFoodMenuImage = function (foodMenuImg, userKey, imgType, token) {
    firebaseAuth = this.firebase.auth()
    currentUser = firebaseAuth.currentUser
    if(currentUser) {
        PrintLogMessage("FoodMenuManager", "UploadFoodMenuImage", "user signed in token: " + token, LOG_LEVEL_DEBUG)

    }
    else {
        PrintLogMessage("FoodMenuManager", "UploadFoodMenuImage", "user not signed in", LOG_LEVEL_WARN)
    }
}