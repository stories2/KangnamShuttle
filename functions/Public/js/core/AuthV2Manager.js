function AuthV2Manager(firebase) {
    PrintLogMessage("AuthV2Manager", "AuthV2Manager", "init", LOG_LEVEL_INFO)
    this.firebase = firebase
}

AuthV2Manager.prototype.InitSignUpForm = function (signUpFormID, callbackFunc) {
    PrintLogMessage("AuthV2Manager", "InitSignUpForm", "init sign up form: " + signUpFormID, LOG_LEVEL_DEBUG)
    $("#" + signUpFormID).on("submit", function(event) {
        HideSignUpForm()
        event.preventDefault();
        userKey = $(this).find('[name=userKey]').val();
        studentID = $(this).find('[name=studentID]').val();
        password = Math.random().toString(36).slice(-8);
        PrintLogMessage("AuthV2Manager", "InitSignUpForm", "submit event accepted student id: " + studentID + " pw: " + password, LOG_LEVEL_DEBUG)

        if(studentID.length == 9 && studentID.match(/^[0-9]+$/) != null) {
            PrintLogMessage("AuthV2Manager", "InitSignUpForm", "student id is valied", LOG_LEVEL_INFO);
            studentEmail = studentID + EMAIL_ENDPOINT
            callbackFunc(userKey, studentEmail, password)
        }
        else {
            PrintLogMessage("AuthV2Manager", "InitSignUpForm", "student id is not avaliable", LOG_LEVEL_WARN);
            alert(ALERT_WARN_WRONG_STUDENT_ID)
        }
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

AuthV2Manager.prototype.SignUp = function (userKey, studentEmail, password, callbackFunc) {
    PrintLogMessage("AuthV2Manager", "SignUp", "sign up process started", LOG_LEVEL_INFO)
    this.firebase.auth().createUserWithEmailAndPassword(studentEmail, password)
        .then(function (result) {
            PrintLogMessage("AuthV2Manager", "SignUp", "signed up user: " + JSON.stringify(result), LOG_LEVEL_INFO)
            // authV2Manager.SignUp(userKey, studentEmail, password, authV2Manager)
            callbackFunc(userKey, studentEmail, password, result["user"]["uid"])
        })
        .catch(function(error) {
        // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
        // ...
            PrintLogMessage("AuthV2Manager", "SignUp", "cannot sign up user code: " + errorCode + " msg: " + errorMessage, LOG_LEVEL_ERROR)
            alert(errorMessage)
    });
}

AuthV2Manager.prototype.SignIn = function (userKey, studentEmail, password, callbackFunc) {
    PrintLogMessage("AuthV2Manager", "SignIn", "sign in process started", LOG_LEVEL_INFO)
    this.firebase.auth().signInWithEmailAndPassword(studentEmail, password)
        .then(function (userSignedInInfo) {
            PrintLogMessage("AuthV2Manager", "SignIn", "user signed in info: " + JSON.stringify(userSignedInInfo), LOG_LEVEL_DEBUG)
            if(callbackFunc !== undefined) {
                callbackFunc(studentEmail)
            }
        })
        .catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
            PrintLogMessage("AuthV2Manager", "SignIn", "cannot sign in code: " + errorCode + " msg: " + errorMessage, LOG_LEVEL_ERROR)
            alert(errorMessage)
    });
}

AuthV2Manager.prototype.ListenUserStatusChanged = function (userSignedInCallbackFunc, userNotSignedInCallbackFunc) {
    this.firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            PrintLogMessage("AuthV2Manager", "ListenUserStatusChanged", "user signed in: " + JSON.stringify(user), LOG_LEVEL_DEBUG)
            if(userSignedInCallbackFunc !== undefined) {
                userSignedInCallbackFunc()
            }
        } else {
            // No user is signed in.
            PrintLogMessage("AuthV2Manager", "ListenUserStatusChanged", "user not signed in", LOG_LEVEL_INFO)
            if(userNotSignedInCallbackFunc !== undefined) {
                userNotSignedInCallbackFunc()
            }
        }
    });
}

AuthV2Manager.prototype.SendVerifyEmail = function (emailAddr, callbackFunc) {
    PrintLogMessage("AuthV2Manager", "SendVerifyEmail", "send verify email to: " + emailAddr, LOG_LEVEL_DEBUG)
    this.firebase.auth().currentUser.sendEmailVerification()
        .then(function () {
            PrintLogMessage("AuthV2Manager", "SendVerifyEmail", "verify email sent", LOG_LEVEL_INFO)
            if(callbackFunc !== undefined) {
                callbackFunc(emailAddr)
            }
        })
        .catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            PrintLogMessage("AuthV2Manager", "SendVerifyEmail", "can't send email code: " + errorCode + " msg: " + errorMessage, LOG_LEVEL_ERROR)
            alert(errorMessage)
        })
}