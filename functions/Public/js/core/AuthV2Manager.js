function AuthV2Manager(firebase) {
    PrintLogMessage("AuthV2Manager", "AuthV2Manager", "init", LOG_LEVEL_INFO)
    this.firebase = firebase
}

AuthV2Manager.prototype.InitSignUpForm = function (signUpFormID) {
    PrintLogMessage("AuthV2Manager", "InitSignUpForm", "init sign up form: " + signUpFormID, LOG_LEVEL_DEBUG)
    $("#" + signUpFormID).on("submit", function(event) {
        event.preventDefault();
        userKey = $(this).find('[name=userKey]').val();
        studentID = $(this).find('[name=studentID]').val();
        PrintLogMessage("AuthV2Manager", "InitSignUpForm", "submit event accepted student id: " + studentID, LOG_LEVEL_DEBUG)
    })
}

AuthV2Manager.prototype.InitDropOutForm = function (dropOutFormID) {
    PrintLogMessage("AuthV2Manager", "InitDropOutForm", "init drop out form: " + dropOutFormID, LOG_LEVEL_DEBUG)
    $("#" + dropOutFormID).on("submit", function(event) {
        event.preventDefault();
        userKey = $(this).find('[name=userKey]').val();
        PrintLogMessage("AuthV2Manager", "InitSignUpForm", "submit event accepted", LOG_LEVEL_INFO)
    })
}