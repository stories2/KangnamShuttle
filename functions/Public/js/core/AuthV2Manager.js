function AuthV2Manager(firebase) {
    PrintLogMessage("AuthV2Manager", "AuthV2Manager", "init", LOG_LEVEL_INFO)
    this.firebase = firebase
    this.dataTransferManager = new DataTransferManager()
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

        if(studentID.length == 9 && studentID.match(/^[0-9]+$/) != null && userKey.length > 0) {
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

AuthV2Manager.prototype.InitDropOutForm = function (dropOutFormID, callbackFunc) {
    PrintLogMessage("AuthV2Manager", "InitDropOutForm", "init drop out form: " + dropOutFormID, LOG_LEVEL_DEBUG)
    $("#" + dropOutFormID).on("submit", function(event) {
        event.preventDefault();
        userKey = $(this).find('[name=userKey]').val();
        PrintLogMessage("AuthV2Manager", "InitSignUpForm", "submit event accepted", LOG_LEVEL_INFO)

        if(callbackFunc !== undefined) {
            callbackFunc()
        }
    })
}

AuthV2Manager.prototype.SignUp = function (userKey, studentEmail, password, callbackFunc) {
    PrintLogMessage("AuthV2Manager", "SignUp", "sign up process started", LOG_LEVEL_INFO)
    firebaseAuth = this.firebase.auth()
    firebaseAuth.createUserWithEmailAndPassword(studentEmail, password)
        .then(function (result) {
            PrintLogMessage("AuthV2Manager", "SignUp", "signed up user: " + JSON.stringify(result), LOG_LEVEL_INFO)
            // authV2Manager.SignUp(userKey, studentEmail, password, authV2Manager)
            firebaseAuth.currentUser.updateProfile({displayName: userKey})
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

AuthV2Manager.prototype.DropOut = function(userKey, callbackFunc) {
    PrintLogMessage("AuthV2Manager", "DropOut", "drop out current signed in user key: " + userKey, LOG_LEVEL_DEBUG)
    firebaseAuth = this.firebase.auth()
    dataTransferManagerClient = this.dataTransferManager
    currentUser = firebaseAuth.currentUser
    if(currentUser) {
        firebaseAuth.currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
            // Send token to your backend via HTTPS
            // ...
            payLoadData = {
                "userKey": userKey
            }
            PrintLogMessage("AuthV2Manager", "DropOut", "payload data: " + JSON.stringify(payLoadData), LOG_LEVEL_DEBUG)
            dataTransferManagerClient.PostRequestWithCallbackFunc(DOMAIN + SUB_DOMAIN_PATH_PRIVATE + "DropOutUser", payLoadData, function (responseData) {
                PrintLogMessage("AuthV2Manager", "DropOut", "user dropped out: " + responseData, LOG_LEVEL_DEBUG)
                if(callbackFunc !== undefined) {
                    callbackFunc(responseData)
                }
            }, function (errorResponseData) {
                PrintLogMessage("AuthV2Manager", "DropOut", "something wrong while backend dropping out user: " + errorResponseData, LOG_LEVEL_ERROR)
            }, idToken)
        }).catch(function(error) {
            // Handle error
            var errorCode = error.code;
            var errorMessage = error.message;
            PrintLogMessage("AuthV2Manager", "DropOut", "cannot send drop out request code: " + errorCode + " msg: " + errorMessage, LOG_LEVEL_ERROR)
        });
    }
    else {
        PrintLogMessage("AuthV2Manager", "DropOut", "no user signed in", LOG_LEVEL_WARN)
    }
}

AuthV2Manager.prototype.ListenUserStatusChanged = function (userSignedInCallbackFunc, userNotSignedInCallbackFunc) {
    this.firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            PrintLogMessage("AuthV2Manager", "ListenUserStatusChanged", "user signed in: " + JSON.stringify(user), LOG_LEVEL_DEBUG)
            if(userSignedInCallbackFunc !== undefined) {
                userSignedInCallbackFunc(user)
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