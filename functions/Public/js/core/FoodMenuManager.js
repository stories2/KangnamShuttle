function FoodMenuManager(firebase) {
    PrintLogMessage("FoodMenuManager", "FoodMenuManager", "init", LOG_LEVEL_INFO)
    this.firebase = firebase
    this.database = this.firebase.database()
    this.dataTransferManager = new DataTransferManager()
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

FoodMenuManager.prototype.InitUploadFoodMenuImageForm = function(foodMenuImageUploadType, token, callbackFunc) {
    PrintLogMessage("FoodMenuManager", "InitUploadFoodMenuImageForm", "init form: " + foodMenuImageUploadType, LOG_LEVEL_DEBUG)
    dataTransferManagerClient = this.dataTransferManager

    $("#" + foodMenuImageUploadType).on("submit", function(event) {
        event.preventDefault();
        if(callbackFunc !== undefined) {

            foodMenuImg = $(this).find('[name=foodMenuImg]').val();
            userKey = $(this).find('[name=userKey]').val();
            imgType = $(this).find('[name=imgType]').val();

            PrintLogMessage("FoodMenuManager", "InitUploadFoodMenuImageForm", "user key: " + userKey + " type: " + imgType, LOG_LEVEL_DEBUG)

            dataTransferManagerClient.PostFileRequestWithCallbackFunc(
                DOMAIN + SUB_DOMAIN_PATH_PRIVATE + "uploadFoodMenuImage",
                new FormData(this),
                function (result) {
                    PrintLogMessage("FoodMenuManager", "UploadFoodMenuImage", "ok data uploaded result: " + result, LOG_LEVEL_INFO)
                    // callbackFunc()
                },
                function (error) {
                    PrintLogMessage("FoodMenuManager", "UploadFoodMenuImage", "failed to upload image: " + error, LOG_LEVEL_ERROR)
                    // callbackFunc()
                },
                token
            )

            if(callbackFunc !== undefined) {
                // callbackFunc(foodMenuImg, userKey, imgType, formData)
            }
        }
    })
}