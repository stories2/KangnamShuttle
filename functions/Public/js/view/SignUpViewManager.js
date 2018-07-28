function HideSignUpForm() {
    $("#signUpForm").hide()
}

function HideDropOutForm() {
    $("#dropOutForm").hide()
}

function MoveToEmailSentPage(emailAddress) {
    pageData = {
        "email": {
            "type": "query",
            "value": emailAddress
        }
    }
    pageManager.RenderContentPage("VerifyEmail", pageData)
}

function DisableEnableBtnDropOutAddress(status) {
    $("#btnDropOutAddress").prop("disabled", status)
}