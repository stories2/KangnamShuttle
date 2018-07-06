function AuthManager() {
    PrintLogMessage("AuthManager", "AuthManager", "init", LOG_LEVEL_INFO)
}

AuthManager.prototype.SignIn = function (email, password) {
    firebase.auth().signInWithEmailAndPassword(email, password)
        .catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            PrintLogMessage("AuthManager", "SignIn", "sign in error: " + errorCode + " -> " + errorMessage, LOG_LEVEL_ERROR)
            // ...
        });
}

AuthManager.prototype.SignOut = function () {
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
        PrintLogMessage("AuthManager", "SignOut", "sign out successfully", LOG_LEVEL_INFO)
    }).catch(function(error) {
        // An error happened.
        PrintLogMessage("AuthManager", "SignOut", "sign out failed: " + error, LOG_LEVEL_ERROR)
    });
}

AuthManager.prototype.CheckCurrentUser = function (signedInFunc, signedOutFunc) {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            PrintLogMessage("AuthManager", "CheckCurrentUser", "already signed in user " + user.displayName + " uid: " + user.uid, LOG_LEVEL_INFO)
            // SetSignInInfo(user.displayName, user.uid)
            if(typeof signedInFunc != 'undefined') {
                signedInFunc()
            }
            authManager.GenerateToken()
        } else {
            // No user is signed in.
            PrintLogMessage("AuthManager", "CheckCurrentUser", "no one has signed in", LOG_LEVEL_WARN)
            // SetSignInInfo("Not signed in", "")
            if(typeof signedOutFunc != 'undefined') {
                signedOutFunc()
            }
        }
    });
}

AuthManager.prototype.GenerateToken = function () {
    firebase.auth().currentUser.getIdToken(/* forceRefresh */ true)
        .then(function(idToken) {
            // Send token to your backend via HTTPS
            // ...
            PrintLogMessage("AuthManager", "GenerateToken", "this is my token: " + idToken, LOG_LEVEL_DEBUG)
            // SetTokenVal(idToken)
        })
        .catch(function(error) {
            // Handle error
            PrintLogMessage("AuthManager", "GenerateToken", "there is something problem", LOG_LEVEL_ERROR)
            // SetTokenVal("Something crashed. Shit!")
        });
}