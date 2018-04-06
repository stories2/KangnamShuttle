function ParseSignInDataFromForm(authManager, formObject) {
    email = formObject.find("#email").val()
    password = formObject.find("#password").val()
    // PrintLogMessage("AuthViewManager", "ParseSignInDataFromForm", "email: " + email + " pass: " + password, LOG_LEVEL_DEBUG)
    authManager.SignIn(email, password)
}



function ListenFormSubmitEvent(authManager) {
    $('#form-signIn').submit(function(e){
        e.preventDefault();

        var user = firebase.auth().currentUser;
        if (user) {
            // User is signed in.
            authManager.SignOut()
        } else {
            // No user is signed in.
            ParseSignInDataFromForm(authManager, $('#form-signIn'))
        }
    });
}

function SetSubmitButton(text) {
    $("#submit").val(text)
}

function SignInBtn() {
    SetSubmitButton("Sign In")
}

function SignOutBtn() {
    SetSubmitButton("Sign Out")
}